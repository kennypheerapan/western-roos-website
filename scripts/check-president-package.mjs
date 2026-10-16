// Reports filenames only, never credential values. No network or database use.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const candidates = [...new Set(execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).split('\0').filter(Boolean))];
const forbidden = /(^|\/)\.env(?!\.example$)[^/]*$|(^|\/)(?:test-results|\.vercel|node_modules|\.next|supabase)(?:\/|$)|(?:^|\/)(?:(?:build\d+|final)-fixture\.mjs|seed-demo\.sql)$|\.(?:zip|bak|backup)$/i;
assert.deepEqual(candidates.filter(f => forbidden.test(f)), [], 'Non-deployable file in Git candidates');
const secrets = [];
if (fs.existsSync('.env.local')) for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*(\w+)\s*=\s*(.*?)\s*$/);
  if (match) { const value = match[2].replace(/^['"]|['"]$/g, ''); if (value.length >= 16) secrets.push(value); }
}
const keyPattern = /(?:sb_secret_|sb_publishable_)[a-zA-Z0-9_-]{16,}|eyJ[a-zA-Z0-9_-]{16,}\.[a-zA-Z0-9_-]{16,}\.[a-zA-Z0-9_-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
function scan(file, browser = false) {
  if (!/\.(?:ts|tsx|js|mjs|cjs|json|md|html|txt|css|rsc|example)$/.test(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(!secrets.some(value => content.includes(value)), `Local environment value found in ${file}`);
  assert.ok(!keyPattern.test(content), `Credential-like content found in ${file}`);
  if (browser) assert.ok(!/WRTSC CMS Integration Test|must-not-connect\.invalid|SUPABASE_SECRET_KEY|createServerClient|cms-one-draft/i.test(content), `Private/test marker in browser artifact ${file}`);
}
for (const file of candidates) scan(file);
let compiled = 0;
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else { scan(file, true); compiled++; }
  }
}
walk('.next/static');
// HTML/RSC outputs can expose server data even when browser JS is clean.
for (const file of fs.globSync('.next/server/app/**/*.{html,rsc}')) { scan(file, true); compiled++; }
assert.ok(compiled > 0, 'Run the production build before the package scan');
console.log(`PASS: ${candidates.length} Git candidate files and ${compiled} browser/prerender artifacts scanned; no local environment values, credentials, private/test markers, backups, seeds or fixtures found.`);
