import { applicationStatuses, UUID } from './policy';
export type ReviewStatus = typeof applicationStatuses[number];
export type ReviewInput = { applicationId: string; operationId: string; kind: 'status' | 'note'; expectedStatus: ReviewStatus; newStatus: 'under_review' | 'approved' | 'declined' | null; body: string; confirmed: boolean };
export type ReviewResult = { ok: true; status: ReviewStatus } | { ok: false; message: string; retry: 'edit' | 'same' | 'refresh' };
export function transitions(status: string): ReviewInput['newStatus'][] {
  return status === 'submitted' ? ['under_review'] : status === 'under_review' ? ['approved', 'declined'] : [];
}
export const actionLabels = { under_review: 'Start review', approved: 'Approve application', declined: 'Decline application' };
export function reviewInput(raw: unknown): ReviewInput {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Review the submitted fields.');
  const input = raw as Record<string, unknown>;
  const keys = ['applicationId', 'operationId', 'kind', 'expectedStatus', 'newStatus', 'body', 'confirmed'];
  if (Object.keys(input).some(key => !keys.includes(key)) || keys.some(key => !(key in input))) throw Error('Review the submitted fields.');
  if (typeof input.applicationId !== 'string' || !UUID.test(input.applicationId) || typeof input.operationId !== 'string' || !UUID.test(input.operationId)) throw Error('Invalid review reference. Refresh the record.');
  if (!applicationStatuses.some(status => status === input.expectedStatus) || !['status', 'note'].includes(String(input.kind)) || typeof input.body !== 'string' || input.body.includes('\0') || typeof input.confirmed !== 'boolean') throw Error('Review the submitted fields.');
  const body = input.body.trim();
  if (input.kind === 'note') {
    if (input.newStatus !== null || !body || body.length > 2000) throw Error('Enter a plain-text note of 1–2,000 characters.');
  } else {
    if (!input.confirmed) throw Error('Confirm the status change before saving.');
    if (!transitions(String(input.expectedStatus)).includes(input.newStatus as ReviewInput['newStatus'])) throw Error('This status change is not permitted.');
    if (body.length > 500 || (input.newStatus === 'declined' && body.length < 3)) throw Error('A decline requires an internal reason of 3–500 characters. Other reasons may be up to 500 characters.');
  }
  return { applicationId: input.applicationId, operationId: input.operationId, kind: input.kind as ReviewInput['kind'], expectedStatus: input.expectedStatus as ReviewStatus, newStatus: input.newStatus as ReviewInput['newStatus'], body, confirmed: input.confirmed };
}
