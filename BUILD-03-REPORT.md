# BUILD 03 — Competition Core

Implemented locally on 20 September 2026. No production deployment or git push performed.

## 1. Development summary

Replaced the demo competition presentation with a typed local competition source, reusable views, filtering, and data-driven detail routes. Preserved the site navigation, footer structure, typography, navy/lime/blue system, affiliated club identities, photography and deployment configuration. Removed the footer's obsolete build/demo label. No database, authentication, admin dashboard, secrets or environment variables were added.

## 2. Files created

- `src/data/competition/types.ts`
- `src/data/competition/index.ts`
- `src/data/competition/snapshot.ts`
- `src/components/competition/cards.tsx`
- `src/components/competition/fixtures-browser.tsx`
- `src/components/competition/pages.tsx`
- `src/app/competition.css`
- `scripts/check-competition.mjs`
- `scripts/check-build03.mjs`
- `scripts/check-export.mjs`
- `BUILD-03-REPORT.md`

## 3. Files modified

- `src/app/[...slug]/page.tsx`: competition dispatch, static parameter generation and metadata; removed old demo match handling.
- `src/app/layout.tsx`: imports competition styles.
- `src/components/clubs/shared.tsx`: shared club competition integration.
- `src/components/footer.tsx`: replaces obsolete public build/demo label.
- `src/components/score-card.tsx`: compatibility export for the shared result card.
- `src/components/sections/game-centre.tsx`: shared next/latest selectors and empty states.
- `src/components/sections/tournament.tsx`: data-driven tournament feature.
- `src/components/sections/stories.tsx`: shared confirmed results.
- `src/data/mock.ts`: removes all mock competition records; retains unrelated editorial/media content.
- `src/lib/format.ts`: explicit year in competition dates, retaining deterministic en-AU/UTC formatting.
- `src/types/index.ts`: removes superseded demo fixture type.

## 4. Competition data architecture

`competitionData` in `src/data/competition/index.ts` is the local source of truth. All six collections are intentionally empty: no confirmed tournament, division, team registration, fixture, score or venue dataset was found in the repository.

Types cover Tournament, Division, Team, Fixture, MatchResult and Venue. Divisions reference tournaments and registered team IDs. Fixtures reference their tournament, division, home/away teams and optional venue. Results reference fixture IDs. Tournament venue IDs support multiple locations. Match view models resolve these relationships once for presentation; incomplete team/tournament/division references are not publicly rendered.

Team club identifiers support Western Roos, United, Marlins and external clubs. Family logos/colours resolve from the existing brand registry; individual teams can override identity properties. An external club without supplied artwork gets a neutral diamond badge. Known club identities are not automatically represented as registered competition teams.

Pure selectors provide filtering, chronological ordering, family/club membership, next fixtures, completed results and club tournament participation. Both home and away teams are considered. Final results require a matching final fixture and result; zero scores remain visible. Live scores render only with an explicitly live result.

To add verified records, populate the six collections with unique IDs, valid relationships and URL-safe match IDs/tournament slugs. Use ISO dates and an ISO `startsAt` with an explicit UTC offset for next-game selection. Date/time/venue fields can remain absent when unknown. No timezone is guessed. A future repository/database adapter can supply the same collection and view-model shapes without replacing the UI.

## 5. Routes added/updated

- `/fixtures`: functioning tournament, division, club/team and status filters; reset control; fixture and result sections.
- `/tournaments`: multi-tournament listing or intentional empty state.
- `/fixtures/[id]`: reusable match detail presentation, status, identities, optional score, date/time/venue/diamond and optional summary/notes.
- `/tournaments/[slug]`: overview, divisions, teams and tournament-scoped fixtures/results.

The detail URLs are handled by the existing `[...slug]` route, preserving static export with no new placeholder paths. `generateStaticParams` derives URLs exclusively from actual data. With the current empty collections, there are no public match/tournament detail records; unknown IDs and obsolete `/fixtures/demo-01` return 404 in the production export. Adding records and rebuilding generates their URLs. The installed Next.js static-export, static-params and metadata guides were read before implementation.

Listing metadata describes Western Roos Tournament Softball Club; detail titles/descriptions use actual data and inherit existing site metadata. Existing site-wide noindex settings were left intact.

## 6. Reusable components

CompetitionEmptyState, CompetitionStatus, TeamBadge, ScoreDisplay, FixtureCard, ResultCard, TournamentCard, FixturesBrowser, FixturesPage, TournamentsPage, MatchPage and TournamentPage. Shared cards are used across homepage, clubs, listings and detail views.

## 7. Homepage integration

Game Centre selects the nearest future scheduled family match with a known timestamp and the latest completed family result. Both positions now have intentional empty states. Latest Results also uses the shared source. The tournament feature retains its visual section and CTA, selecting the earliest dated upcoming tournament when present. Fake dates, 08 teams, 24 games, opponents and scores are removed.

The clock is captured outside render in a server-side snapshot module. Static exports reflect the build's snapshot: rebuild/redeploy after competition changes or when time-sensitive selection needs refreshing. No client clock is used during initial render.

## 8. United integration

The existing competition section now queries United participation through shared selectors and renders next fixture, latest result and upcoming tournaments. Current empty states do not imply a registered squad. The rest of the United page and its supplied photos remain intact.

## 9. Marlins integration

