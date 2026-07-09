import { defineField, defineType } from "sanity";
import { headerLinksField, pageSectionMembers } from "./pageSections";

const RESERVED_SLUGS = new Set(["studio", "api", "_next"]);

function normalizeSlugInput(value: string): string {
  return value.trim().replace(/^\/+|\/+$/g, "");
}

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL path",
      type: "string",
      group: "settings",
      description: 'Site path without leading slash. Use "/" for the homepage (e.g. about → /about).',
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (typeof value !== "string") {
            return "URL path is required.";
          }

          const trimmed = value.trim();
          const normalized = trimmed === "/" ? "/" : normalizeSlugInput(trimmed);

          if (normalized !== "/" && !normalized) {
            return 'Enter a path like "about" or "/" for the homepage.';
          }

          if (normalized !== "/" && !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(normalized)) {
            return 'Use lowercase letters, numbers, hyphens, and slashes only (e.g. "racing/schedule").';
          }

          const segment = normalized === "/" ? "/" : normalized.split("/")[0];
          if (segment && RESERVED_SLUGS.has(segment)) {
            return `"${segment}" is reserved. Choose a different path.`;
          }

          const document = context.document;
          const documentId = document?._id?.replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion: "2026-04-28" });
          const slugFilter = normalized === "/" ? `slug == "/"` : `slug == $slug`;
          const params = normalized === "/" ? {} : { slug: normalized };
          const existing = await client.fetch<{ _id: string } | null>(
            `*[_type == "page" && ${slugFilter} && !(_id in [$draftId, $publishedId])][0]{ _id }`,
            {
              ...params,
              draftId: `drafts.${documentId}`,
              publishedId: documentId,
            }
          );

          if (existing) {
            return normalized === "/" ? "Another page is already set as the homepage." : "This URL path is already in use.";
          }

          return true;
        }),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      group: "settings",
      description: "Controls overall page width. Sections can still use full-bleed components like Hero.",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Narrow", value: "narrow" },
          { title: "Full width", value: "fullWidth" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    headerLinksField,
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      group: "content",
      description: "Add and reorder sections to build the page.",
      of: pageSectionMembers,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "Meta title",
          type: "string",
          description: "Defaults to page title when empty.",
        }),
        defineField({
          name: "description",
          title: "Meta description",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug",
    },
    prepare({ title, slug }) {
      const path = slug?.trim() === "/" ? "/" : `/${normalizeSlugInput(slug || "")}`;
      return {
        title: title?.trim() || "Untitled page",
        subtitle: path,
      };
    },
  },
});
