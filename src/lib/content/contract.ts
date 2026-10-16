import definitions from './schema.json';
export type Kind = keyof typeof definitions;
export type Field = {key:string;label:string;type:string;source?:string;required?:boolean;options?:string[];min?:number;max?:number};
export const schemas = definitions as Record<Kind,{label:string;module:string;fields:Field[]}>;
export const kinds = Object.keys(schemas) as Kind[];
export const modules:Record<string,string> = {training:'Training',competitions:'Competitions',tournaments:'Tournaments',events:'Events',content:'News & Content',media:'Media',sponsors:'Sponsors',documents:'Documents'};
export const pathways = {'western-roos':'WRTSC',united:'United community club','west-coast-marlins':'Marlins Masters program'};
export type Payload = {title:string;summary:string;body:string;status:'draft'|'published'|'archived';pathway:keyof typeof pathways;display_order:number;public_author:string;approval_reference:string;data:Record<string,string|number|string[]|null>};
export type ContentRecord = Payload & {id:string;kind:Kind;version:number;is_synthetic:boolean;published_at:string|null;updated_at:string;author_id:string};
export type PublicContent = Omit<ContentRecord,'approval_reference'|'author_id'|'is_synthetic'|'version'|'updated_at'>;
export type SaveInput={id:string;kind:Kind;operationId:string;expectedVersion:number;record:Payload};
export type SaveResult={ok:true;id:string}|{ok:false;message:string;retry:'edit'|'same'|'refresh'};
export const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function videoEmbed(value:string){
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port)return null;
 const yt=['www.youtube.com','youtube.com','youtu.be'].includes(u.hostname)?(u.hostname==='youtu.be'?u.pathname.slice(1):u.pathname==='/watch'?u.searchParams.get('v'):null):null;
 if(yt&&/^[\w-]{11}$/.test(yt))return `https://www.youtube-nocookie.com/embed/${yt}`;
 if(['vimeo.com','www.vimeo.com'].includes(u.hostname)&&/^\/\d{1,12}$/.test(u.pathname))return `https://player.vimeo.com/video${u.pathname}`;
 }catch{}return null;
}
export function safeURL(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.hostname.includes('.')&&!/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.)/.test(u.hostname);}catch{return false;}}
export function blankRecord(kind:Kind):Payload{return {title:'',summary:'',body:'',status:'draft',pathway:'western-roos',display_order:0,public_author:'',approval_reference:'',data:Object.fromEntries(schemas[kind].fields.map(f=>[f.key,f.type==='references'?[]:f.type==='number'?(f.required?f.min??0:null):f.type==='select'?f.options?.[0]??'':'']))};}
function object(v:unknown):Record<string,unknown>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid form.');return v as Record<string,unknown>;}
function text(v:unknown,max:number){if(typeof v!=='string'||v.length>max||v.includes('\0'))throw Error(`Text must be no longer than ${max} characters.`);return v.trim();}
export function contentInput(raw:unknown):SaveInput{
 const x=object(raw);if(Object.keys(x).sort().join(',')!=='expectedVersion,id,kind,operationId,record'||!uuid.test(String(x.id))||!uuid.test(String(x.operationId))||!kinds.includes(x.kind as Kind)||!Number.isSafeInteger(x.expectedVersion)||Number(x.expectedVersion)<0)throw Error('Invalid record or version.');
 const kind=x.kind as Kind,r=object(x.record),d=object(r.data),fields=schemas[kind].fields;
 if(Object.keys(r).sort().join(',')!=='approval_reference,body,data,display_order,pathway,public_author,status,summary,title'||Object.keys(d).sort().join(',')!==fields.map(f=>f.key).sort().join(','))throw Error('Unexpected fields.');
 const record:Payload={title:text(r.title,180),summary:text(r.summary,600),body:text(r.body,20000),public_author:text(r.public_author,120),approval_reference:text(r.approval_reference,300),status:r.status as Payload['status'],pathway:r.pathway as Payload['pathway'],display_order:Number(r.display_order),data:{}};
 if(!record.title||!['draft','published','archived'].includes(record.status)||!Object.hasOwn(pathways,record.pathway)||!Number.isInteger(r.display_order)||Math.abs(record.display_order)>10000)throw Error('Review title, status, pathway and display order.');
 if(record.status==='published'&&(!record.approval_reference||!record.public_author))throw Error('Publishing requires approval evidence and an approved public author name.');
 for(const f of fields){const v=d[f.key];if(f.type==='references'){if(!Array.isArray(v)||v.length>50||v.some(a=>typeof a!=='string'||!uuid.test(a))||new Set(v.map(a=>String(a).toLowerCase())).size!==v.length)throw Error(`Review ${f.label}.`);record.data[f.key]=v.map(a=>String(a).toLowerCase());continue;}
 if(f.type==='number'){if(v===null&&!f.required){record.data[f.key]=null;continue;}if(!Number.isInteger(v)||Number(v)<(f.min??0)||Number(v)>(f.max??10000))throw Error(`Review ${f.label}.`);record.data[f.key]=Number(v);continue;}
 const s=text(v,f.type==='textarea'?5000:f.type==='url'||f.type==='video'?2000:500);record.data[f.key]=s;
 if(!s){if(f.required&&record.status==='published')throw Error(`${f.label} is required before publication.`);continue;}
 if(f.type==='select'&&!f.options?.includes(s)||f.type==='reference'&&!uuid.test(s)||f.type==='url'&&!safeURL(s)||f.type==='video'&&!videoEmbed(s)||f.type==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(s)||new Date(s).toISOString().slice(0,10)!==s)||f.type==='datetime-local'&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)||!Number.isFinite(Date.parse(s+'+08:00')))||f.type==='dates'&&!s.split(',').every(v=>/^\d{4}-\d{2}-\d{2}$/.test(v.trim())&&Number.isFinite(Date.parse(v.trim()))))throw Error(`Review ${f.label}.`);
 if(f.type==='reference')record.data[f.key]=s.toLowerCase();
 if(f.type==='url')record.data[f.key]=new URL(s).href;
 if(f.type==='video'){const embed=videoEmbed(s)!;record.data[f.key]=embed.startsWith('https://www.youtube-nocookie.com/')?'https://www.youtube.com/watch?v='+embed.split('/').pop():'https://vimeo.com/'+embed.split('/').pop();}
 }
 const data=record.data;
 if(data.ends_at&&data.starts_at&&String(data.ends_at)<=String(data.starts_at)||data.ends_on&&data.starts_on&&String(data.ends_on)<String(data.starts_on))throw Error('End must follow the start.');
 if(kind==='fixture'&&data.match_status==='final'&&(data.home_score===null||data.away_score===null))throw Error('A final result needs both scores.');
 if(kind==='fixture'&&data.match_status!=='final'&&(data.home_score!==null||data.away_score!==null))throw Error('Only final results can carry scores.');
 if(kind==='media'&&record.status==='published'&&!!data.asset_id===!!data.video_url)throw Error('Choose one approved photograph or video.');
 if(kind==='training'&&data.session_status!=='scheduled'&&!data.change_notice)throw Error('Add the cancellation or change notice.');
 return {id:String(x.id).toLowerCase(),kind,operationId:String(x.operationId).toLowerCase(),expectedVersion:Number(x.expectedVersion),record};
}
export const perthDate=(s:string)=>new Intl.DateTimeFormat('en-AU',{dateStyle:'medium',timeStyle:'short',timeZone:'Australia/Perth'}).format(new Date(s+'+08:00'));
