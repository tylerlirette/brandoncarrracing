import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero carousel slides",
      type: "array",
      description: "Paths to files in your site’s public folder (e.g. /images/carousel-1.webp) or any image URL your hosting allows.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "src",
              title: "Image path or URL",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (rule) => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({ name: "welcomeTitle", title: "Welcome Title", type: "string" }),
    defineField({ name: "welcomeDescription", title: "Welcome Description", type: "text", rows: 3 }),
    defineField({ name: "profileTitle", title: "Profile Title", type: "string" }),
    defineField({ name: "profileDescription", title: "Profile Description", type: "text", rows: 5 }),
    defineField({
      name: "careerHighlights",
      title: "Career Highlights",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "teamsTitle", title: "Teams Title", type: "string" }),
    defineField({ name: "teamsSummary", title: "Teams Summary", type: "text", rows: 3 }),
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
              type: "text",
              rows: 3,
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
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string", initialValue: "#" }),
            defineField({ name: "image", title: "Image Path", type: "string", description: "Example: /images/about.webp" }),
          ],
        }),
      ],
    }),
    defineField({ name: "highlightsTitle", title: "Highlights Title", type: "string" }),
    defineField({ name: "highlightsDescription", title: "Highlights Description", type: "text", rows: 2 }),
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
            defineField({ name: "image", title: "Image Path", type: "string" }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({ name: "newsTitle", title: "News Title", type: "string" }),
    defineField({ name: "newsDescription", title: "News Description", type: "text", rows: 2 }),
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
    defineField({ name: "partnersDescription", title: "Partners Description", type: "text", rows: 4 }),
    defineField({ name: "instagramHeading", title: "Instagram Heading", type: "string" }),
    defineField({ name: "instagramDescription", title: "Instagram Description", type: "text", rows: 3 }),
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
