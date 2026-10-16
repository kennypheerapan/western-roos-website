import Link from 'next/link';
import { notFound } from 'next/navigation';
import { kinds, modules, schemas, uuid, type Kind } from '@/lib/content/contract';
import { contentAdminData, contentHistory, contentMode } from '@/lib/content/server';
import { ContentEditor } from './content-editor';
import { AssetUploader } from './asset-uploader';
import { AssetLibrary } from './asset-library';
import { oneDraftEditor, oneDraftRestricted } from '@/lib/content/one-draft';
export async function ContentList({module,search}:{module:string;search:Record<string,string|undefined>}){
 if(!modules[module])notFound();const data=await contentAdminData();const sectionKinds=kinds.filter(k=>schemas[k].module===module);
 const rows=data.records.filter(r=>sectionKinds.includes(r.kind)&&(!search.q||`${r.title} ${r.summary}`.toLowerCase().includes(search.q.toLowerCase()))&&(!search.status||r.status===search.status)&&(!search.kind||r.kind===search.kind));
 return <><p className="admin-kicker">Website publishing</p><h1>{modules[module]}</h1><p>Drafts stay private. Publishing needs verified content and explicit approval. Archive preserves the audit history.</p>{!data.available&&<p className="admin-notice">Storage unavailable / installation pending. No records are being represented as saved.</p>}<div className="admin-review-actions">{sectionKinds.map(k=><Link key={k} href={`/admin/${module}/new?kind=${k}`}>Create {schemas[k].label.toLowerCase()} →</Link>)}</div>
 <form className="admin-filters"><label>Search<input name="q" defaultValue={search.q}/></label><label>Status<select name="status" defaultValue={search.status}><option value="">All statuses</option>{['draft','published','archived'].map(s=><option key={s}>{s}</option>)}</select></label><label>Type<select name="kind" defaultValue={search.kind}><option value="">All types</option>{sectionKinds.map(k=><option key={k} value={k}>{schemas[k].label}</option>)}</select></label><button>Filter</button></form>
 <div className="admin-table-wrap"><table><caption>{rows.length} records shown{data.records.length>=1000?' · limit reached; narrow the collection before operational use':''}</caption><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Updated</th></tr></thead><tbody>{rows.length?rows.map(r=><tr key={r.id}><td><Link href={`/admin/${module}/${r.id}`}>{r.title}</Link>{r.is_synthetic&&<span className="admin-secondary">Synthetic / private</span>}</td><td>{schemas[r.kind].label}</td><td>{r.status}</td><td>{new Date(r.updated_at).toLocaleString('en-AU',{timeZone:'Australia/Perth'})}</td></tr>):<tr><td colSpan={4}>No records found. Confirmed content is pending.</td></tr>}</tbody></table></div>
 {['media','documents','sponsors'].includes(module)&&<><AssetUploader enabled={data.available&&!!contentMode()&&!oneDraftRestricted()}/><AssetLibrary assets={data.assets} enabled={data.available&&!!contentMode()&&!oneDraftRestricted()}/></>}</>;
}
export async function ContentDetail({module,id,kind}:{module:string;id:string;kind?:string}){
 if(!modules[module]||id!=='new'&&!uuid.test(id))notFound();const data=await contentAdminData(),record=data.records.find(r=>r.id===id&&schemas[r.kind].module===module);
 const chosen=id==='new'?(kinds.find(k=>k===kind&&schemas[k].module===module)??kinds.find(k=>schemas[k].module===module)):record?.kind;
 if(!chosen||id!=='new'&&!record)notFound();const history=id==='new'?[]:await contentHistory(id);
 const testBinding=await oneDraftEditor(chosen,id==='new');
 return <><Link href={`/admin/${module}`}>← {modules[module]}</Link><h1>{record?'Edit record':'Create draft'}</h1><ContentEditor key={`${id}:${record?.version??0}`} testBinding={testBinding} kind={chosen as Kind} record={record} enabled={data.available&&!!contentMode()} references={data.references}/>{record&&<section className="admin-card"><h2>Audit history</h2><p>Latest 30 changes; full history is retained privately.</p><ul className="admin-history">{history.map(e=><li key={e.operation_id}><strong>{e.action}</strong> · {new Date(e.created_at).toLocaleString('en-AU',{timeZone:'Australia/Perth'})}<p className="admin-author">Administrator {e.actor_id}</p><details><summary>Compare saved versions</summary><pre className="admin-catalog-diff">{JSON.stringify({before:e.before_data,after:e.after_data},null,2)}</pre></details></li>)}</ul></section>}</>;
}
