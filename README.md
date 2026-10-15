# Belvia — Meridian website

Rebuilt from the selected Meridian concept: cobalt blue, warm off-white and navy; oversized editorial typography; European terminal photography; geographic route map; service columns; navy call to action; company, fleet and team sections; and a validated quote-request download.

## Run and build

Requires Node.js 20+. From this folder run `npm start` and open http://localhost:3000. Run `npm run build` to regenerate the six static pages. Run `npm run check` for JavaScript syntax and, while the server is running, `node scripts/check-site.mjs` for page, link, asset, metadata and HTTP checks. No dependency installation is required.

Deploy `dist/` to a static host. The project preserves its existing Sites identity and private audience.

## Editing

- `src/index.html`: homepage structure.
- `src/style.css`: Meridian responsive styles and local font declarations.
- `src/overrides.json`: current English, Dutch and French copy.
- `src/translations.json`: retained company and quote translations.
- `src/sections.html`: source for company, fleet, team and quote sections, composed by the builder.
- `src/build-meridian.mjs`: page generation, localized links, geographic map and SEO metadata.
- `src/app.js`: navigation, service selection, quote download, privacy dialog.
- `src/asset-prompts.md`: prompts for generated photo assets.
- `dist/assets/meridian-*.png`: four illustrative photographic assets.
- `dist/assets/*.woff2`: locally hosted fonts.

The map uses Natural Earth country boundaries (public-domain geographic data), projected to SVG at build time. The static pages have dedicated canonical URLs, language alternatives, social metadata, a sitemap and robots.txt. Change the base origin in `src/build-meridian.mjs` when moving to a different domain.

## Business details and inquiry flow

Belvia remains the temporary identity from the selected concept. No company registration, business email, phone, actual employee details, fleet specifications or certifications were supplied. No staff identities, customer testimonials or business statistics are fabricated. The generated photographs illustrate the chosen design and do not represent verified company employees or vehicles.

The quote form validates required fields and downloads a localized text file. No details are sent to a server or inbox, and a downloaded request is not a confirmed booking. Real company contact details or an approved delivery service are needed for direct inquiry delivery. No analytics, cookies or local-storage tracking are used.

## Verification

All six pages build. JavaScript syntax checks pass. Static validation checks localized links, anchor targets, headings, metadata, assets and HTTP responses. A browser was unavailable in this session, so visual and interactive browser QA is unverified.
