import 'server-only';
import { requireAdmin } from './auth';
import { database } from '../backend/server';
import { fields, tables, type Kind, type ManagedRecord } from './team-contract';
export async function managedRecords(kind:Kind){
 await requireAdmin();
 try{const db=database();if(!db)throw Error();const r=await db.from(tables[kind]).select(['id','version','is_synthetic',...fields[kind].map(f=>f.key)].join(',')).order('created_at',{ascending:false}).limit(1000);if(r.error)throw Error();return {available:true,records:r.data as unknown as ManagedRecord[]};}catch{return {available:false,records:[] as ManagedRecord[]};}
}
export async function teamHistory(kind:Kind,id:string){
 await requireAdmin();try{const db=database();if(!db)throw Error();const r=await db.from('team_admin_events').select('operation_id,actor_id,created_at,before_data,after_data').eq('kind',kind).eq('record_id',id).order('created_at',{ascending:false}).limit(30);if(r.error)throw Error();return {available:true,events:r.data as {operation_id:string;actor_id:string;created_at:string;before_data:ManagedRecord|null;after_data:ManagedRecord}[]};}catch{return {available:false,events:[]};}
}
export async function associationHistory(kind:'roster'|'selection',parentId:string){
 await requireAdmin();try{const db=database();if(!db)throw Error();const key=kind==='roster'?'team_id':'squad_id';const r=await db.from('team_admin_events').select('operation_id,actor_id,created_at,before_data,after_data').eq('kind',kind).eq(`after_data->>${key}`,parentId).order('created_at',{ascending:false}).limit(30);if(r.error)throw Error();return {available:true,events:r.data as Awaited<ReturnType<typeof teamHistory>>['events']};}catch{return {available:false,events:[]};}
}
export async function tournamentReferences(){
 await requireAdmin();try{const db=database();if(!db)throw Error();const r=await db.from('team_tournament_references').select('id,name').order('name');if(r.error)throw Error();return r.data as {id:string;name:string}[];}catch{return [];}
}
