import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

function hrefFromSlug(slug: string | undefined): string {
  if (!slug?.trim() || slug.trim() === "/") {
    return "/";
  }
  return `/${slug.trim().replace(/^\/+|\/+$/g, "")}`;
}

/** Maps Sanity documents to frontend URLs for the Presentation Tool. */
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    page: defineLocations({
      select: {
        title: "title",
        slug: "slug",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled page",
            href: hrefFromSlug(doc?.slug),
          },
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: { title: "name" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Site Settings", href: "/" }],
      }),
    }),
    siteHeader: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: "Site Header", href: "/" }],
      }),
    }),
    siteFooter: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: "Site Footer", href: "/" }],
      }),
    }),
    globalStyles: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: "Global Styles", href: "/" }],
      }),
    }),
  },
};
