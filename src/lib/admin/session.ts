import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { loginDiagnostic } from './diagnostics';

export function authConfig() {
  if (presidentPreviewLocked()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(parsed.hostname))) return null;
    return { url, key };
  } catch { return null; }
}
export async function sessionClient({ writable = false }: { writable?: boolean } = {}) {
  const config = authConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000) }) },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        // Server Components are read-only; the proxy persists their refresh.
        if (!writable) { loginDiagnostic('cookie_refresh_deferred', { ok: true }); return; }
        try {
          values.forEach(({ name, value, options }) => jar.set(name, value, options));
          loginDiagnostic('cookie_write', { ok: true });
        } catch {
          loginDiagnostic('cookie_write', { ok: false });
          throw new Error('Auth cookie persistence failed');
        }
      },
    },
  });
}
