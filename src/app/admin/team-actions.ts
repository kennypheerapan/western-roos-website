'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { teamWritable } from '@/lib/admin/team-config';
import { teamInput, type SaveResult } from '@/lib/admin/team-contract';
export async function saveTeamRecord(raw:unknown):Promise<SaveResult>{
 const actor=await requireAdmin();
 let input;try{input=teamInput(raw);}catch(e){return {ok:false,retry:'edit',message:e instanceof Error?e.message:'Review the fields.'};}
 const references=input.kind==='roster'?[['team',input.data.team_id],['player',input.data.player_id]]:input.kind==='selection'?[['squad',input.data.squad_id],['player',input.data.player_id]]:input.kind==='squad'&&input.data.team_id?[['team',input.data.team_id]]:[];
 if(!teamWritable(input.kind,input.id)||references.some(([kind,id])=>!teamWritable(kind as 'team'|'player'|'squad',String(id))))return {ok:false,retry:'edit',message:'Writes are disabled or a record is outside the approved server scope.'};
 try{const db=database();if(!db)return {ok:false,retry:'edit',message:'Storage unavailable. Nothing was sent.'};const r=await db.rpc('save_team_record',{p_actor:actor.id,p_mode:process.env.ADMIN_TEAMS_WRITE_MODE,p_input:input});if(r.error){if(['team_stale','team_operation_conflict'].includes(r.error.message))return {ok:false,retry:'refresh',message:'This record changed or the operation conflicts. Your draft is retained. Reload to review current data.'};if(['PGRST202','42883'].includes(r.error.code))return {ok:false,retry:'edit',message:'BUILD 19 storage is not installed. No change saved.'};if(r.error.message.startsWith('team_')||['23505','23514','23503','22P02'].includes(r.error.code))return {ok:false,retry:'edit',message:'Change rejected. Check duplicate assignments, pathway, season, workflow status and publication approval.'};throw Error();}if(r.data?.operationId!==input.operationId)throw Error();}catch{return {ok:false,retry:'same',message:'Save outcome is uncertain. Keep this page open and retry the same operation.'};}
 for(const p of ['/admin/teams','/admin/players','/admin/squads','/teams','/clubs/united/teams','/clubs/west-coast-marlins/teams'])revalidatePath(p,'layout');
 return {ok:true,id:input.id,operationId:input.operationId};
}
