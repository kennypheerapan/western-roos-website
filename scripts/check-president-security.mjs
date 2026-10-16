// Local negative tests only. Never loads .env, authenticates or contacts a DB.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
import { presidentEnvironment } from './president-environment.mjs';

let constructions = 0;
const failClient = () => { constructions++; throw Error('Backend constructor reached'); };
globalThis.fetch = async () => { throw Error('Network must never be reached'); };
Object.assign(process.env, {
  PRESIDENT_PREVIEW_READ_ONLY: 'false', VERCEL_ENV: 'preview',
  NEXT_PUBLIC_SUPABASE_URL: 'https://must-not-connect.invalid',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'invalid', SUPABASE_SECRET_KEY: 'invalid',
  ADMIN_ALLOWED_USER_IDS: '00000000-0000-4000-8000-000000000000',
  ADMIN_CONTENT_WRITES_ENABLED: 'true', ADMIN_CONTENT_WRITE_MODE: 'approved',
  ADMIN_TEAMS_WRITES_ENABLED: 'true', ADMIN_TEAMS_WRITE_MODE: 'approved',
  ADMIN_PRODUCT_WRITES_ENABLED: 'true', ADMIN_APPLICATION_WRITES_ENABLED: 'true',
  ENQUIRIES_MODE: 'approved', CMS_ONE_DRAFT_FILE: 'must-not-read',
});
const load = createRequire(import.meta.url), original = Module._load;
Module._extensions['.ts'] = (m, file) => m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, file);
Module._load = function(name, ...args) {
  if (name === 'server-only') return {};
  if (name === '@supabase/supabase-js') return { createClient: failClient };
  if (name === '@supabase/ssr') return { createServerClient: failClient };
  if (name === 'next/navigation') return { notFound() { throw Error('NOT_FOUND'); }, redirect() { throw Error('REDIRECT'); } };
  if (name === 'next/headers') return { cookies() { throw Error('Cookies must not be read'); } };
  if (name === 'next/cache') return { revalidatePath() { throw Error('Mutation must not complete'); } };
  if (name === 'react') return { cache: fn => fn };
  if (name.startsWith('@/')) return original.call(this, path.resolve('src', name.slice(2)), ...args);
  return original.call(this, name, ...args);
};
assert.equal(load('../src/lib/backend/server.ts').database(), null);
assert.equal(load('../src/lib/admin/session.ts').authConfig(), null);
assert.equal(await load('../src/lib/admin/session.ts').sessionClient(), null);
assert.equal(load('../src/lib/content/server.ts').contentMode(), null);
assert.equal(await load('../src/lib/content/enquiries.ts').intakeMode(), 'disabled');
assert.equal(load('../src/lib/admin/review-config.ts').reviewEnabled(), false);
assert.equal(load('../src/lib/admin/product-config.ts').productWritable('marlins-polo'), false);
assert.deepEqual(load('../src/lib/admin/team-config.ts').teamScope(), []);
assert.deepEqual(await load('../src/lib/content/server.ts').publicContent(), []);
assert.deepEqual(await load('../src/lib/teams/public.ts').publishedDirectory(), { teams: [], squads: [], available: false });
const catalog = await load('../src/lib/shop/catalog.ts').publicCatalog();
assert.equal(catalog.products.length, 12);
assert.ok(catalog.products.every(p => p.offers.length === 0));
let denied = 0;
for (const file of ['actions', 'content-actions', 'enquiry-actions', 'product-actions', 'review-actions', 'team-actions']) {
  for (const fn of Object.values(load(`../src/app/admin/${file}.ts`))) {
    await assert.rejects(() => fn({}), /NOT_FOUND/); denied++;
  }
}
for (const [file, names] of [
  ['admin/data', ['applicationList', 'applicationDetail', 'orderList', 'orderDetail', 'overview']],
  ['admin/review-data', ['internalNotes', 'applicationEvents']],
  ['admin/team-data', ['managedRecords', 'teamHistory', 'associationHistory', 'tournamentReferences']],
  ['content/server', ['contentAdminData', 'contentHistory']],
  ['content/enquiries', ['adminEnquiries']],
]) for (const name of names) {
  await assert.rejects(() => load(`../src/lib/${file}.ts`)[name](''), /NOT_FOUND/); denied++;
}
const request = new Request('http://127.0.0.1/api/membership', { method: 'POST', body: '{}' });
for (const kind of ['membership', 'order']) {
  const result = await load('../src/lib/backend/http.ts').submit(request.clone(), kind);
  assert.equal((await result.json()).code, 'preview_read_only');
}
assert.equal((await load('../src/app/api/orders/review/route.ts').POST(request.clone())).status, 403);
assert.equal((await load('../src/app/api/enquiries/route.ts').POST(request.clone())).status, 503);
await assert.rejects(() => load('../src/app/api/admin/assets/route.ts').POST(request.clone()), /NOT_FOUND/);
assert.throws(() => load('../src/lib/content/one-draft.ts').assertOneDraft({}, ''), /disabled/);
assert.equal((await load('../src/lib/content/assets.ts').assetResponse('00000000-0000-4000-8000-000000000000', true)).status, 404);
assert.equal(constructions, 0);
process.env.VERCEL_ENV = 'production';
assert.throws(presidentEnvironment, /Production build refused/);
delete process.env.VERCEL_ENV;
assert.equal(load('../src/lib/backend/server.ts').database(), null, 'Source lock remains without Vercel flags');
process.env.VERCEL = '1';
assert.throws(presidentEnvironment, /Remove backend credentials/);
delete process.env.VERCEL;
assert.equal(presidentEnvironment().SUPABASE_SECRET_KEY, '');
assert.equal(presidentEnvironment().ADMIN_CONTENT_WRITES_ENABLED, 'false');
console.log(`PASS: ${denied} private reads/actions denied; all gates closed under hostile settings; zero client constructors/network calls; private media blocked; public CMS empty; 12 artwork-only products; Production and credential preflights refuse unsafe configuration.`);
