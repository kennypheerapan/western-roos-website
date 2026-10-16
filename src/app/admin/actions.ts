'use server';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { presidentPreviewLocked } from '@/lib/president-preview';
import { sessionClient } from '@/lib/admin/session';
import { allowedIds } from '@/lib/admin/policy';
import { requireAdmin } from '@/lib/admin/auth';
import { loginDiagnostic } from '@/lib/admin/diagnostics';

export async function login(form: FormData) {
  if (presidentPreviewLocked()) notFound();
  if (!allowedIds(process.env.ADMIN_ALLOWED_USER_IDS)) redirect('/admin/login?state=unavailable');
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 1024 || !email.trim() || !password) {
    loginDiagnostic('form_validation', { ok: false });
    redirect('/admin/login?state=invalid');
  }
  loginDiagnostic('form_validation', { ok: true });
  const client = await sessionClient({ writable: true });
  if (!client) redirect('/admin/login?state=unavailable');
  let failed = false;
  try {
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    failed = !!error;
    loginDiagnostic('password_sign_in', { ok: !error }, error);
  } catch (error) {
    loginDiagnostic('password_sign_in', { ok: false }, error);
    redirect('/admin/login?state=unavailable');
  }
  if (failed) redirect('/admin/login?state=invalid');
  await requireAdmin();
  loginDiagnostic('dashboard_redirect', { ok: true });
  redirect('/admin');
}
export async function logout() {
  if (presidentPreviewLocked()) notFound();
  // Logout must also work for denied/expired sessions. It exposes no private data.
  const client = await sessionClient({ writable: true });
  let failed = false;
  try { if (client) { const { error } = await client.auth.signOut({ scope: 'local' }); failed = !!error; } }
  catch { failed = true; }
  const jar = await cookies();
  for (const { name } of jar.getAll()) if (name.startsWith('sb-') && name.includes('-auth-token')) jar.delete(name);
  redirect(`/admin/login?state=${failed ? 'logout-local' : 'signed-out'}`);
}
