'use client';
import { useRef,useState } from 'react';
import { useRouter } from 'next/navigation';
import { reviewEnquiry } from './enquiry-actions';
import type { EnquiryRecord } from '@/lib/content/enquiries';
export function EnquiryEditor({record,enabled}:{record:EnquiryRecord;enabled:boolean}){
 const [status,setStatus]=useState(record.status),[notes,setNotes]=useState(record.private_notes),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[locked,setLocked]=useState(false),[stale,setStale]=useState(false),pending=useRef<unknown>(null),router=useRouter();
 return <form className="admin-card admin-review admin-form" onSubmit={async e=>{e.preventDefault();setBusy(true);pending.current??={id:record.id,operationId:crypto.randomUUID(),expectedVersion:record.version,status,notes};try{const r=await reviewEnquiry(pending.current);if(r.ok){pending.current=null;setLocked(false);setMessage('Review saved.');router.refresh();}else{setMessage(r.message);setLocked(r.retry==='same');setStale(r.retry==='refresh');if(r.retry!=='same')pending.current=null;}}catch{setMessage('Save outcome uncertain. Retry the same review.');setLocked(true);}finally{setBusy(false);}}}>
 <h2>Private committee review</h2><fieldset className="admin-editor-fields" disabled={!enabled||busy||locked||stale}><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{['new','in_progress','closed','spam'].map(s=><option key={s}>{s}</option>)}</select></label><label>Private notes<textarea rows={5} maxLength={5000} value={notes} onChange={e=>setNotes(e.target.value)}/></label></fieldset><button disabled={!enabled||busy||stale}>{locked?'Retry same review':'Save review'}</button><p role="status">{message||(!enabled?'Review writes are disabled.':'')}</p>{stale&&<a href={`/admin/enquiries/${record.id}`}>Reload current enquiry</a>}</form>;
}
