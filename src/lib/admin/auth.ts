import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { presidentPreviewLocked } from '../president-preview';
import { sessionClient } from './session';
import { allowedIds, isAllowed } from './policy';
import { loginDiagnostic } from './diagnostics';

/** Required inside every exported private read, independently of layouts/proxy. */
export async function requireAdmin() {
  if (presidentPreviewLocked()) notFound();
  if (!allowedIds(process.env.ADMIN_ALLOWED_USER_IDS)) redirect('/admin/login?state=unavailable');
  const client = await sessionClient();
  if (!client) redirect('/admin/login?state=unavailable');
  let result;
  try { result = await client.auth.getUser(); }
  catch (error) { loginDiagnostic('verified_identity', { ok: false }, error); redirect('/admin/login?state=unavailable'); }
  loginDiagnostic('verified_identity', { ok: !result.error && !!result.data.user }, result.error);
  if (result.error && (!result.error.status || result.error.status >= 500)) redirect('/admin/login?state=unavailable');
  if (result.error || !result.data.user) redirect('/admin/login?state=expired');
  const match = isAllowed(process.env.ADMIN_ALLOWED_USER_IDS, result.data.user.id);
  loginDiagnostic('allowlist_comparison', { ok: match, match });
  if (!match) redirect('/admin/login?state=denied');
  return { id: result.data.user.id };
}
