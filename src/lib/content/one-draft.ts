import 'server-only';
import { requireAdmin } from '@/lib/admin/auth';
import { presidentPreviewLocked } from '../president-preview';
import type { OneDraftBinding } from './one-draft-contract';

// The completed integration test is retired from deployable code. This module
// retains the editor interface but cannot read a permit or execute a test.
export function oneDraftRestricted() {
  return presidentPreviewLocked() || process.env.ADMIN_CONTENT_WRITE_MODE === 'synthetic' || process.env.CMS_ONE_DRAFT_FILE !== undefined;
}
export function assertOneDraft(_raw: unknown, _actorId: string) {
  void _raw; void _actorId;
  if (oneDraftRestricted()) throw Error('Synthetic CMS operations are disabled.');
}
export async function oneDraftEditor(_kind: string, _isNew: boolean): Promise<OneDraftBinding> {
  void _kind; void _isNew;
  await requireAdmin();
  return { required: oneDraftRestricted(), input: null };
}
