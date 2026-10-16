import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { managedRecords, teamHistory, associationHistory, tournamentReferences } from '@/lib/admin/team-data';
import { teamScope } from '@/lib/admin/team-config';
import { kinds, labels, uuid, type Kind } from '@/lib/admin/team-contract';
import { AssociationManager, RecordEditor, RecordList, type Directory } from './team-editor';
const path=(kind:Kind)=>`/admin/${labels[kind].toLowerCase()}`;
export async function TeamAdminPage({kind,id}:{kind:'team'|'player'|'squad';id?:string}){
 await requireAdmin();
 if(id&&id!=='new'&&!uuid(id))notFound();
 const results=await Promise.all(kinds.map(k=>managedRecords(k)));const directory=Object.fromEntries(kinds.map((k,i)=>[k,results[i].records])) as Directory;
 const available=results.every(r=>r.available);const scope=teamScope();const record=id&&id!=='new'?directory[kind].find(r=>r.id===id):undefined;
 if(available&&id&&id!=='new'&&!record)notFound();
 const reserved=scope.filter(s=>s.startsWith(kind+':')).map(s=>s.split(':')[1]).find(v=>!directory[kind].some(r=>r.id===v));
 const target=record?.id??reserved??'00000000-0000-4000-8000-000000000000';
 const history=record?await teamHistory(kind,record.id):null;
 if(history&&record&&kind!=='player'){const related=await associationHistory(kind==='team'?'roster':'selection',record.id);history.available=history.available&&related.available;history.events=[...history.events,...related.events].sort((a,b)=>b.created_at.localeCompare(a.created_at));}
 const tournaments=kind==='squad'?await tournamentReferences():[];
 return <><p className="admin-kicker">Teams & participation · BUILD 19</p><h1>{id?(id==='new'?`New ${kind}`:kind==='player'?`${record?.first_name??'Player'} ${record?.last_name??''}`:record?.name??'Record unavailable'):labels[kind]}</h1><p className="admin-muted">United Softball Club · community softball in the Perth Softball League. West Coast Marlins · the WRTSC Masters representative program.</p><p><a href={id?path(kind):`${path(kind)}/new`}>{id?`← All ${labels[kind].toLowerCase()}`:`Create ${kind}`}</a></p>
 {!available&&<p role="status" className="admin-notice">BUILD 19 storage is unavailable or awaiting installation. Records cannot be loaded. The SQL proposal must be reviewed before installation.</p>}
 {results.some(r=>r.records.length>=1000)&&<p className="admin-notice">Showing at most 1,000 records per category. A larger-directory paging upgrade is required before this limit is reached.</p>}
 {!id?(available?<RecordList kind={kind} records={directory[kind]}/>:null):<><RecordEditor key={`${target}:${record?.version??0}`} kind={kind} record={record} id={target} writable={available&&scope.includes(`${kind}:${target}`)} directory={directory} syntheticMode={process.env.ADMIN_TEAMS_WRITE_MODE!=='approved'} tournaments={tournaments}/>
 {record&&kind!=='player'&&<AssociationManager kind={kind==='team'?'roster':'selection'} parent={record} directory={directory} scope={scope}/>}
 {record&&kind==='player'&&<section className="admin-card"><h2>Team and squad associations</h2><p>One person record can appear across teams and seasons.</p>{directory.roster.filter(r=>r.player_id===record.id).map(r=><p key={r.id}><a href={`/admin/teams/${r.team_id}`}>{directory.team.find(t=>t.id===r.team_id)?.name??'Team'}</a> · {r.season} · {r.role} · {r.active?'Current':'Removed'}</p>)}{directory.selection.filter(r=>r.player_id===record.id).map(r=><p key={r.id}><a href={`/admin/squads/${r.squad_id}`}>{directory.squad.find(s=>s.id===r.squad_id)?.name??'Squad'}</a> · {r.role} · {r.active?'Current':'Removed'}</p>)}</section>}
 {history&&<section className="admin-card admin-review"><h2>Private audit history</h2>{!history.available?<p>History unavailable.</p>:!history.events.length?<p>No recorded changes.</p>:<ul className="admin-history">{history.events.map(e=><li key={e.operation_id}><p>{new Date(e.created_at).toLocaleString('en-AU',{timeZone:'Australia/Perth'})} · Australia/Perth</p><p className="admin-author">Verified administrator: {e.actor_id}</p><dl>{Object.entries(e.after_data).filter(([key,value])=>!['created_at','updated_at','version','id'].includes(key)&&e.before_data?.[key]!==value).map(([key,value])=><div key={key}><dt>{key.replaceAll('_',' ')}</dt><dd>{String(e.before_data?.[key]??'Not set')} → {String(value??'Not set')}</dd></div>)}</dl></li>)}</ul>}</section>}</>}
 </>;
}
