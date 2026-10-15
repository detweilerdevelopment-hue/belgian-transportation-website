# Belvia Transport website

Complete dependency-free static website with English, Dutch and French pages, dedicated About pages, responsive layouts, local photography assets, route coverage, service selection, accessible forms, a downloadable quote brief and privacy dialog.

## Run

Requires Node.js 20 or newer. Run `npm start` from this directory and open http://localhost:3000. Run `npm run check` for the JavaScript syntax check and `npm run build` after editing homepage copy to regenerate language and About pages and sitemap. Deploy the contents of `dist` to any static host.

## Business handover

Belvia is an editorial identity chosen because no company name was supplied. Company registration information, actual contacts, founding history, certifications, fleet specifications and staff identities were not supplied and are not fabricated. Replace the identity and publish verified business details before a public business launch. Images illustrate transport and are not represented as photographs of the actual company fleet or employees. No invented staff profiles, client logos or testimonials are included.

The quote form validates input and creates a UTF-8 text request file locally. It does **not** deliver inquiries to an inbox or create bookings. A real business email or approved submission service is needed to connect direct lead delivery. No quote information is stored by the server. There are no analytics cookies. Language preferences use local storage.

## Files

- `dist/index.html`: main content and layout.
- `dist/style.css`: desktop, tablet, mobile and reduced-motion styles.
- `dist/app.js`: translations, navigation, quote download and privacy dialog.
- `build.mjs`: generates search-engine-readable localized and About pages.
- `server.mjs`: local static server.
- `.openai/hosting.json`: Sites hosting identity.

On a domain change, update the `base` URL in `build.mjs` and rebuild. Company-specific structured data is deliberately omitted until real company facts are supplied.

## Verification

JavaScript syntax and HTTP page/asset responses are checked. Browser automation was unavailable in the delivery session; visual and interactive browser QA is therefore unverified.