The same club competition component queries `west-coast-marlins`. It supports future family identity and tournament participation without duplicating fixture logic. Current empty states replace unsupported competition claims; existing Marlins page identity and other sections remain.

## 10. Empty-state behaviour

Fixtures: “Fixtures coming soon.” Results: “No confirmed results yet.” Tournaments: “Tournament details coming soon.” Filters with no matches explain that another filter or reset can be used. Optional data sections are omitted when absent. No placeholder fixture, tournament, venue, opponent, division, statistic or result is published.

## 11. Hydration investigation

Reviewed application sources for clock/random calls, locale-dependent formatting, window branches, initial mutations and nesting. No random data, render-time browser branches or initial DOM mutations were found. Navigation registers browser handlers in an effect. Dates use explicit en-AU/UTC formatting. The existing footer year renders on the server; new competition selection uses a stable server snapshot.

`node scripts/audit-runtime.mjs` reported HTTP 200, empty body attributes and no console warnings/errors in a clean browser. Build 03 browser checks and the production-export test also reported no hydration errors. The reported `data-new-gr-c-s-check-loaded` / `data-gr-ext-installed` attributes are absent from application code and the clean browser; the evidence is consistent with extension injection. No global or local hydration-warning suppression was introduced. The original extension-enabled session was not reproduced.

The local production export hydrates and its filters function. The deployed Vercel site was not independently checked: its production URL was requested but was not available in this session. This report does not equate local export verification with live-site verification.

## 12. Responsive checks

- Build 03: 15 route/viewport combinations across home, fixtures, tournaments, United and Marlins at 375, 768 and 1366 pixels; no horizontal overflow.
- Isolated synthetic populated match/tournament views: long team names, logos/fallbacks and a zero-to-three-digit score checked at all three widths; no horizontal overflow.
- Existing BUILD 02 regression: 24 combinations at 375, 430, 768, 1366, 1920 and 2560 pixels; passed.
- Existing homepage UI checks: six viewport sizes, mobile menu, Escape, navigation, internal links, images and reduced motion; passed.
- 200% mobile text sizing: existing regression pages and new competition listings passed.
- Visually reviewed competition listing screenshots and populated views. Scores retain their size, team names wrap, and logos preserve aspect ratio.

An additional 1366px test with the root font doubled exposed overflow in the unchanged global header/navigation (scroll width 1546px). Main competition content did not overflow. This existing desktop text-zoom limitation is recorded rather than changing the requested preserved navigation in this build.

## 13. Accessibility checks

One h1 per public page, semantic section headings, native keyboard-operable selects with explicit accessible names, keyboard tab progression, visible select/link/button focus, live filter-count announcement, reset button, contextual match links, descriptive logo alt text and hidden decorative marks. Existing high-contrast palette is retained. This was targeted keyboard/DOM/visual checking, not a full assistive-technology audit.

## 14. Lint and checks

- `npm run lint`: passed, no error suppression added.
- `npm run typecheck`: passed.
- `node scripts/check-competition.mjs`: passed empty-data handling, chronological selection, away-club membership, external exclusion, statuses, combined filters, zero scores, identity fallback, tournament membership, generated paths, metadata and unknown-route handling.
- `node scripts/check-build03.mjs`: passed responsive, empty-state, filter/reset, keyboard, mobile text-zoom, populated layout and clean-browser checks.
- `node scripts/check-build02.mjs`: passed.
- `node scripts/check-ui.mjs`: passed.
- `node scripts/audit-runtime.mjs`: passed.
- `node scripts/check-export.mjs`: passed five production-export routes, hydrated filtering, and three unknown/removed detail URLs returning 404.

Test-only records exist exclusively inside the test process and ignored `test-results/` artifacts. They are never written into the public dataset or exported pages.

## 15. Production build

`npm run build`: passed with installed Next.js 16.3.5. Static-export configuration, dependencies and assets remain unchanged. Build produced all existing public pages and the updated competition listings. No fake detail paths are generated to work around the empty dataset.

The export smoke-test server maps Next's Windows-generated nested segment payload filenames to their dotted browser URL form. This adapter exists only in `scripts/check-export.mjs`; it does not alter production deployment or application routing.

## 16. Known limitations

- Verified competition records are still required before actual detail pages and scores can be published.
- Static content requires rebuild/redeployment; no live updates, backend, authentication or admin interface.
- Next-game selection requires an explicit timestamp. An undated fixture can appear in listings but cannot truthfully be selected as the nearest future match.
- Filter state is local to the page and is not persisted in the URL.
- Malformed/incomplete reference records are excluded by the view-model resolver; a future content-entry workflow should validate them before publication.
- Live Vercel URL verification and the original extension-enabled session remain unverified.
- Existing desktop 200% text-zoom header overflow and site-wide noindex policy remain unchanged.

## 17. Recommended next BUILD

Collect and approve the first competition dataset, add ingestion/reference validation, verify populated detail routes in the deployed environment, and settle the public indexing policy. Database/admin work should be separately scoped after the content model and publishing workflow are approved. BUILD 03 stops here.

Local review: `http://127.0.0.1:3000/fixtures` and `http://127.0.0.1:3000/tournaments`. Run the existing dev server on port 3000 for browser scripts; run the production build before `check-export.mjs`. Run `check-competition.mjs` before `check-build03.mjs` to generate isolated populated-layout test markup. QA screenshots and JSON reports are under ignored `test-results/`.
