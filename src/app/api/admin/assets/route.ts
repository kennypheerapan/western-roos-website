import { createHash } from 'node:crypto';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { json } from '@/lib/backend/http';
import { contentMode } from '@/lib/content/server';
import { prepareAsset } from '@/lib/content/assets';
import { uuid } from '@/lib/content/contract';
import { oneDraftRestricted } from '@/lib/content/one-draft';
export async function POST(request:Request){
 const actor=await requireAdmin();const mode=contentMode();if(!mode)return json({message:'Uploads are disabled.'},503);
 if(oneDraftRestricted())return json({message:'Uploads are prohibited during the one-draft test.'},403);
 let origin:URL;try{origin=new URL(request.headers.get('origin')??'');}catch{return json({message:'Submit from this website.'},403);}
 if(!['http:','https:'].includes(origin.protocol)||origin.host!==request.headers.get('host'))return json({message:'Submit from this website.'},403);
 const db=database();if(!db)return json({message:'Storage unavailable.'},503);
 const [control,admin,recent]=await Promise.all([db.from('cms_control').select('mode').eq('id',true).single(),db.from('cms_administrators').select('user_id').eq('user_id',actor.id).single(),db.from('cms_assets').select('id',{count:'exact',head:true}).eq('created_by',actor.id).gte('created_at',new Date(Date.now()-3600000).toISOString())]);
 if(control.error||admin.error||recent.error||control.data?.mode!==mode)return json({message:'Storage installation or administrator approval is pending.'},503);
 let prepared:Awaited<ReturnType<typeof prepareAsset>>,label:string,approval:string,people:string,id:string;
 try{
 const reader=request.body?.getReader();if(!reader)throw Error('Choose a file.');const chunks:Uint8Array[]=[];let size=0;for(;;){const item=await reader.read();if(item.done)break;size+=item.value.length;if(size>8500000){await reader.cancel();throw Error('Choose a file no larger than 8 MB.');}chunks.push(item.value);}
 const form=await new Response(Buffer.concat(chunks),{headers:{'Content-Type':request.headers.get('content-type')??''}}).formData();
 const file=form.get('file');id=String(form.get('uploadId')??'');label=String(form.get('label')??'').trim();approval=String(form.get('approval_reference')??'').trim();people=String(form.get('people_status')??'');
 if(!uuid.test(id)||!(file instanceof File)||!label||label.length>180||!approval||approval.length>300||!['no-people','adults-consented'].includes(people))throw Error('Review the file, label, consent and approval reference.');
 prepared=await prepareAsset(Buffer.from(await file.arrayBuffer()),file.type);
 }catch(e){return json({message:e instanceof Error?e.message:'Invalid upload.'},400);}
 const path=`${id}.${prepared.extension}`,digest=createHash('sha256').update(prepared.bytes).digest('hex');
 const asset={id,bucket:prepared.bucket,object_path:path,media_type:prepared.type,size_bytes:prepared.bytes.length,content_sha256:digest,label,approval_reference:approval,people_status:people};
 const existing=await db.from('cms_assets').select('*').eq('id',id).maybeSingle();if(existing.error)return json({message:'Upload state could not be checked. Retry the same upload.'},503);
 if(existing.data){if(existing.data.revoked_at||existing.data.created_by!==actor.id||existing.data.is_synthetic!==(mode==='synthetic')||Object.entries(asset).some(([k,v])=>existing.data[k]!==v))return json({message:'This upload reference belongs to different or withdrawn content.'},409);return json({id,message:'Uploaded privately. Select this asset in the content editor.'},201);}
 if((recent.count??0)>=30)return json({message:'Upload limit reached. Try again later.'},429);
 const upload=await db.storage.from(prepared.bucket).upload(path,prepared.bytes,{contentType:prepared.type,upsert:false,cacheControl:'0'});
 if(upload.error){const previous=await db.storage.from(prepared.bucket).download(path);if(previous.error||!previous.data||createHash('sha256').update(Buffer.from(await previous.data.arrayBuffer())).digest('hex')!==digest)return json({message:'Private upload failed. Nothing was published. Retry the same upload.'},503);}
 const record=await db.rpc('register_content_asset',{p_actor:actor.id,p_mode:mode,p_asset:asset});
 if(record.error){
  // A transport failure can occur after commit. Verify before removing our upload.
  const check=await db.from('cms_assets').select('id').eq('id',id).maybeSingle();
  if(check.data?.id===id)return json({id,message:'Uploaded privately. Select this asset in the content editor.'},201);
  if(!check.error)await db.storage.from(prepared.bucket).remove([path]);
  return json({message:'Upload registration could not be confirmed. Nothing was published; check the private asset list before retrying.'},503);
 }
 return json({id,message:'Uploaded privately. Select this asset in the content editor.'},201);
}
