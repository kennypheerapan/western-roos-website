// Exercise only an explicitly marked, local President build. No live targets.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = 'http://127.0.0.1:3041';
const initial = await fetch(base);
assert.equal(initial.headers.get('x-president-preview'), 'read-only');
const checks = [];
async function check(route, options = {}, expected = 200) {
  const r = await fetch(base + route, { ...options, redirect: 'manual' });
  assert.equal(r.status, expected, `${options.method ?? 'GET'} ${route}`);
  assert.match(r.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.equal(r.headers.get('set-cookie'), null);
  const body = await r.text();
  assert.ok(!/WRTSC CMS Integration Test|sb_secret_|sb_publishable_|must-not-connect|SUPABASE_SECRET_KEY|@example\.invalid/i.test(body), route);
  checks.push({ method: options.method ?? 'GET', route, status: r.status });
  return body;
}
for (const route of ['/', '/clubs', '/clubs/united', '/clubs/west-coast-marlins', '/about', '/join', '/contact', '/teams', '/players', '/training', '/news', '/events', '/gallery', '/fixtures', '/tournaments', '/shop', '/shop/marlins-polo', '/shop/cart', '/checkout', '/sponsors', '/documents', '/resources']) await check(route);
for (const route of ['/admin', '/admin/login', '/admin/applications', '/admin/orders', '/admin/players', '/admin/teams', '/admin/products', '/admin/enquiries', '/admin/news', '/admin/settings', '/api/admin/assets', '/api/admin/assets/00000000-0000-4000-8000-000000000000', '/api/media/00000000-0000-4000-8000-000000000000', '/content/00000000-0000-4000-8000-000000000000', '/.env.local', '/supabase.zip']) await check(route, {}, 404);
for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
  for (const route of ['/', '/join', '/api/membership', '/api/orders', '/api/orders/review', '/api/enquiries', '/api/admin/assets', '/admin/news']) {
    const body = await check(route, { method, headers: { Origin: base, 'Content-Type': 'application/json', 'Next-Action': 'invalid-direct-action' }, body: '{}' }, 403);
    assert.equal(JSON.parse(body).code, 'preview_read_only');
  }
}
await check('/admin/orders', { headers: { Cookie: 'sb-invalid-auth-token=invalid', RSC: '1', 'x-middleware-subrequest': 'proxy:proxy:proxy:proxy:proxy' } }, 404);
assert.equal(JSON.parse(await check('/api/backend')).available, false);
assert.equal(JSON.parse(await check('/api/enquiries')).mode, 'disabled');
const catalog = JSON.parse(await check('/api/catalog'));
assert.equal(catalog.products.length, 12);
assert.ok(catalog.products.every(p => p.offers.length === 0));
assert.match(await check('/robots.txt'), /Disallow: \/\s/);
fs.mkdirSync('test-results/president-preview', { recursive: true });
fs.writeFileSync('test-results/president-preview/http.json', JSON.stringify(checks, null, 2));
console.log(`PASS: ${checks.length} production HTTP checks; pages render; direct mutations and admin/private paths denied; no Draft/test markers or cookies; robots disallows indexing.`);
