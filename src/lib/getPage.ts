import { cache } from "react";
import { mergePageContent, type PageContent } from "@/lib/page";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/lib/queries";

/**
 * Dedupes page fetches between `generateMetadata` and the page component
 * within the same request (separate cache entries when `stega` differs).
 */
export const getPageBySlug = cache(
  async (slug: string, stega = true): Promise<PageContent | null> => {
    const [{ data: page }, settings] = await Promise.all([
      sanityFetch({
        query: pageBySlugQuery,
        params: { slug },
        stega,
      }),
      getSiteSettings(),
    ]);
    if (!page) {
      return null;
    }
    return mergePageContent(page, { instagramUrl: settings.social.instagram });
  }
);
