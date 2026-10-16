import 'server-only';
import sharp from 'sharp';
import { database } from '@/lib/backend/server';
import { publicContent } from './server';
import { uuid } from './contract';
export async function prepareAsset(bytes:Buffer,type:string){
 if(!bytes.length||bytes.length>8388608)throw Error('Choose a file no larger than 8 MB.');
 if(type==='application/pdf'){
  const content=bytes.toString('latin1');
  if(!content.startsWith('%PDF-')||!content.slice(-1024).includes('%%EOF')||/\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia|OpenAction|AA)\b/i.test(content))throw Error('Use a plain PDF without active content or attachments.');
  return {bytes,type:'application/pdf',extension:'pdf',bucket:'wrtsc-documents-private'};
 }
 if(!['image/jpeg','image/png','image/webp'].includes(type))throw Error('Only JPEG, PNG, WebP and PDF are allowed.');
 const processor=sharp(bytes,{limitInputPixels:24000000,animated:false});const info=await processor.metadata();
 if(!['jpeg','png','webp'].includes(info.format??'')||(info.pages??1)>1)throw Error('Use a still JPEG, PNG or WebP image.');
 return {bytes:await processor.rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer(),type:'image/webp',extension:'webp',bucket:'wrtsc-images-private'};
}
export async function assetResponse(id:string,privatePreview=false){
 if(!uuid.test(id))return new Response('Not found',{status:404});
 if(!privatePreview&&!(await publicContent()).some(r=>r.data.asset_id===id))return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 try{const db=database();if(!db)throw Error();const r=await db.from('cms_assets').select('bucket,object_path,media_type,size_bytes').eq('id',id).single();if(r.error||!r.data)throw Error();const file=await db.storage.from(r.data.bucket).download(r.data.object_path);if(file.error||!file.data)throw Error();return new Response(file.data,{headers:{'Content-Type':r.data.media_type,'Content-Length':String(file.data.size),'Content-Disposition':`${r.data.media_type==='application/pdf'?'attachment':'inline'}; filename="${id}.${r.data.media_type==='application/pdf'?'pdf':'webp'}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Referrer-Policy':'no-referrer'}});}catch{return new Response('File unavailable',{status:404,headers:{'Cache-Control':'no-store'}});}
}
