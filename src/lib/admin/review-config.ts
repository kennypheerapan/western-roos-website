import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { allowedIds } from './policy';
export function reviewEnabled() {
  if (presidentPreviewLocked()) return false;
  return process.env.ADMIN_APPLICATION_WRITES_ENABLED === 'true' && !!allowedIds(process.env.ADMIN_REVIEW_TEST_APPLICATION_IDS);
}
export function reviewEligible(applicationId: string) {
  return reviewEnabled() && (allowedIds(process.env.ADMIN_REVIEW_TEST_APPLICATION_IDS)?.has(applicationId.toLowerCase()) ?? false);
}
