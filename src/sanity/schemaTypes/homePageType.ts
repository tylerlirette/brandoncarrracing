import { defineArrayMember, defineField, defineType } from "sanity";

const richTextWithLinks = {
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      marks: {
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            fields: [defineField({ name: "href", type: "url", title: "URL" })],
          }),
        ],
      },
    }),
  ],
};

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero carousel slides",
      type: "array",
      description: "Upload an image from Sanity Media Library (preferred), or use a fallback path/URL.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "imageAsset",
              title: "Uploaded image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "src",
              title: "Fallback image path or URL",
              type: "string",
              description: "Optional fallback, e.g. /images/carousel-1.webp",
            }),
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (rule) => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({ name: "welcomeTitle", title: "Welcome Title", type: "string" }),
    defineField({
      name: "welcomeSectionId",
      title: "Welcome Section ID",
      type: "string",
      description: "Anchor id for links (example: about).",
    }),
    defineField({ name: "welcomeDescription", title: "Welcome Description", ...richTextWithLinks }),
    defineField({ name: "profileTitle", title: "Profile Title", type: "string" }),
    defineField({
      name: "profileSectionId",
      title: "Profile Section ID",
      type: "string",
      description: "Anchor id for links (example: profile).",
    }),
    defineField({ name: "profileDescription", title: "Profile Description", ...richTextWithLinks }),
    defineField({
      name: "careerHighlights",
      title: "Career Highlights",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "teamsTitle", title: "Teams Title", type: "string" }),
    defineField({
      name: "teamsSectionId",
      title: "Teams Section ID",
      type: "string",
      description: "Anchor id for links (example: teams).",
    }),
    defineField({ name: "teamsSummary", title: "Teams Summary", ...richTextWithLinks }),
    defineField({
      name: "teams",
      title: "Team Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "description",
              title: "Description",
              ...richTextWithLinks,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featureCards",
      title: "Feature Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", ...richTextWithLinks }),
            defineField({ name: "href", title: "Link", type: "string", initialValue: "#" }),
            defineField({
              name: "imageAsset",
              title: "Uploaded image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "image",
              title: "Fallback image path",
              type: "string",
              description: "Optional fallback, example: /images/about.webp",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featureCardsSectionId",
      title: "Feature Cards Section ID",
      type: "string",
      description: "Anchor id for links (example: feature-cards).",
    }),
    defineField({ name: "highlightsTitle", title: "Highlights Title", type: "string" }),
    defineField({
      name: "highlightsSectionId",
      title: "Highlights Section ID",
      type: "string",
      description: "Anchor id for links (example: highlights).",
    }),
    defineField({ name: "highlightsDescription", title: "Highlights Description", ...richTextWithLinks }),
    defineField({
      name: "events",
      title: "Racing Highlights",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
            defineField({ name: "date", title: "Date Label", type: "string" }),
            defineField({
              name: "imageAsset",
              title: "Uploaded image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "image",
              title: "Fallback image path",
              type: "string",
              description: "Optional fallback path in /public or external URL",
            }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({ name: "newsTitle", title: "News Title", type: "string" }),
    defineField({
      name: "newsSectionId",
      title: "News Section ID",
      type: "string",
      description: "Anchor id for links (example: news).",
    }),
    defineField({ name: "newsDescription", title: "News Description", ...richTextWithLinks }),
    defineField({
      name: "pressArticles",
      title: "Press Articles",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "source", title: "Source", type: "string" }),
            defineField({ name: "date", title: "Date", type: "string" }),
            defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
            defineField({ name: "href", title: "Article URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({ name: "partnersTitle", title: "Partners Title", type: "string" }),
    defineField({
      name: "partnersSectionId",
      title: "Partners Section ID",
      type: "string",
      description: "Anchor id for links (example: partners).",
    }),
    defineField({ name: "partnersDescription", title: "Partners Description", ...richTextWithLinks }),
    defineField({ name: "instagramHeading", title: "Instagram Heading", type: "string" }),
    defineField({
      name: "instagramSectionId",
      title: "Instagram Section ID",
      type: "string",
      description: "Anchor id for links (example: instagram).",
    }),
    defineField({ name: "instagramDescription", title: "Instagram Description", ...richTextWithLinks }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({
      name: "sectionOrder",
      title: "Homepage Section Order",
      type: "array",
      description: "Reorder these to control section layout on the homepage.",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Hero Carousel", value: "hero" },
              { title: "Welcome Intro", value: "intro" },
              { title: "Feature Cards", value: "featureCards" },
              { title: "Profile", value: "profile" },
              { title: "Teams", value: "teams" },
              { title: "Racing Highlights", value: "highlights" },
              { title: "News", value: "news" },
              { title: "Partners", value: "partners" },
              { title: "Instagram", value: "instagram" },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
