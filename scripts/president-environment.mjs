import fs from 'node:fs';

export const disabledPreviewSettings = {
  PRESIDENT_PREVIEW_READ_ONLY: 'true',
  ADMIN_APPLICATION_WRITES_ENABLED: 'false',
  ADMIN_PRODUCT_WRITES_ENABLED: 'false',
  ADMIN_TEAMS_WRITES_ENABLED: 'false',
  ADMIN_CONTENT_WRITES_ENABLED: 'false',
  ADMIN_TEAMS_WRITE_MODE: 'disabled',
  ADMIN_CONTENT_WRITE_MODE: 'disabled',
  ENQUIRIES_MODE: 'disabled',
};
const sensitive = /SUPABASE|DATABASE_URL|ADMIN_ALLOWED|ADMIN_REVIEW_TEST|WRITE_ALLOWED_IDS|CMS_ONE_DRAFT|AUTH_MOCK|SESSION_TOKEN|SECRET_KEY|SERVICE_ROLE/i;
export function presidentEnvironment() {
  if (process.env.VERCEL_ENV === 'production') throw Error('This branch is for Preview only. Production build refused.');
  if (process.env.VERCEL) {
    const forbidden = Object.keys(process.env).filter(key => sensitive.test(key) && process.env[key]);
    if (forbidden.length) throw Error('Remove backend credentials, admin identities and test configuration from this branch’s Preview environment: ' + forbidden.join(', '));
  }
  const env = { ...process.env, ...disabledPreviewSettings, NEXT_TELEMETRY_DISABLED: '1' };
  // Read only key names, never load or print local values. Empty inherited
  // values prevent Next from filling these keys from local .env files.
  const keys = new Set(Object.keys(env));
  for (const file of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    if (fs.existsSync(file)) for (const match of fs.readFileSync(file, 'utf8').matchAll(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)) keys.add(match[1]);
  }
  for (const key of keys) if (sensitive.test(key) || key.startsWith('NEXT_PUBLIC_') || key.startsWith('ADMIN_') || key.startsWith('CMS_')) env[key] = '';
  return { ...env, ...disabledPreviewSettings };
}
