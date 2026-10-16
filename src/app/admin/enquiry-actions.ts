'use server';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { contentMode } from '@/lib/content/server';
import { uuid,type SaveResult } from '@/lib/content/contract';
import { revalidatePath } from 'next/cache';
export async function reviewEnquiry(raw:unknown):Promise<SaveResult>{
 const actor=await requireAdmin(),mode=contentMode();if(!mode)return {ok:false,retry:'edit',message:'Enquiry review writes are disabled.'};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {ok:false,retry:'edit',message:'Invalid review.'};
 const x=raw as Record<string,unknown>;if(Object.keys(x).sort().join(',')!=='expectedVersion,id,notes,operationId,status'||!uuid.test(String(x.id))||!uuid.test(String(x.operationId))||!Number.isSafeInteger(x.expectedVersion)||Number(x.expectedVersion)<1||typeof x.notes!=='string'||x.notes.length>5000||!['new','in_progress','closed','spam'].includes(String(x.status)))return {ok:false,retry:'edit',message:'Review status and notes.'};
 try{const db=database();if(!db)throw Error();const r=await db.rpc('review_club_enquiry',{p_actor:actor.id,p_mode:mode,p_input:x});if(r.error){if(['cms_stale','cms_conflict'].includes(r.error.message))return {ok:false,retry:'refresh',message:'Another change was saved. Reload and compare; your unsaved draft is retained.'};if(r.error.message.startsWith('cms_')||r.error.message.startsWith('enquiry_'))return {ok:false,retry:'edit',message:'Review rejected. Check the permitted record scope and database gate.'};throw Error();}if(r.data?.operationId!==x.operationId)throw Error();}catch{return {ok:false,retry:'same',message:'Save outcome is uncertain. Retry this same review.'};}
 revalidatePath('/admin/enquiries');return {ok:true,id:String(x.id)};
}
