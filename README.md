This is a [Next.js](https://nextjs.org) project for Brandon Carr Racing.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in your Sanity project values.

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The homepage reads from Sanity. Set these in `.env.local` (required for `next build`):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

If the CMS returns no document or a request fails, the homepage falls back to built-in default content.

## Sanity setup

1. Create or link a Sanity project (if you have not already):

```bash
npx sanity init
```

2. Start the Next.js app and open Studio:

- Site: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

3. In Studio, open **Content → Home Page**. The first time, Studio creates the singleton document for you (`_id`: `homepage`).

4. Fill in fields (hero slides, welcome copy, profile, teams, feature cards, racing highlights, press, partners, Instagram copy, section order).

5. **Publish** the document. The live site revalidates about every **60 seconds** (`revalidate` on the homepage), so you should see updates shortly after publish without redeploying.

6. Reorder **Homepage Section Order** to change which blocks appear and in what order.

## Images in Sanity

- Hero slides, feature cards, and racing highlights support **uploaded images** from the Sanity Media Library.
- Those same fields also keep a **fallback path/URL** (for example `/images/about.webp`) so existing repo images continue to work.
- The site automatically prefers uploaded Sanity assets when present.

## Notes

- This setup keeps your existing layout/components and drives copy and lists from Sanity.
- Hero and card images use **paths under `/public`** (for example `/images/carousel-1.webp`) unless you add remote image domains in `next.config.ts` for full URLs.
- You can invite editors to Sanity and they can use Studio without touching the repo.
