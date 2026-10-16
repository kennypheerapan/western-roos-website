'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { contentMode } from '@/lib/content/server';
import { contentInput,uuid, type SaveResult } from '@/lib/content/contract';
import { assertOneDraft, oneDraftRestricted } from '@/lib/content/one-draft';
export async function saveContent(raw:unknown):Promise<SaveResult>{
 const actor=await requireAdmin();
 let input;try{assertOneDraft(raw,actor.id);input=contentInput(raw);}catch{return {ok:false,retry:'edit',message:'Save rejected. Check the permitted operation, expiry and form.'};}
 const mode=contentMode();if(!mode)return {ok:false,retry:'edit',message:'Content writes are disabled. Database installation and operational approval are pending.'};
 try{const db=database();if(!db)return {ok:false,retry:'edit',message:'Storage unavailable. No save attempted.'};const r=await db.rpc('save_content',{p_actor:actor.id,p_mode:mode,p_input:input});
 if(r.error){if(['cms_stale','cms_conflict'].includes(r.error.message))return {ok:false,retry:'refresh',message:'The record changed or this operation conflicts. Your draft is retained. Reload and compare before saving again.'};if(['PGRST202','42883'].includes(r.error.code))return {ok:false,retry:'edit',message:'The content database is not installed. Nothing was saved.'};if(r.error.message.startsWith('cms_')||['23505','23514','23503','22P02','22007','22008'].includes(r.error.code))return {ok:false,retry:'edit',message:`Save rejected (${r.error.message.startsWith('cms_')?r.error.message:'validation'}). Check approval, dependencies, draft status and confirmed details.`};throw Error();}
 if(r.data?.operationId!==input.operationId||r.data?.id!==input.id)throw Error();
 }catch{return {ok:false,retry:'same',message:'Save outcome is uncertain. Retry the same operation before editing these details.'};}
 revalidatePath('/','layout');return {ok:true,id:input.id};
}
export async function withdrawAsset(raw:unknown):Promise<SaveResult>{
 const actor=await requireAdmin(),mode=contentMode();if(!mode)return {ok:false,retry:'edit',message:'Asset changes are disabled.'};
 if(oneDraftRestricted())return {ok:false,retry:'edit',message:'Asset changes are prohibited during the one-draft test.'};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {ok:false,retry:'edit',message:'Invalid asset.'};const input=raw as Record<string,unknown>;
 if(Object.keys(input).sort().join(',')!=='expectedVersion,id,operationId'||!uuid.test(String(input.id))||!uuid.test(String(input.operationId))||!Number.isSafeInteger(input.expectedVersion)||Number(input.expectedVersion)<1)return {ok:false,retry:'edit',message:'Invalid asset or version.'};
 try{const db=database();if(!db)throw Error();const r=await db.rpc('withdraw_content_asset',{p_actor:actor.id,p_mode:mode,p_input:input});if(r.error){if(['cms_stale','cms_conflict'].includes(r.error.message))return {ok:false,retry:'refresh',message:'The asset changed. Reload before trying again.'};if(r.error.message.startsWith('cms_'))return {ok:false,retry:'edit',message:'Withdrawal rejected by the database gate or record scope.'};throw Error();}if(r.data?.operationId!==input.operationId)throw Error();}catch{return {ok:false,retry:'same',message:'Withdrawal could not be confirmed. Retry the same request.'};}
 revalidatePath('/','layout');return {ok:true,id:String(input.id)};
}
