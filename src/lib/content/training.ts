import type { PublicContent } from './contract';
export function trainingOccurrences(records:PublicContent[],now=Date.now()){
 return records.filter(r=>r.kind==='training').flatMap(r=>Array.from({length:Number(r.data.repeat_weeks)||1},(_,week)=>{const start=new Date(Date.parse(String(r.data.starts_at)+'+08:00')+week*7*86400000);const local=new Date(start.getTime()+8*3600000).toISOString().slice(0,16);const cancelled=String(r.data.excluded_dates??'').split(',').map(s=>s.trim()).includes(local.slice(0,10));return {record:r,key:`${r.id}:${week}`,starts:local,time:start.getTime(),status:cancelled?'cancelled':String(r.data.session_status)};})).filter(o=>o.time>=now-86400000).sort((a,b)=>a.time-b.time);
}
