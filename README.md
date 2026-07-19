# Next.js + Sanity page-builder template

Modular marketing sites powered by a Sanity page builder (sections → column layouts → cards), with Studio-driven **Site Settings**, **Global Styles**, header, and footer.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

3. Run the app:

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

Published Sanity changes revalidate about every **60 seconds** as a fallback. For immediate updates after publish, configure the [revalidation webhook](#on-demand-revalidation).

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Defaults to `2026-04-28` |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical origin for metadata, Open Graph, sitemap, and robots |
| `SANITY_API_READ_TOKEN` | For draft preview | Viewer token for Presentation Tool / Draft Mode |
| `SANITY_API_WRITE_TOKEN` | For newsletter | Write token for `newsletterLead` creates |
| `SANITY_REVALIDATE_SECRET` | For webhook | Shared secret for `POST /api/revalidate` |
| `NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC` | No | Optional LightWidget iframe override |

## Studio overview

Open **Content** in Studio and configure singletons first, then pages:

1. **Site Settings** — site name, default logos, meta/OG descriptions, **default share image**, Instagram URL, default Instagram widget, newsletter blurb, copyright entity  
2. **Global Styles** — colors, fonts, type scale, **heading voice** (uppercase/none, italic/normal, weight), roundedness  
3. **Site Header** — logo override, height, sticky, nav, CTA  
4. **Site Footer** — columns, theme, newsletter layout  
5. **Home Page** — page with slug `/` (`page-home`)  
6. **Pages** — additional routes (`about`, `racing/schedule`, etc.)  
7. **Newsletter Leads** — stored footer signups

### Building a page

Each page has:

- **Title** and **slug** (`/` for home; nested paths allowed)
- **Layout** width for non-hero blocks (`default` / `narrow` / `fullWidth`)
- **SEO** — meta title, description, and **share image** (falls back to Site Settings)
- **Sections** (ordered array):
  - **Hero** — carousel or static image, optional overlay text/CTA
  - **Section** — heading, theme, spacing, borders, and **column layouts** (1–3 columns or grid). Each cell holds a feature / info / event / press card, image, or rich text.
  - **Instagram** — heading, copy, profile link, optional LightWidget embed

Uploads prefer Sanity assets; optional fallback image paths (for example `/images/hero.webp`) still work.

## SEO & indexing

- Page and site metadata use Open Graph + Twitter cards.
- Share images: page SEO image → Site Settings default share image.
- `/sitemap.xml` lists all published pages (from Sanity).
- `/robots.txt` allows the site and points at the sitemap; blocks `/api/` and `/studio/`.

Set `NEXT_PUBLIC_SITE_URL` to your production origin so canonical URLs and the sitemap use the right host.

## On-demand revalidation

1. Add a random secret to `.env.local` / hosting as `SANITY_REVALIDATE_SECRET`.
2. In [Sanity Manage](https://www.sanity.io/manage) → **API** → **Webhooks**, create a webhook:
   - **URL:** `https://YOUR_DOMAIN/api/revalidate`
   - **Trigger:** Create / Update / Delete (as needed)
   - **Filter (example):** `_type in ["page", "siteSettings", "globalStyles", "siteHeader", "siteFooter"]`
   - **Projection (GROQ):** `{_type, "slug": slug}`
   - **HTTP method:** POST
   - **HTTP headers:** `Authorization: Bearer YOUR_SANITY_REVALIDATE_SECRET`
3. Publish a change in Studio — the site should refresh without waiting for the 60s ISR window.

Manual full refresh:

```bash
curl -X GET "https://YOUR_DOMAIN/api/revalidate?secret=YOUR_SECRET"
```

## Draft preview (Presentation Tool)

Editors can preview unpublished drafts and click text to jump to fields in Studio.

1. Create a **Viewer** API token in [Sanity Manage](https://www.sanity.io/manage) → **API** → **Tokens**, and set it as `SANITY_API_READ_TOKEN`.
2. Add your site origin as a CORS origin with **Allow credentials** checked (e.g. `http://localhost:3000` and your production URL):

```bash
npx sanity cors add http://localhost:3000 --credentials
```

3. Open Studio → **Presentation** (or `/studio/presentation`). The frontend loads in an iframe; Draft Mode is enabled automatically via `/api/draft-mode/enable`.
4. Edit content — the preview updates live. Publish still triggers the revalidation webhook (or the 60s ISR fallback).

To exit draft mode when previewing the site outside Presentation, use the **Exit preview** control (or visit `/api/draft-mode/disable`).

## Cloning this repo for a new site

1. Create a new Sanity project / dataset and point env vars at it.
2. In Studio, publish **Site Settings**, **Global Styles**, **Site Header**, **Site Footer**, and a **Home Page** (slug `/`).
3. Replace files under `public/` (favicons, default logos if you rely on path fallbacks).
4. Optionally update code fallbacks in `src/lib/siteConfig.ts` (used when Studio is empty or offline). Canonical URL stays env-driven via `NEXT_PUBLIC_SITE_URL`.
5. Set production `NEXT_PUBLIC_SITE_URL`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, CORS origins, and the Sanity webhook, then deploy.

Day-to-day branding and content should live in Sanity — not in the repo.

## Notes

- Footer newsletter submissions create `newsletterLead` documents via `/api/newsletter-signup` (needs `SANITY_API_WRITE_TOKEN`).
- Instagram embeds only allow LightWidget URLs (validated in Studio and at render time).
- Image remote hosts: Sanity CDN is allowed in `next.config.ts`.
