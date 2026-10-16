# Western Roos — President Vercel Preview preparation

Prepared 16 October 2026 (Australia/Perth). **Local preparation verified. Cloud settings still require authenticated verification. No push or deployment performed.**

## Git and Vercel status

- Source repository: `https://github.com/kennypheerapan/western-roos-website.git`.
- Starting branch was `main`, at `a001a073a56a144ab61a2d4b875ce867b136e4e8` (BUILD 03 competition core), with the completed subsequent features uncommitted.
- Read-only `git ls-remote --heads origin` confirmed remote `main` at the same commit. It was the only remote branch returned.
- Review branch: `codex/president-preview`. The approved existing work is included alongside the Preview safety changes. `main` is unchanged.
- Existing project supplied by the owner: [western-roos-website in kenny-projects2](https://vercel.com/kenny-projects2/western-roos-website).
- No local `.vercel` project link or Vercel CLI was present. `vercel.json` now declares Next.js and `npm run build`.
- The project URL redirects to Vercel login in the available browser. Git integration, Production branch, current live deployment/domains, build overrides, Preview variables, protection and team permissions **have not been verified or changed**.

Vercel normally deploys pushes to its configured Production branch to Production; other branches create Preview deployments in an existing project. Confirm this project actually uses `main` for Production before pushing. A new project's first deployment can be Production, so reuse the specified existing project and verify its existing Production deployment. [Vercel environments](https://vercel.com/docs/deployments/environments)

## Read-only isolation

The checked-in `president-preview.config.json` has `locked: true`. This is a source-level lock, independent of environment flags. Vercel Preview also activates the lock. It must not be removed for President review.

| Boundary | Implemented behaviour |
| --- | --- |
| Database | `database()` returns null before reading credentials or constructing a Supabase client |
| Authentication | Auth configuration/session construction disabled; login/logout and private read authorization return not-found |
| Admin dashboards and private data | `/admin/*` and `/api/admin/*` return 404; private read functions independently deny access |
| Writes | Every non-GET/HEAD request is rejected with 403, including direct JSON, multipart and Server Action requests; backend/gate guards remain effective without proxy |
| Membership, orders, enquiries | Server entry points deny persistence; availability endpoints report submissions disabled |
| CMS, teams/players, merchandise, application review | Write gates stay closed even when environment flags say true |
| Uploads and Storage | Upload authorization denied; `/api/media/*` denied; private asset reads cannot construct a backend client |
| Synthetic operations | One-draft permit execution removed from deployable code; no permit file is read; synthetic record payload removed |
| Indexing | Root noindex metadata, `X-Robots-Tag: noindex, nofollow, noarchive`, and `robots.txt` disallow all paths |

**This Preview does not use the existing Supabase database.** No database role, row, permission or Storage object was changed. No CMS Setup, Shutdown, migration, seed or hosted integration test was rerun. The owner-reported final database state is accepted as supplied: both control modes disabled, zero remaining scope/admins/team write scopes, one preserved Draft and one preserved audit row.

The preserved synthetic Draft cannot be obtained through this build: public CMS returns an empty set without a connection, direct content lookup does not resolve it, private routes are denied, and no test title appears in the checked browser artifacts or HTTP responses. This verifies the prepared application boundary, not a new audit of Supabase RLS or of an already deployed site. Cloud checks must follow deployment before sharing the review link.

The Homepage Hero, Western Roos branding, United and Marlins layouts/assets were preserved. Completed feature implementation remains in source. Public pages use existing repository content and honest pending states. The twelve supplied merchandise designs remain visible with no invented prices, sizes or stock; ordering is unavailable. Live CMS content, private admin screens and private players/orders/applications are intentionally outside this public review.

## Preview environment configuration

Apply only to **Preview**, preferably scoped to `codex/president-preview`:

```dotenv
PRESIDENT_PREVIEW_READ_ONLY=true
ADMIN_APPLICATION_WRITES_ENABLED=false
ADMIN_PRODUCT_WRITES_ENABLED=false
ADMIN_TEAMS_WRITES_ENABLED=false
ADMIN_CONTENT_WRITES_ENABLED=false
ADMIN_TEAMS_WRITE_MODE=disabled
ADMIN_CONTENT_WRITE_MODE=disabled
ENQUIRIES_MODE=disabled
```

Do not supply Supabase URL/publishable/secret/service-role keys, database URLs, administrator IDs, write-allowlist IDs, CMS permit paths, mock Auth settings or session tokens to this Preview. Review inherited team/project integration variables too; remove their Preview scope or use empty branch-specific overrides without changing Production. Do not upload `.env.local` or pull Production secrets into this branch.

The build wrapper sanitizes child-process settings and leaves local `.env.local` untouched. On Vercel it fails if backend credentials, admin identities or test configuration are supplied. It also refuses `VERCEL_ENV=production`. `next.config.ts` separately refuses Production builds. Promotion of an already built Preview is still an operational action: do not promote, merge to `main`, use `--prod`, or assign a Production domain.

In project settings, verify Next.js framework, root directory for this repository, `npm run build`, default Next.js output (not the old `out/` static export), and a supported Node runtime. Local verification used Node 24.19.0 / Next.js 16.3.8. No custom domain is needed for review.

Enable or verify **Vercel Authentication / Standard Protection** for generated Preview URLs before publishing. It excludes the Production domains. Ensure the President has an approved way to view the protected deployment. Do not put protection bypass tokens in source or environment examples. Protection has not been enabled from this session because account access is unavailable. Noindex is not access control. [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection)

## Verification results

| Check | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript `tsc --noEmit` | Passed |
| Optimized production build | Passed with Next.js 16.3.8, 29 static pages generated and dynamic server routes |
| Independent server security tests | Passed: 22 private reads/actions denied, zero Supabase client constructions or network calls, gates closed under hostile settings |
| Direct HTTP checks | Passed: 83 checks against the local production build, including all non-read methods, Server Action-style requests, admin/RSC paths, cookies, private media, Draft markers and noindex |
| Source/package and browser scan | Passed: no local environment values, credentials, private/test markers, backups, seeds or fixtures in commit candidates/browser artifacts |
| Responsive smoke | Passed at 390, 768 and 1440 pixels for homepage, United, Marlins, shop and contact; six additional mobile pages checked; no horizontal overflow, observed broken images or browser warning/error logs |
| Interactions | Mobile menu opens; Escape closes and restores focus; merchandise filtering works; checkout is disabled |
| Runtime dependency audit | `npm audit --omit=dev`: zero vulnerabilities after patching Next.js 16.3.8, Sharp 0.35.5 and source-map-js 1.2.2 |
| Full dependency audit | Five high findings in the development-only braces → micromatch → fast-glob → Next ESLint dependency chain; one underlying braces advisory. No compatible fix offered; npm proposes an incompatible major ESLint-config downgrade. Retained and disclosed; these lint tools are not application runtime routes |
| Hosted deployment and database audit | Not run; no deployment authorized, database state accepted from owner |

Windows sandbox restrictions required running the sanitized build and loopback HTTP checks outside the sandbox. No new credentials were loaded into the application. Local evidence lives in ignored `test-results/president-preview/`. Earlier test tooling, reports, SQL packages, fixtures and archives remain on disk but are excluded from this Preview commit. The local verification server is stopped after checks.

## Publication blockers and exact next action

1. Sign in to the linked Vercel project in the Codex browser. Verify the existing GitHub connection, `main` Production branch, existing Production deployment, and all Preview-only settings above. Do not change Production variables or domains.
2. Verify Deployment Protection and President access. Resolve any project output/build overrides or inherited secrets before pushing.
3. Review this local commit and explicitly approve: **“Approve pushing `codex/president-preview` to the existing Western Roos Vercel project for a protected Preview only. Do not merge, promote or update Production.”**
4. Only after that approval and successful configuration verification, publish by pushing this branch:

```powershell
git push -u origin codex/president-preview
```

That push can automatically trigger Vercel, so it is itself the deployment approval boundary. If automatic Preview deployments are disabled, create a deployment of this branch in the existing project and explicitly choose Preview after approval.

5. Verify Vercel labels the deployment **Preview**, confirm an unauthenticated browser is protected, then repeat read-only/noindex checks through authorized access. Verify Production still points to the previous deployment. Share only the generated protected review link with the President.

## Expected review URL

No Preview URL has been allocated yet. The deployment URL is expected to follow `https://western-roos-website-<deployment-id>-kenny-projects2.vercel.app`, subject to Vercel's naming settings. Use the exact URL returned by Vercel after deployment.

The full branch-alias pattern for `codex/president-preview` would exceed Vercel's 63-character DNS-label limit, so its shortened alias cannot be stated reliably before deployment. Do not use the Production URL for this review. [Vercel generated URLs](https://vercel.com/docs/deployments/generated-urls)
