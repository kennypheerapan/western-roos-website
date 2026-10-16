'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveApplicationReview } from './review-actions';
import { actionLabels, transitions, type ReviewInput, type ReviewResult, type ReviewStatus } from '@/lib/admin/review-contract';

export function ReviewPanel({ applicationId, status, enabled, eligible, storageReady }: { applicationId: string; status: ReviewStatus; enabled: boolean; eligible: boolean; storageReady: boolean }) {
  const router = useRouter();
  const [target, setTarget] = useState<ReviewInput['newStatus']>(null);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [attempt, setAttempt] = useState<ReviewInput | null>(null);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);
  const confirmationHeading = useRef<HTMLHeadingElement>(null);
  const firstAction = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (target) confirmationHeading.current?.focus(); }, [target]);
  const uncertain = !!result && !result.ok && result.retry === 'same';
  const conflict = !!result && !result.ok && result.retry === 'refresh';
  const canWrite = enabled && eligible && storageReady;
  const blocked = pending || uncertain || conflict || !canWrite;
  function send(input: ReviewInput) {
    if (locked.current) return;
    locked.current = true;
    setAttempt(input);
    setResult(null);
    startTransition(async () => {
      try {
        const saved = await saveApplicationReview(input);
        setResult(saved);
        if (saved.ok) {
          if (input.kind === 'note') setNote('');
          else { setReason(''); setTarget(null); setConfirmed(false); }
          setAttempt(null);
          router.refresh();
        }
      } catch {
        setResult({ ok: false, retry: 'same', message: 'The response was interrupted. Retry the same operation to confirm its outcome.' });
      } finally { locked.current = false; }
    });
  }
  function submit(kind: 'status' | 'note') {
    if (blocked) return;
    send({ applicationId, operationId: crypto.randomUUID(), kind, expectedStatus: status, newStatus: kind === 'status' ? target : null, body: kind === 'status' ? reason : note, confirmed: kind === 'status' && confirmed });
  }
  return <section className="admin-card admin-review" aria-busy={pending}>
    <p className="admin-kicker">Application review</p>
    <h2>{canWrite ? 'TEST review actions' : 'Read-only review'}</h2>
    <p className="admin-notice">Application approval does not confirm payment, active membership, registration with a competition, or representative team selection.</p>
    <p className="admin-muted">Proposed administrative test workflow only. Official WRTSC approval policy is not yet confirmed. Orders remain read-only.</p>
    {!enabled ? <p>Application actions are disabled on this server.</p> : !eligible ? <p>This application is not on the server-controlled TEST record list. It remains read-only.</p> : !storageReady ? <p role="status">Review storage is unavailable. Actions cannot be used until the SQL proposal is installed and records can be read.</p> : <>
      {result && <p className="admin-notice" role={result.ok ? 'status' : 'alert'}>{result.ok ? 'Saved to the database. The record and history have been refreshed.' : result.message}</p>}
      {pending && <p role="status">Saving… please wait.</p>}
      {uncertain && attempt && <button type="button" disabled={pending} onClick={() => send(attempt)}>Retry same operation</button>}
      {conflict && <button type="button" onClick={() => { setResult(null); setAttempt(null); setTarget(null); setConfirmed(false); router.refresh(); }}>Refresh record before continuing</button>}
      {!target ? <div className="admin-review-actions">{transitions(status).map((value, index) => value && <button ref={index === 0 ? firstAction : undefined} key={value} type="button" disabled={blocked} onClick={() => { setTarget(value); setConfirmed(false); setResult(null); }}>{actionLabels[value]}</button>)}{transitions(status).length === 0 && <p>Status changes are read-only for {status.replaceAll('_', ' ')} applications. You may still append a private note to an enabled test record.</p>}</div> : <form className="admin-form admin-confirm" aria-label="Confirm status change" onSubmit={event => { event.preventDefault(); submit('status'); }}>
        <h3 ref={confirmationHeading} tabIndex={-1}>Confirm: {actionLabels[target]}</h3>
        <p>Change {status.replaceAll('_', ' ')} to {target.replaceAll('_', ' ')} on this TEST application?</p>
        <label htmlFor="review-reason">Internal reason {target === 'declined' ? '(required)' : '(optional)'}</label>
        <textarea id="review-reason" value={reason} onChange={event => setReason(event.target.value)} maxLength={500} minLength={target === 'declined' ? 3 : undefined} required={target === 'declined'} disabled={blocked} rows={3} />
        <label className="admin-check"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} required disabled={blocked} />I confirm this status change under the proposed TEST workflow.</label>
        <div className="admin-review-actions"><button type="submit" disabled={blocked || !confirmed}>Confirm status change</button><button type="button" disabled={pending || uncertain || conflict} onClick={() => { setTarget(null); setConfirmed(false); requestAnimationFrame(() => firstAction.current?.focus()); }}>Cancel</button></div>
      </form>}
      <form className="admin-form" aria-label="Add internal note" onSubmit={event => { event.preventDefault(); submit('note'); }}>
        <h3>Append a private note</h3><p className="admin-muted">Visible only to authorised administrators. Notes cannot be edited or deleted. Avoid unnecessary sensitive personal information.</p>
        <label htmlFor="review-note">Internal note</label><textarea id="review-note" value={note} onChange={event => setNote(event.target.value)} maxLength={2000} required disabled={blocked} rows={4} />
        <button type="submit" disabled={blocked || !note.trim()}>Add internal note</button>
      </form>
      <p className="admin-muted">Unsaved text is held only in this page’s memory. Keep this page open during an uncertain result and retry the same operation; reloading loses that retry reference.</p>
    </>}
  </section>;
}
