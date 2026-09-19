# BUILD 02 — Clubs Experience

Status: implemented for visual review. BUILD 03 has not been started.

1. **Architecture:** dedicated static App Router pages, a shared club component system, and a typed editorial registry. The existing catch-all retains the other BUILD 01 routes; its obsolete club placeholders were removed.
2. **Routes:** `/clubs`, `/clubs/united`, `/clubs/west-coast-marlins`. No additional club routes.
3. **Club hub:** editorial family hero with parent and affiliated logos, two distinct club introductions, factual side-by-side pathway comparison, shared community and join CTA.
4. **United hero:** full official United logo, navy/red typography, supplied team photograph and restrained red framing. Western Roos context remains secondary.
5. **United sections:** introduction, four player pathways, action photography, demo competition desk, achievements, provisional news, gallery and join.
6. **Photography:** inspected the 40 supplied files using a contact sheet. Eight selected originals: IMG_5663 (team hero), IMG_5670 (night batting), IMG_5639 (day fielding), IMG_5664 (achievement photograph), IMG_5632 (awards gathering), IMG_5655 (women’s team huddle), IMG_5647 (club life), IMG_5656 (team circle). New WebP derivatives preserve original files.
7. **Achievements:** typed records support title, year, competition and media. Current record uses neutral wording; no unverified title or year has been assigned.
8. **United gallery:** three intimate images in a staggered desktop layout and compact mobile grid; no full collection download or duplicate homepage gallery.
9. **United join:** closing CTA links to the existing `/join` page. No registration or membership logic added.
10. **Marlins hero:** official logo, blue/navy arch, layered watermark, diamond geometry, gold accents and oversized type. No player photography.
11. **Marlins sections:** introduction, masters statement, league/tournament/representative pathways, competition information, representative opportunities, future editorial area and join/enquire.
12. **Future Marlins media:** set `clubEditorial['west-coast-marlins'].hero` to approved media to replace the hero graphic; `action[0]` replaces the competition graphic. Populate `news` and `gallery` arrays to render their shared sections. The brand config tracks photography availability.
13. **Shared components:** ClubFamilyNav, ClubGraphic, ClubIntro, ClubPathways, ClubCompetition, ClubNews, ClubGallery and ClubJoinCTA. United and Marlins retain separate page compositions.
14. **Theme/config:** extended Club with parentLabel, background, tagline and photographyAvailable. Added optional editorialSecondary and a CSS variable to keep United editorial red separate from the approved homepage card theme. Existing logo and compactLogo fields remain authoritative.
15. **Cross-navigation:** a contextual family nav links Western Roos home, club hub, United and Marlins Masters; active destinations use `aria-current`. Existing homepage and global navigation links already target the correct routes.
16. **Responsive:** checked all four pages at 375, 430, 768, 1366, 1920 and 2560 pixels; no horizontal overflow. Long names, graphic hero, pathways, galleries and CTAs adapt to narrow screens.
17. **Accessibility:** one h1 per page, semantic sections/headings, meaningful unnamed-person alt text, decorative watermark alt text, keyboard links, inherited visible focus states and skip link. Hero motion is enabled only when reduced motion is not requested. Browser checks include 200% text zoom and mobile navigation.
18. **Performance:** server components, eight selected WebP photographs, Next Image with responsive sizes and fixed aspect ratios; only the United hero photo is preloaded. Below-fold photos lazy-load. The existing static-export configuration remains unchanged, including `images.unoptimized`; WebP derivatives provide the image compression rather than a runtime optimizer.
19. **Homepage regression:** homepage component and global CSS remain unchanged. Existing links resolve to the new pages. Browser checks cover homepage images, layout, links and console. Visual comparison identified and corrected a shared United card colour change. Before/after page dimensions match; screenshots are not pixel-identical because below-fold lazy images completed differently between captures.
20. **Demo/provisional:** United fixture/result teasers reuse existing mock data and are labelled DEMO. United news is explicitly provisional with no invented date or announcement. Marlins has no fabricated schedule. Achievement records and membership information await confirmation.
21. **Assets/content needed:** approved Marlins photography, official club stories, verified achievement records, official fixtures/results, confirmed membership and enquiry/contact information. No fees, eligibility ages or dates have been invented.
22. **Lint:** `npm run lint` — passed.
23. **Typecheck:** `npm run typecheck` — passed.
24. **Production build:** `npm run build` — passed; all three BUILD 02 routes are statically generated.
25. **Local run:** from the project directory, run `npm run dev -- --port 3000`. The existing server is already running at http://127.0.0.1:3000. For this static-export project, `npm run build` generates `out/`; `next start` is not the static-export serving workflow.
26. **Local URLs:** http://127.0.0.1:3000/clubs · http://127.0.0.1:3000/clubs/united · http://127.0.0.1:3000/clubs/west-coast-marlins. Regression page: http://127.0.0.1:3000/.
27. **Files:**
    - Created `src/app/clubs/page.tsx`, `src/app/clubs/united/page.tsx`, `src/app/clubs/west-coast-marlins/page.tsx`, `src/app/clubs/clubs.css`.
    - Created `src/components/clubs/shared.tsx`, `src/config/club-editorial.ts`, `scripts/check-build02.mjs` and this report.
    - Updated `src/app/[...slug]/page.tsx`, `src/config/brands.ts`, `src/types/index.ts`, `src/components/ui.tsx`.
    - Added `public/media/club/united/build02-{5632,5639,5647,5655,5656,5663,5664,5670}.webp`.
    - QA output: `test-results/build02-report.json`, route/viewport screenshots, hero screenshots, contact sheet and homepage before/after captures. Generated build output remains under the existing ignored directories.

Browser validation is reproducible with `node scripts/check-build02.mjs` while the local development server runs. It checks 24 route/viewport combinations, image loading, one h1 per route, console/page errors, direct URLs, internal links, mobile navigation, club switching, absence of United images on Marlins, and 200% text zoom.
