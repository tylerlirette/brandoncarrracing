import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

function studioUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return siteUrl ? `${siteUrl}/studio` : "/studio";
}

/**
 * Published client. Prefer `sanityFetch` from `@/sanity/lib/live` in RSC pages
 * so Draft Mode / Presentation Tool automatically switch to draft perspective + stega.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  /** Prefer API over CDN so published edits aren’t stuck behind CDN TTL when ISR/webhook refresh. */
  useCdn: false,
  stega: {
    studioUrl: studioUrl(),
  },
});
