/**
 * One-time migration: legacy homePage → page document (page-home, slug /).
 *
 * Usage:
 *   npm run migrate:homepage
 *   npm run migrate:homepage -- --dry-run
 *   npm run migrate:homepage -- --force
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (Editor token from sanity.io/manage).
 */
import { createClient } from "next-sanity";
import { groq } from "next-sanity";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  legacyHomePageDocumentToPageDocument,
  type RawLegacyHomePageDocument,
} from "../src/lib/migrateHomePageToPage";

const PAGE_ID = "page-home";

const rawLegacyHomePageDocumentQuery = groq`
  coalesce(*[_id == "homepage"][0], *[_type == "homePage"][0]){
    _id,
    _type,
    headerLinks,
    hero{
      displayMode,
      height,
      images[]{
        _key,
        imageAsset,
        src,
        alt
      },
      heading,
      subtext,
      cta,
      showHeroText,
      textAlign,
      textVerticalAlign,
      textStyle,
      contentWidth,
      overlay,
      carouselIntervalMs,
      showCarouselDots
    },
    heroSlides[]{
      _key,
      imageAsset,
      src,
      alt
    },
    welcomeTitle,
    welcomeSectionId,
    welcomeDescription,
    profileTitle,
    profileSectionId,
    profileDescription,
    careerHighlights,
    profileBullets,
    teamsTitle,
    teamsSectionId,
    teamsSummary,
    teams,
    infoCardsTitle,
    infoCardsSectionId,
    infoCardsSummary,
    infoCards,
    featureCards[]{
      _key,
      title,
      description,
      href,
      imageAsset,
      image
    },
    featureCardsSectionId,
    highlightsTitle,
    highlightsSectionId,
    highlightsDescription,
    events[]{
      _key,
      title,
      subtitle,
      date,
      note,
      imageAsset,
      image
    },
    eventCardsTitle,
    eventCardsSectionId,
    eventCardsDescription,
    eventCards,
    newsTitle,
    newsSectionId,
    newsDescription,
    pressArticles[]{
      _key,
      title,
      source,
      date,
      excerpt,
      href
    },
    partnersTitle,
    partnersSectionId,
    partnersDescription,
    instagramHeading,
    instagramSectionId,
    instagramDescription,
    instagramUrl,
    sectionOrder
  }
`;

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const separator = trimmed.indexOf("=");
      if (separator === -1) {
        continue;
      }
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional if vars are already set
  }
}

function getArg(flag: string): boolean {
  return process.argv.includes(flag);
}

async function main() {
  loadEnvLocal();

  const dryRun = getArg("--dry-run");
  const force = getArg("--force");

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-28";

  if (!projectId || !dataset) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local");
  }

  if (!token && !dryRun) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN in .env.local. Create an Editor token at sanity.io/manage → API → Tokens."
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const existingPage = await client.fetch<{ _id: string; title?: string; slug?: string } | null>(
    `*[_id == $id][0]{ _id, title, slug }`,
    { id: PAGE_ID }
  );

  if (existingPage && !force && !dryRun) {
    console.log(`Page "${PAGE_ID}" already exists (title: ${existingPage.title}, slug: ${existingPage.slug}).`);
    console.log("Re-run with --force to overwrite, or --dry-run to preview without writing.");
    process.exit(0);
  }

  const legacy = await client.fetch<RawLegacyHomePageDocument | null>(rawLegacyHomePageDocumentQuery);

  if (!legacy?._id && !legacy?._type) {
    throw new Error('No legacy homePage document found (_id "homepage" or _type "homePage"). Nothing to migrate.');
  }

  const pageDocument = legacyHomePageDocumentToPageDocument(legacy, { pageId: PAGE_ID });

  console.log(`Source: ${legacy._id} (${legacy._type})`);
  console.log(`Target: ${PAGE_ID} → slug "${pageDocument.slug}"`);
  console.log(`Sections: ${pageDocument.sections.map((section) => section._type).join(", ")}`);

  if (dryRun) {
    console.log("\nDry run — document that would be written:\n");
    console.log(JSON.stringify(pageDocument, null, 2));
    return;
  }

  await client.createOrReplace(pageDocument);

  console.log(`\nCreated page document "${PAGE_ID}". Open Studio → Home Page to review and publish.`);
  console.log("After publishing, the site will use the new page model at /.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
