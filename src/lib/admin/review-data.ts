import 'server-only';
import { requireAdmin } from './auth';
import { database } from '../backend/server';
import { UUID } from './policy';
export type InternalNote = { id: string; author_user_id: string | null; note: string; created_at: string };
export type ReviewEvent = { operation_id: string; actor_user_id: string; kind: 'status' | 'note'; previous_status: string; new_status: string | null; reason: string | null; note_id: string | null; created_at: string };
export type ReviewPage<T> = { available: boolean; rows: T[]; count: number; page: number };
export function reviewPageNumber(raw: string | string[] | undefined) { const value = Number(raw); return Number.isSafeInteger(value) && value > 0 ? Math.min(value, 100000) : 1; }
export async function internalNotes(applicationId: string, page = 1): Promise<ReviewPage<InternalNote>> {
  await requireAdmin();
  if (!UUID.test(applicationId)) throw Error('Invalid record');
  page = reviewPageNumber(String(page));
  const unavailable = { available: false, rows: [], count: 0, page };
  try {
    const db = database(); if (!db) return unavailable;
    const result = await db.from('membership_internal_notes').select('id,author_user_id,note,created_at', { count: 'exact' }).eq('application_id', applicationId).order('created_at', { ascending: false }).order('id').range((page - 1) * 20, page * 20 - 1);
    if (result.error || result.count === null) return unavailable;
    return { available: true, rows: result.data as InternalNote[], count: result.count, page };
  } catch { return unavailable; }
}
export async function applicationEvents(applicationId: string, page = 1): Promise<ReviewPage<ReviewEvent>> {
  await requireAdmin();
  if (!UUID.test(applicationId)) throw Error('Invalid record');
  page = reviewPageNumber(String(page));
  const unavailable = { available: false, rows: [], count: 0, page };
  try {
    const db = database(); if (!db) return unavailable;
    const result = await db.from('membership_application_events').select('operation_id,actor_user_id,kind,previous_status,new_status,reason,note_id,created_at', { count: 'exact' }).eq('application_id', applicationId).order('created_at', { ascending: false }).order('operation_id').range((page - 1) * 20, page * 20 - 1);
    if (result.error || result.count === null) return unavailable;
    return { available: true, rows: result.data as ReviewEvent[], count: result.count, page };
  } catch { return unavailable; }
}
