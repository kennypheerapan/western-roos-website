'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { reviewEnabled, reviewEligible } from '@/lib/admin/review-config';
import { reviewInput, type ReviewResult, type ReviewStatus } from '@/lib/admin/review-contract';
export async function saveApplicationReview(raw: unknown): Promise<ReviewResult> {
  const actor = await requireAdmin(); // Never catch Next's authentication redirects.
  if (!reviewEnabled()) return { ok: false, retry: 'edit', message: 'Application actions are disabled. Records remain read-only.' };
  let input;
  try { input = reviewInput(raw); } catch (error) {
    return { ok: false, retry: 'edit', message: error instanceof Error ? error.message : 'Review the submitted fields.' };
  }
  if (!reviewEligible(input.applicationId)) return { ok: false, retry: 'edit', message: 'This record is not enabled for TEST review. It remains read-only.' };
  const db = database();
  if (!db) return { ok: false, retry: 'edit', message: 'Review storage is unavailable. Nothing was sent.' };
  let status: ReviewStatus;
  try {
    const { data, error } = await db.rpc('review_membership_application', {
      p_operation_id: input.operationId, p_application_id: input.applicationId, p_actor_id: actor.id,
      p_kind: input.kind, p_expected_status: input.expectedStatus, p_new_status: input.newStatus, p_body: input.body,
    });
    if (error) {
      if (['review_stale', 'review_operation_conflict', 'review_not_found'].includes(error.message)) return { ok: false, retry: 'refresh', message: 'The record changed or this operation conflicts with an earlier request. Refresh the record before starting another action.' };
      if (['review_invalid', 'review_transition', 'review_reason_required'].includes(error.message)) return { ok: false, retry: 'edit', message: 'The change was rejected. Check the current status, confirmation and internal reason.' };
      if (error.code === 'PGRST202' || error.code === '42883') return { ok: false, retry: 'edit', message: 'Review storage is not installed or available. No change was saved.' };
      return { ok: false, retry: 'same', message: 'The save could not be confirmed. Retry this exact operation; do not start a replacement request.' };
    }
    if (!data || data.operationId !== input.operationId || !['submitted', 'under_review', 'approved', 'declined', 'withdrawn'].includes(data.status)) throw Error('Unconfirmed receipt');
    status = data.status;
  } catch {
    return { ok: false, retry: 'same', message: 'The save could not be confirmed. Retry this exact operation; do not start a replacement request.' };
  }
  revalidatePath(`/admin/applications/${input.applicationId}`);
  revalidatePath('/admin/applications');
  revalidatePath('/admin');
  return { ok: true, status };
}
