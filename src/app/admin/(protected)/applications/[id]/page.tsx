import { notFound } from 'next/navigation';
import { applicationDetail } from '@/lib/admin/data';
import { date, label, pathway } from '../../../ui';
import { applicationEvents, internalNotes, reviewPageNumber } from '@/lib/admin/review-data';
import { reviewEnabled, reviewEligible } from '@/lib/admin/review-config';
import type { ReviewStatus } from '@/lib/admin/review-contract';
import { ReviewPanel } from '../../../review-panel';
import { ReviewHistory } from '../../../review-history';
export default async function ApplicationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const row = await applicationDetail((await params).id);
  if (!row) notFound();
  const query = await searchParams;
  const [notes, events] = await Promise.all([internalNotes(row.id, reviewPageNumber(query.notesPage)), applicationEvents(row.id, reviewPageNumber(query.activityPage))]);
  return <><a href="/admin/applications">← Applications</a><h1>Application details</h1><p className="admin-reference">{row.reference}</p><section className="admin-card"><h2>{row.first_name} {row.last_name}</h2><dl><dt>Status</dt><dd>{label(row.status)}</dd><dt>Pathway</dt><dd>{pathway(row.pathway)}</dd><dt>Submitted</dt><dd>{date(row.created_at)}</dd><dt>Email</dt><dd>{row.email}</dd><dt>Phone</dt><dd>{row.phone}</dd><dt>Experience / roles</dt><dd>{row.experience.join(', ')}</dd></dl></section><ReviewPanel applicationId={row.id} status={row.status as ReviewStatus} enabled={reviewEnabled()} eligible={reviewEligible(row.id)} storageReady={notes.available && events.available} /><ReviewHistory applicationId={row.id} notes={notes} events={events} /></>;
}
