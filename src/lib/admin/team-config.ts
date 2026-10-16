import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { kinds, uuid, type Kind } from './team-contract';
export function teamScope():string[] {
 if(presidentPreviewLocked())return [];
 const raw=process.env.ADMIN_TEAMS_WRITE_ALLOWED_IDS;
 if(process.env.ADMIN_TEAMS_WRITES_ENABLED!=='true'||!['synthetic','approved'].includes(process.env.ADMIN_TEAMS_WRITE_MODE??'')||!raw)return [];
 const entries=raw.split(',').map(s=>s.trim());
 return entries.every(s=>{const [kind,id,...rest]=s.split(':');return !rest.length&&kinds.includes(kind as Kind)&&uuid(id);})?entries:[];
}
export function teamWritable(kind:Kind,id:string){return teamScope().includes(`${kind}:${id}`);}
