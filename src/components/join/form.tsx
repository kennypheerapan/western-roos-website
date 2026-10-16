"use client";
import { useEffect, useRef, useState } from "react";
import { enquiryPendingMessage, enquiryTopics, type EnquiryTopic, interests, submitEnquiry, validateEnquiry, type Enquiry, type EnquiryErrors, type Interest, type PreferredClub } from "@/lib/enquiry";

export function EnquiryForm({ interest, club, onContextChange, topic, onTopicChange }: { topic?: EnquiryTopic; onTopicChange?: (topic: EnquiryTopic) => void; interest: Interest; club: PreferredClub; onContextChange: (interest: Interest, club: PreferredClub) => void }) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState("");
  const [mode,setMode]=useState('disabled'),[busy,setBusy]=useState(false),[uncertain,setUncertain]=useState(false),[received,setReceived]=useState(false);
  const started=useRef(0),pending=useRef<{requestKey:string;startedAt:number;website:string;enquiry:Enquiry}|null>(null);
  useEffect(()=>{started.current=Date.now();const controller=new AbortController();fetch('/api/enquiries',{signal:controller.signal}).then(r=>r.json()).then(r=>{if(['test','approved'].includes(r.mode))setMode(r.mode);}).catch(()=>{});return ()=>controller.abort();},[]);
  const field = (name: keyof Enquiry) => ({ id: `enquiry-${name}`, name, disabled:busy||uncertain||received, "aria-labelledby": `label-${name}`, "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `error-${name}` : undefined });
  const error = (name: keyof Enquiry) => errors[name] && <span className="enquiry-error" id={`error-${name}`}>{errors[name]}</span>;
  return <form ref={form} className="enquiry-form" noValidate onChange={() => {setStatus("");if(!uncertain)pending.current=null;}} onSubmit={async event => {
    event.preventDefault();
    if(busy||received)return;
    const data = new FormData(event.currentTarget);
    const value: Enquiry = pending.current?.enquiry ?? { name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), message: String(data.get("message") ?? ""), interest, club, topic:topic??'join', consent: data.get("consent") === "on" };
    const next = validateEnquiry(value); setErrors(next);
    const first = Object.keys(next)[0];
    if (first) { setStatus("Please review the highlighted fields. Nothing has been sent."); form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    if(mode==='disabled'){setStatus((await submitEnquiry(value)).message);return;}
    setBusy(true);
    pending.current??={requestKey:crypto.randomUUID(),startedAt:started.current,website:String(data.get('website')??''),enquiry:value};
    try {const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending.current)});const result=await response.json();setStatus(result.message);if(response.ok){setReceived(true);setUncertain(false);}else if(response.status>=500){setUncertain(true);}else{setUncertain(false);pending.current=null;}}
    catch {setStatus('Receipt could not be confirmed. Keep this page open and retry the same submission.');setUncertain(true);}
    finally{setBusy(false);}
  }}>
    <div className="enquiry-pending" id="enquiry-pending"><span className="eyebrow">{mode==='disabled'?'Enquiry preview / Sending unavailable':mode==='test'?'Synthetic test enquiries only':'Contact the committee'}</span><p>{mode==='disabled'?enquiryPendingMessage:mode==='test'?'Use synthetic details and an @example.invalid email address. Test enquiries are stored privately.':'Your enquiry and contact details will be stored privately for authorised committee follow-up.'}</p><p>{mode==='disabled'?'You can check the form below. Your details stay in this page and are not sent or saved. This is not official registration.':'This form does not register a player, confirm selection or create paid membership. Do not include health information or children’s personal details.'}</p></div>
    <label className="enquiry-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <p>All fields are required unless marked optional.</p>
    <div className="enquiry-fields">
      <label htmlFor="enquiry-name"><span id="label-name">Name</span><input {...field("name")} autoComplete="name" required maxLength={100} />{error("name")}</label>
      <label htmlFor="enquiry-email"><span id="label-email">Email</span><input {...field("email")} type="email" autoComplete="email" required maxLength={254} />{error("email")}</label>
      <label htmlFor="enquiry-phone"><span id="label-phone">Phone (optional)</span><input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} />{error("phone")}</label>
      {topic !== undefined && <label htmlFor="enquiry-topic"><span id="label-topic">Enquiry type</span><select {...field("topic")} value={topic} onChange={e => onTopicChange?.(e.target.value as EnquiryTopic)}>{enquiryTopics.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>{error("topic")}</label>}
      {(topic === undefined || topic === "join") && <label htmlFor="enquiry-interest"><span id="label-interest">I&apos;m interested in</span><select {...field("interest")} value={interest} onChange={e => onContextChange(e.target.value as Interest, club)}>{interests.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select>{error("interest")}</label>}
      <label className="enquiry-wide" htmlFor="enquiry-club"><span id="label-club">Organisation / pathway</span><select {...field("club")} value={club} onChange={e => onContextChange(interest, e.target.value as PreferredClub)}><option value="">Not sure</option><option value="western-roos">WRTSC — Organisation</option><option value="united">United — Community Club</option><option value="marlin-masters">West Coast Marlins — Masters Program</option></select>{error("club")}</label>
      <label className="enquiry-wide" htmlFor="enquiry-message"><span id="label-message">Message</span><textarea {...field("message")} required rows={5} maxLength={3000} />{error("message")}</label>
    </div>
    <label className="enquiry-consent" htmlFor="enquiry-consent"><input {...field("consent")} type="checkbox" required /><span id="label-consent">{mode==='disabled'?'I understand this is a preview and my enquiry will not be sent or saved.':'I consent to private storage and committee follow-up about this enquiry (notice enquiry-2026-10).'}</span></label>{error("consent")}
    <button type="submit" className="button" disabled={busy||received} aria-describedby="enquiry-pending">{busy?'Submitting…':received?'Enquiry received':uncertain?'Retry same submission':mode==='disabled'?'Check enquiry (preview)':'Submit enquiry'} <span aria-hidden="true">↗</span></button>
    <p role="status" aria-live="polite" aria-atomic="true" className="enquiry-status">{status}</p>
  </form>;
}
