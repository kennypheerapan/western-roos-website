/** Shared, credential-free BUILD 19 form contract. Database constraints repeat these rules. */
export const kinds = ['team','player','roster','squad','selection'] as const;
export type Kind = typeof kinds[number];
export type Value = string | boolean | null;
export type RecordData = Record<string, Value>;
export type ManagedRecord = RecordData & { id: string; version: string; is_synthetic: boolean };
export const tables: Record<Kind,string> = {team:'teams',player:'players',roster:'team_roster_memberships',squad:'tournament_squads',selection:'tournament_squad_members'};
export const labels = {team:'Teams',player:'Players',roster:'Roster',squad:'Squads',selection:'Squad selections'};
export const roles = ['Player','Coach','Assistant Coach','Manager','Official'];
export type Field = { key:string; label:string; type?:'text'|'textarea'|'checkbox'|'select'; options?:string[]; required?:boolean; max?:number };
const pathway:Field = {key:'pathway',label:'Participation pathway',type:'select',options:['united','marlins','both']};
const publication:Field[] = [{key:'public_visible',label:'Approve public display',type:'checkbox'},{key:'authorisation_reference',label:'Publication authorisation reference (private)',max:500}];
export const fields:Record<Kind,Field[]> = {
 team:[{key:'name',label:'Team display name',required:true,max:120},{...pathway,options:['united','marlins']},{key:'category',label:'Confirmed category / division',max:120},{key:'season',label:'Season',required:true,max:80},{key:'description',label:'Description',type:'textarea',max:3000},{key:'status',label:'Team status',type:'select',options:['draft','active','archived']},...publication],
 player:[{key:'first_name',label:'First name',required:true,max:100},{key:'last_name',label:'Last name',required:true,max:100},{key:'display_name',label:'Preferred public display name',max:120},{key:'player_number',label:'Player number',max:20},{key:'position',label:'Playing position',max:100},pathway,{key:'notes',label:'Internal notes (private)',type:'textarea',max:3000},{key:'active',label:'Active player',type:'checkbox'},{key:'age_status',label:'Age / safeguarding status',type:'select',options:['unknown','adult_verified','minor']},...publication],
 roster:[{key:'team_id',label:'Team',required:true},{key:'player_id',label:'Existing player',required:true},{key:'season',label:'Season',required:true,max:80},{key:'role',label:'Team role',type:'select',options:roles},{key:'active',label:'On current roster',type:'checkbox'},{key:'public_visible',label:'Approve this roster association for public display',type:'checkbox'}],
 squad:[{key:'name',label:'Squad display name',required:true,max:120},{...pathway,options:['united','marlins']},{key:'team_id',label:'Associated team (optional)'},{key:'tournament_id',label:'Existing tournament (optional)'},{key:'season',label:'Season',required:true,max:80},{key:'description',label:'Description',type:'textarea',max:3000},{key:'status',label:'Squad status',type:'select',options:['draft','under_review','confirmed','archived']},...publication],
 selection:[{key:'squad_id',label:'Squad',required:true},{key:'player_id',label:'Existing player',required:true},{key:'role',label:'Squad role',type:'select',options:roles},{key:'eligibility_reference',label:'Manual eligibility review reference (private)',required:true,max:500},{key:'active',label:'Selected in squad',type:'checkbox'},{key:'public_visible',label:'Approve this selection for public display',type:'checkbox'}],
};
export const uuid = (v:unknown):v is string => typeof v==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
export function defaults(kind:Kind):RecordData { return Object.fromEntries(fields[kind].map(f=>[f.key,f.type==='checkbox'?f.key==='active':f.options?.[0]??(f.key.endsWith('_id')?null:'')])); }
export type TeamInput = {kind:Kind;id:string;operationId:string;expectedVersion:string;data:RecordData};
export type SaveResult = {ok:true;id:string;operationId:string}|{ok:false;retry:'edit'|'refresh'|'same';message:string};
export function teamInput(raw:unknown):TeamInput {
 const fail=(s:string):never=>{throw Error(s);};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return fail('Review the record.');
 const r=raw as TeamInput;
 if(Object.keys(r).sort().join()!==['kind','id','operationId','expectedVersion','data'].sort().join()||!kinds.includes(r.kind)||!uuid(r.id)||!uuid(r.operationId)||typeof r.expectedVersion!=='string'||!/^\d{1,9}$/.test(r.expectedVersion))return fail('Invalid record or version. Reload and try again.');
 if(!r.data||typeof r.data!=='object'||Array.isArray(r.data)||Object.keys(r.data).sort().join()!==fields[r.kind].map(f=>f.key).sort().join())return fail('Unexpected or missing fields.');
 for(const f of fields[r.kind]){const v=r.data[f.key];if(f.type==='checkbox'){if(typeof v!=='boolean')fail('Invalid '+f.label);continue;}if(f.key.endsWith('_id')){if(v===null&&!f.required)continue;if(f.key==='tournament_id'){if(typeof v!=='string'||!v||v.length>120)fail('Invalid tournament.');}else if(!uuid(v))fail('Choose '+f.label);continue;}if(typeof v!=='string'||v!==v.trim()||v.length>(f.max??120)||(f.required&&!v)|| (f.options&&!f.options.includes(v)))fail('Review '+f.label+'.');}
 if(r.data.public_visible){if(['team','squad'].includes(r.kind)&&r.data.status!==(r.kind==='team'?'active':'confirmed'))fail('Only active teams or confirmed squads can be published.');if(r.kind==='player'&&(r.data.age_status!=='adult_verified'||!r.data.active||!r.data.display_name))fail('Public profiles require a verified adult, an active record and an approved display name.');if(['team','player','squad'].includes(r.kind)&&!r.data.authorisation_reference)fail('Record the publication authorisation reference.');if(['roster','selection'].includes(r.kind)&&!r.data.active)fail('Removed associations cannot be public.');}
 return r;
}
