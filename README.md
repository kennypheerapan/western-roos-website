# Western Roos — BUILD 01.2

A frontend-only Next.js App Router, TypeScript and Tailwind CSS foundation with a premium sports-editorial homepage. Custom styling uses shared tokens, locally bundled Inter and Barlow Condensed fonts, navy/blue parent branding and restrained lime accents. No remote font requests or image dependencies.

## Run locally

From this directory:

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:3000 . The preview is local and has not been published.

## Structure

- `src/app/`: homepage, shared layout, global styles, static destination routes and 404.
- `src/components/sections/`: Hero, GameCentre, ClubsSection, TournamentSection, ResultsSection, NewsSection, BeyondSection, GallerySection, JoinSection and SponsorsSection.
- `src/components/`: Navigation, Footer, ScoreCard and shared buttons, headings, brand/media components.
- `src/config/brands.ts`: typed parent and arbitrary club configurations; contact placeholders.
- `src/config/media.ts`: central source, crop, responsive-size and preload map for Hero, News, Gallery, Beyond the Diamond, Community and Join photography.
- `src/data/mock.ts`: all demonstration fixtures, results, tournament, editorial stories, gallery media and sponsors.
- `src/types/`: reusable domain models.
- `src/lib/`: date and score formatting.
- `public/brands/western-roos/`, `public/brands/united/`, `public/brands/west-coast-marlins/`: original brand assets.
- `public/images/club/united/`: supplied United club photography, retained unchanged.
- `public/media/club/united/`: selected web-optimized homepage derivatives.
- `scripts/check-ui.mjs`: browser verification using Playwright and installed Microsoft Edge.

## Routes

`/`, `/clubs`, `/clubs/united`, `/clubs/west-coast-marlins`, `/tournaments`, `/fixtures`, `/fixtures/demo-01`, `/fixtures/demo-02`, `/teams`, `/news`, `/news/on-the-diamond`, `/news/meet-our-clubs`, `/news/behind-the-scenes`, `/gallery`, `/about`, `/join`, plus a custom 404. Secondary pages are intentional minimal foundations. Generated from a static catch-all with validated routes; unknown paths return 404.

## Brand and asset integration

Add a club to `clubs` in `src/config/brands.ts` to create its card, brand registry entry and statically generated club route. CSS custom properties keep primary, secondary, accent and text colours out of component conditionals. Red belongs only to United context.

All four supplied original logos are integrated unchanged in public/brands/. Western Roos appears in navigation, footer and score cards. The United full logo appears in its club card and club page; the USC monogram appears in score cards and as a subtle club-card watermark. Object-fit preserves original aspect ratios. West Coast Marlins uses its original full logo on its shared club card and generated club page, with navy, royal blue, gold and white theme tokens. The former future-club placeholder is removed.

Supplied United photography gives the Western Roos homepage authentic action, team, achievement and club-life moments while the parent Western Roos identity remains dominant. Source selection, descriptive alt text, desktop/mobile focal positions, responsive `sizes` values and Hero preload are centralized in `src/config/media.ts`. Selected photos are converted to WebP for the static export; the original JPEGs are unchanged. Hero and Join use layered navy masks, while News, Beyond the Diamond and Gallery use fixed-ratio editorial compositions that prevent layout movement.

All invented match/event/editorial content is explicitly marked demo in code and UI. Preview pages use noindex until content is approved. Sponsor slots have neutral labels. Joining explains that registration and official contact details are not available yet; no unconnected form collects personal data.

## Responsive and accessibility

Responsive desktop navigation becomes a collapsible mobile/tablet menu, with `aria-expanded`, current-page indication, Escape dismissal and focus return. The homepage switches to stacked match and club cards, vertically flowing news, adapted asymmetric gallery and two-column footer groups on mobile. Semantic landmarks, heading hierarchy, skip link, visible focus, meaningful link labels, alt-text support, reduced-motion CSS and local fonts are included. Additional enlarged-text checks supplement the four standard viewport checks. This is not a formal accessibility certification.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
node scripts/check-ui.mjs
```

Run the browser check while the local server is running. It requires installed Microsoft Edge; change the Playwright channel if using a different local browser. The script checks six viewport sizes (375, 430, 768, 1366, 1920 and 2560 pixels), overflow, mobile menu, Escape, navigation, internal homepage links, reduced motion, text enlargement and browser exceptions. Screenshots and a JSON report go to ignored `test-results/`.

The production build generates a static export in `out/`. `npm run dev` is the supported local review command. No backend is required.

## Deferred / BUILD 02

Authentication, member accounts, admin CMS, database, payments, registration processing, player management, tournament management, live scoring and complex APIs are deliberately absent. Marlins photography, additional Western Roos parent photography, confirmed editorial copy, fixtures, results, tournament details, sponsor identities, contact details and social URLs still need supplying. No BUILD 02 work has started.

## BUILD 01.2 verification results

- Final Hero fix: `IMG_5667.jpeg` (1152 × 1536) replaces the softer night-game `IMG_5653.jpeg`; the optimized derivative is preloaded with responsive focal positions.
- Lint: passed with zero errors and warnings.
- Typecheck: passed.
- Production build: passed; 18 generated static pages including framework pages.
- Browser QA: six responsive viewports passed with no horizontal overflow; screenshots visually reviewed.
- Mobile menu, Escape/focus return, route transition, homepage internal links, reduced motion and 200% text enlargement passed.
- No page exceptions were detected during the browser checks.
- Dependency installation audit reported zero vulnerabilities.
- Original logos integrated unchanged.
- Twelve selected United photographs are integrated as optimized WebP derivatives; original source JPEGs remain unchanged.
- Beyond the Diamond adds three editorial teasers for development, events and community without adding the underlying systems or navigation.
- Runtime console audit passed with zero warnings, errors or failed requests.
- Hydration audit: extension-free Edge produced no mismatch and an unmodified `<body>`. The reported `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` attributes are Grammarly browser-extension mutations, not application output; no suppression or client-rendering workaround was added.
- The previous development “1 Issue” was caused by a missing `/favicon.ico` request falling into the static catch-all route. In export mode, Next.js reported that the favicon path was absent from `generateStaticParams`, producing the issue indicator. The explicit `/preview-icon.svg` metadata route fixes the request; the dev indicator is enabled and now reports no issue.


