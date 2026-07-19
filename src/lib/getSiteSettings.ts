import { cache } from "react";
import { mergeSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";

/**
 * Dedupes Site Settings fetches within a request.
 * Always fetches without stega — settings feed metadata and fallbacks.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const { data } = await sanityFetch({
      query: siteSettingsQuery,
      stega: false,
    });
    return mergeSiteSettings(data);
  } catch {
    return mergeSiteSettings(null);
  }
});
