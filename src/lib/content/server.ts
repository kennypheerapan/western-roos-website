import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { cache } from 'react';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { type ContentRecord, type PublicContent, schemas, type Kind } from './contract';
export function contentMode(){return !presidentPreviewLocked()&&process.env.ADMIN_CONTENT_WRITES_ENABLED==='true'&&['synthetic','approved'].includes(process.env.ADMIN_CONTENT_WRITE_MODE??'')?process.env.ADMIN_CONTENT_WRITE_MODE as 'synthetic'|'approved':null;}
export type Asset={id:string;label:string;media_type:string;is_synthetic:boolean;version:number;revoked_at:string|null};
export type Reference={id:string;title:string;source:string};
export async function contentAdminData(){
 await requireAdmin();const db=database();
 if(!db)return {available:false,records:[] as ContentRecord[],references:[] as Reference[],assets:[] as Asset[]};
 try{const [records,assets,teams,players]=await Promise.all([
 db.from('cms_records').select('*').order('updated_at',{ascending:false}).limit(1000),
 db.from('cms_assets').select('id,label,media_type,is_synthetic,version,revoked_at').order('created_at',{ascending:false}).limit(1000),
 db.from('teams').select('id,name,status').neq('status','archived').limit(1000),
 db.from('players').select('id,display_name,first_name,last_name').eq('active',true).limit(1000)
 ]);
 if(records.error||assets.error||teams.error||players.error)throw Error();
 const rows=records.data as ContentRecord[];
 return {available:true,records:rows,assets:assets.data as Asset[],references:[...rows.filter(r=>r.status!=='archived').map(r=>({id:r.id,title:`${r.title} (${r.status})`,source:r.kind})),...(assets.data as Asset[]).filter(a=>!a.revoked_at).map(a=>({id:a.id,title:a.label,source:a.media_type==='application/pdf'?'pdf':'image'})),...teams.data.map(t=>({id:t.id,title:t.name,source:'team'})),...players.data.map(p=>({id:p.id,title:p.display_name||`${p.first_name} ${p.last_name}`,source:'player'}))]};
 }catch{return {available:false,records:[] as ContentRecord[],references:[] as Reference[],assets:[] as Asset[]};}
}
export async function contentHistory(id:string){await requireAdmin();try{const db=database();if(!db)throw Error();const r=await db.from('cms_events').select('operation_id,actor_id,action,created_at,before_data,after_data').eq('record_id',id).order('created_at',{ascending:false}).limit(30);if(r.error)throw Error();return r.data as {operation_id:string;actor_id:string;action:string;created_at:string;before_data:ContentRecord|null;after_data:ContentRecord}[];}catch{return [];}}
export const publicContent=cache(async():Promise<PublicContent[]>=>{try{const db=database();if(!db)return [];const r=await db.rpc('published_content');if(r.error||!Array.isArray(r.data))return [];return r.data.filter((r:PublicContent)=>Object.hasOwn(schemas,r.kind));}catch{return [];}});
export async function publishedKind(kind:Kind){return (await publicContent()).filter(r=>r.kind===kind);}
