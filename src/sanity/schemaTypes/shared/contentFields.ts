import { defineArrayMember, defineField } from "sanity";

export const richTextWithLinks = {
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

export const sectionIdField = (example: string) =>
  defineField({
    name: "sectionId",
    title: "Section ID",
    type: "string",
    description: `Anchor id for links (example: ${example}).`,
  });

export const headerLinkFields = [
  defineField({
    name: "label",
    title: "Label (text link)",
    type: "string",
    description: "Optional when using Iconify icon only.",
  }),
  defineField({
    name: "icon",
    title: "Iconify icon name",
    type: "string",
    description: "Optional. Example: mdi:instagram",
  }),
  defineField({
    name: "href",
    title: "Link URL",
    type: "string",
    description: "Supports internal paths, #anchors, or full URLs.",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "openInNewTab",
    title: "Open in new tab",
    type: "boolean",
    initialValue: false,
  }),
];
