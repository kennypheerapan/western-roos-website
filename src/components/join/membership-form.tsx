"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { experienceOptions, type ApplicationDraft, type ParticipationDetails, type ParticipationPathway } from "@/lib/membership/domain";
import { fieldStep, initialApplication, membershipPathways, participationFor, stepNames, validateApplication, type ApplicationErrors, type Field } from "@/lib/membership/application";

import {useBackend,postSubmission} from '@/lib/backend/client';

type TextField = "firstName" | "lastName" | "dateOfBirth" | "email" | "phone" | "emergencyName" | "emergencyRelationship" | "emergencyPhone" | "notes";
export function MembershipForm({ pathway, interest, choose }: { pathway: ParticipationPathway | ""; interest: string; choose: (p: ParticipationPathway) => void }) {
  const backend=useBackend();
  const submission=useRef<{signature:string;key:string}|null>(null);
  const [saved,setSaved]=useState('');
  const params = useSearchParams();
  const [value, setValue] = useState(() => initialApplication(pathway, interest));
  const [previousPathway, setPreviousPathway] = useState(pathway);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const requestedStep = Number(params.get("step") ?? 0);
  const step = Number.isInteger(requestedStep) && requestedStep >= 0 ? Math.min(requestedStep, furthest, 6) : 0;
  if (previousPathway !== pathway) {
    setPreviousPathway(pathway); setSaved('');
    setValue({ ...value, participation: participationFor(pathway), previewAcknowledgement: false });
    setFurthest(0); setErrors({}); setStatus("");
  }
  const [previousStep, setPreviousStep] = useState(step);
  if (previousStep !== step) { setPreviousStep(step); setStatus(""); }
  const lastStep = useRef(step);
  useEffect(() => {
    if (lastStep.current !== step) { heading.current?.focus(); lastStep.current = step; }
  }, [step]);
  function go(next: number) {
    setErrors({}); setStatus("");
    const query = new URLSearchParams(params.toString());
    query.set("step", String(next));
    window.history.pushState(null, "", `/join?${query}#enquiry`);
  }
  function update<K extends keyof ApplicationDraft>(key: K, next: ApplicationDraft[K]) {
    setValue(v => ({ ...v, [key]: next, previewAcknowledgement: key === "previewAcknowledgement" ? next as boolean : false }));
    setStatus("");
    setErrors(e => ({ ...e, [key]: undefined }));
  }
  function detail(key: string, next: string) {
    update("participation", { ...value.participation, [key]: next } as ParticipationDetails);
    setErrors(e => ({ ...e, [key === "experience" ? "previousExperience" : key]: undefined }));
  }
  const attrs = (key: Field) => ({ id: `membership-${key}`, name: key, "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `membership-error-${key}` : undefined });
  const error = (key: Field) => errors[key] && <span className="enquiry-error" id={`membership-error-${key}`}>{errors[key]}</span>;
  function input(key: TextField, label: string, type = "text", autoComplete = "off") {
    return <label htmlFor={`membership-${key}`}><span>{label}</span><input {...attrs(key)} type={type} autoComplete={autoComplete} required value={value[key]} maxLength={type === "email" ? 254 : type === "tel" ? 40 : 100} onChange={e => update(key, e.target.value)} />{error(key)}</label>;
  }
  function textArea(key: Field, label: string, text: string, onChange: (text: string) => void, maxLength = 1500) {
    return <label className="enquiry-wide" htmlFor={`membership-${key}`}><span>{label}</span><textarea {...attrs(key)} rows={4} maxLength={maxLength} value={text} onChange={e => onChange(e.target.value)} />{error(key)}</label>;
  }
  function select(key: Field, label: string, current: string, options: readonly (readonly [string, string])[]) {
    return <label htmlFor={`membership-${key}`}><span>{label}</span><select {...attrs(key)} required value={current} onChange={e => detail(key, e.target.value)}><option value="">Choose an option</option>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select>{error(key)}</label>;
  }
  function showErrors(next: ApplicationErrors) {
    const first = Object.keys(next)[0] as Field;
    if (fieldStep[first] !== step) go(fieldStep[first]);
    setErrors(next); setStatus("Please review the highlighted fields. Nothing has been sent.");
    requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  }
  const p = value.participation;
  const rows: [string, string, number][] = [
    ["Pathway", membershipPathways.find(item => item.id === p.pathway)?.title ?? "Not chosen", 0],
    ["First name", value.firstName, 1], ["Last name", value.lastName, 1], ["Date of birth", value.dateOfBirth, 1], ["Email", value.email, 1], ["Phone", value.phone, 1],
    ["Experience / roles", value.experience.join(", "), 2],
    ...(p.pathway === "united" ? [["Involvement", p.involvement === "both" ? "Player and non-player" : p.involvement === "player" ? "Player" : "Non-player", 3], ["Participation preference", p.preference === "not-sure" ? "Not sure" : p.preference, 3], ["Previous experience", p.experience, 3]] as [string, string, number][] : []),
    ...(p.pathway === "marlins" ? [["Masters representative interest", p.representativeInterest === "explore" ? "Explore opportunities" : p.representativeInterest, 3], ["Tournament interest", p.tournamentInterest, 3], ["Previous experience", p.experience, 3]] as [string, string, number][] : []),
    ...("guidance" in p ? [["Help finding a pathway", p.guidance, 3]] as [string, string, number][] : []),
    ["Emergency contact", value.emergencyName, 4], ["Relationship", value.emergencyRelationship, 4], ["Emergency phone", value.emergencyPhone, 4], ["Additional information", value.notes, 5],
  ];
  if(saved) return <div className="enquiry-form membership-form"><h3>Application saved</h3><p role="status">Reference: {saved}. Your test application was saved privately. Membership and selection are not confirmed. No email was sent.</p></div>;
  return <form ref={form} className="enquiry-form membership-form" noValidate onSubmit={async e => {
    e.preventDefault();
    if (busy || saved) return;
    const next = validateApplication(value, step === 6 ? undefined : step);
    if (Object.keys(next).length) { showErrors(next); return; }
    if (step < 6) { setFurthest(Math.max(furthest, step + 1)); go(step + 1); return; }
    setBusy(true);
    try {
      const signature=JSON.stringify(value);
      if(!submission.current || submission.current.signature!==signature) submission.current={signature,key:crypto.randomUUID()};
      const result=await postSubmission('/api/membership',{requestKey:submission.current.key,application:value});
      setSaved(result.reference); setStatus('Application saved. Reference: '+result.reference+'. Membership and selection are not confirmed.');
    } catch(error) { setStatus(error instanceof Error ? error.message : "Submission could not be confirmed. Please retry."); }
    finally { setBusy(false); }
  }}>
    <div className="enquiry-pending" id="membership-preview"><span className="eyebrow">Application / Test submission</span><p>{backend.message} Use sample details while official policies are pending. Refreshing or leaving may clear your entries.</p><p>Fees, season dates, eligibility and registration conditions await official confirmation. This preview does not register you or confirm selection.</p></div>
    <div className="membership-progress"><p role="status" aria-live="polite" aria-atomic="true">Step {step + 1} of 7 — {stepNames[step]}</p><progress max={7} value={step + 1} aria-label={`Application progress: step ${step + 1} of 7`} /><ol aria-label="Application steps">{stepNames.map((name, i) => <li key={name} aria-current={i === step ? "step" : undefined}><span aria-hidden="true">{i + 1}. </span>{name}</li>)}</ol></div>
    <h3 ref={heading} tabIndex={-1} className="membership-step-title"><span className="sr-only">Step {step + 1} of 7: </span>{stepNames[step]}</h3>
    <p>All fields are required unless marked optional.</p>
    {step === 0 && <fieldset className="membership-options" aria-describedby={errors.pathway ? "membership-error-pathway" : undefined}><legend>Choose your pathway</legend>{membershipPathways.map(item => <label key={item.id}><input {...attrs("pathway")} id={`membership-pathway-${item.id}`} type="radio" value={item.id} checked={pathway === item.id} onChange={() => choose(item.id)} required /><span><strong>{item.title}</strong><span>{item.copy}</span></span></label>)}{error("pathway")}</fieldset>}
    {step === 1 && <div className="enquiry-fields">{input("firstName", "First name", "text", "given-name")}{input("lastName", "Last name", "text", "family-name")}{input("dateOfBirth", "Date of birth", "date", "bday")}{input("email", "Email", "email", "email")}{input("phone", "Phone", "tel", "tel")}</div>}
    {step === 2 && <fieldset className="membership-options" aria-describedby={errors.experience ? "membership-error-experience" : undefined}><legend>Your experience and roles — choose all that apply</legend>{experienceOptions.map(option => <label key={option}><input {...attrs("experience")} id={`membership-experience-${option.replaceAll(" ", "-")}`} type="checkbox" checked={value.experience.includes(option)} onChange={e => update("experience", e.target.checked ? [...value.experience, option] : value.experience.filter(v => v !== option))} /><span>{option}</span></label>)}{error("experience")}</fieldset>}
    {step === 3 && <><p>{p.pathway === "marlins" ? "Tell us about your interest in WRTSC’s Masters Representative Program. Eligibility and selection details are pending." : p.pathway === "united" ? "Tell us how you would like to take part in United’s community / PSL pathway. These are interests, not confirmed membership types or available programs." : "No experience or pathway preference is needed. Share what you would like help exploring."}</p><div className="enquiry-fields">
      {p.pathway === "united" && <>{select("involvement", "Player / non-player interest", p.involvement, [["player", "Player"], ["non-player", "Non-player"], ["both", "Both"]])}{select("preference", "Preferred participation type", p.preference, [["social", "Social softball"], ["competitive", "Competitive / PSL"], ["support", "Coaching, umpiring or volunteering"], ["not-sure", "Not sure yet"]])}</>}
      {p.pathway === "marlins" && <>{select("representativeInterest", "Masters representative interest", p.representativeInterest, [["playing", "Playing"], ["support", "Supporting the program"], ["explore", "Explore opportunities"]])}{textArea("tournamentInterest", "Representative / tournament interest (optional)", p.tournamentInterest, v => detail("tournamentInterest", v))}</>}
      {"experience" in p && textArea("previousExperience", "Previous softball experience (optional)", p.experience, v => detail("experience", v))}
      {"guidance" in p && textArea("guidance", "What would you like help with? (optional)", p.guidance, v => detail("guidance", v))}
    </div></>}
    {step === 4 && <><p>Use sample contact details for testing. Submitting to a connected backend saves these details privately.</p><div className="enquiry-fields">{input("emergencyName", "Emergency contact name")}{input("emergencyRelationship", "Relationship")}{input("emergencyPhone", "Emergency contact phone", "tel")}</div></>}
    {step === 5 && <div className="enquiry-fields">{textArea("notes", "Anything else you would like WRTSC to know? (optional)", value.notes, v => update("notes", v), 3000)}</div>}
    {step === 6 && <><p>Check your details before submitting.</p><div className="membership-review">{[0, 1, 2, 3, 4, 5].map(section => <section key={section}><div className="membership-review-heading"><h4>{stepNames[section]}</h4><button type="button" className="join-reset" onClick={() => go(section)} aria-label={`Edit ${stepNames[section]}`}>Edit</button></div><dl>{rows.filter(row => row[2] === section).map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text || "Not provided (optional)"}</dd></div>)}</dl></section>)}</div>
      <div className="enquiry-pending membership-policies"><h4>Official documents pending</h4><p><strong>Privacy Policy — pending official wording.</strong></p><p><strong>Terms / membership conditions — pending official wording.</strong></p><p>These documents are not available for acceptance yet. The acknowledgement below permits test storage; it does not accept these pending documents.</p></div>
      <label className="enquiry-consent" htmlFor="membership-previewAcknowledgement"><input {...attrs("previewAcknowledgement")} type="checkbox" required checked={value.previewAcknowledgement} onChange={e => update("previewAcknowledgement", e.target.checked)} /><span>I understand that submitting saves these details privately when the backend is connected. I am using sample details for this test. No membership is created, and the Privacy Policy and membership terms are pending.</span></label>{error("previewAcknowledgement")}
    </>}
    <div className="membership-actions">{step > 0 && <button type="button" className="button membership-back" onClick={() => go(step - 1)}>← Back</button>}<button type="submit" className="button" disabled={busy || !!saved} aria-describedby="membership-preview">{step === 6 ? saved ? "Application saved" : busy ? "Submitting…" : "Submit test application" : "Continue →"}</button></div>
    <p className="enquiry-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
  </form>;
}
