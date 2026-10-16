# Western Roos — President Preview

This branch preserves the completed Western Roos website and its approved Homepage Hero, United identity and West Coast Marlins identity. It is prepared for a read-only Vercel Preview, not a Production launch.

The application uses Next.js App Router and server routes. It is not a static `out/` export. Public club content and supplied artwork are available from the repository. Supabase, private administration and all submissions are disabled for this review build.

## Local review

```powershell
npm ci
npm run preview:president
```

Open http://127.0.0.1:3021 while the command runs. The launcher builds with sanitized child-process settings and leaves `.env.local` untouched. No database setup, migrations, seeds or CMS test operations are part of this workflow.

## Verification

```powershell
npm run lint
npm run typecheck
npm run test:president-security
npm run build
node scripts/check-president-package.mjs
```

`check-president-http.mjs` targets only a local production server at port 3041 and refuses to run unless the read-only marker is present. Earlier integration tooling and evidence remain local and ignored; they are not part of the Preview package.

## Safety and publication

The checked-in `president-preview.config.json` locks backend construction, authentication, private reads and write gates. Request protection additionally rejects non-GET/HEAD requests and returns 404 for admin and media endpoints. Noindex metadata, response headers and robots rules are enabled. Vercel Production builds are refused. Removing this lock or promoting the deployment requires a separately approved release.

The Preview build must not receive Supabase credentials, administrator identities, mock Auth settings or CMS permits. A Vercel build fails if these are present. Vercel Deployment Protection and branch settings must be verified before the first push.

See [President Vercel Preview report](PRESIDENT-VERCEL-PREVIEW.md) for the environment configuration, verification results, blockers and approval-gated publication steps. Nothing has been pushed or deployed by this preparation.
