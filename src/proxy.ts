import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { loginDiagnostic } from './lib/admin/diagnostics';
import { presidentPreviewLocked } from './lib/president-preview';

export async function proxy(request: NextRequest) {
  if (presidentPreviewLocked()) {
    const headers = {
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Referrer-Policy': 'no-referrer',
      'X-President-Preview': 'read-only',
    };
    // Covers direct API calls, multipart uploads and Server Action POSTs on
    // every route. DAL guards remain authoritative if proxy is bypassed.
    if (!['GET', 'HEAD'].includes(request.method)) {
      return NextResponse.json({ code: 'preview_read_only', message: 'President review mode: nothing can be sent or saved.' }, { status: 403, headers });
    }
    const path = request.nextUrl.pathname;
    if (/^\/(?:admin|api\/admin|api\/media)(?:\/|$)/.test(path)) {
      return new NextResponse('Not found', { status: 404, headers });
    }
    const response = NextResponse.next();
    Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }
  if (!request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const client = createServerClient(url, key, {
        cookieOptions: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
        global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000) }) },
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(values) {
            values.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });
      const { error } = await client.auth.getUser();
      loginDiagnostic('proxy_identity', { ok: !error }, error);
    } catch (error) { loginDiagnostic('proxy_identity', { ok: false }, error); }
  }
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
export const config = { matcher: ['/:path*'] };
