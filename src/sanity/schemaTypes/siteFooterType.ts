import { defineField, defineType } from "sanity";
import { footerColumnItemMembers } from "./shared/contentFields";

const brandColorList = ["#ffffff", "#18181b", "#e30613", "#b30510", "#808184", "#000000"];

const footerColumnItemsField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: footerColumnItemMembers,
  });

export const siteFooterType = defineType({
  name: "siteFooter",
  title: "Site Footer",
  type: "document",
  groups: [
    { name: "settings", title: "Settings", default: true },
    { name: "brand", title: "Left column" },
    { name: "middle", title: "Middle column" },
    { name: "right", title: "Right column" },
  ],
  fields: [
    defineField({
      name: "height",
      title: "Footer height",
      type: "string",
      group: "settings",
      description: "Controls vertical padding above and below the footer content.",
      options: {
        list: [
          { title: "Short", value: "short" },
          { title: "Medium", value: "medium" },
          { title: "Tall", value: "tall" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
    defineField({
      name: "theme",
      title: "Footer theme",
      type: "string",
      group: "settings",
      description: "Light footer uses dark text; dark footer uses light text. Upload a light logo variant for dark footers if needed.",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      type: "color",
      group: "settings",
      description: "Leave blank to use the theme default background color.",
      options: {
        disableAlpha: true,
        colorList: brandColorList,
      },
    }),
    defineField({
      name: "brandColumn",
      title: "Brand column",
      type: "object",
      group: "brand",
      description: "Logo and optional text underneath (e.g. copyright).",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Defaults to the site name when empty.",
            }),
          ],
        }),
        defineField({
          name: "text",
          title: "Text below logo",
          type: "text",
          rows: 3,
          description: "Optional supporting text shown under the logo.",
        }),
      ],
    }),
    defineField({
      name: "middleColumn",
      title: "Middle column",
      type: "object",
      group: "middle",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "heading",
          title: "Column heading",
          type: "string",
          description: "Optional heading above the column content.",
        }),
        footerColumnItemsField(
          "items",
          "Column content",
          "Add navigation links or plain text blocks. Items appear in order."
        ),
      ],
    }),
    defineField({
      name: "rightColumn",
      title: "Right column",
      type: "object",
      group: "right",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "layout",
          title: "Column layout",
          type: "string",
          options: {
            list: [
              { title: "Links & text", value: "links" },
              { title: "Newsletter form", value: "newsletter" },
            ],
            layout: "radio",
          },
          initialValue: "newsletter",
        }),
        defineField({
          name: "heading",
          title: "Column heading",
          type: "string",
          description: "Optional heading above the column content.",
        }),
        defineField({
          name: "items",
          title: "Column content",
          type: "array",
          description: "Add navigation links or plain text blocks.",
          of: footerColumnItemMembers,
          hidden: ({ parent }) => parent?.layout !== "links",
        }),
        defineField({
          name: "newsletterTextAbove",
          title: "Text above form",
          type: "text",
          rows: 3,
          description: "Optional intro text shown above the newsletter signup form.",
          hidden: ({ parent }) => parent?.layout !== "newsletter",
        }),
        defineField({
          name: "newsletterTextBelow",
          title: "Text below form",
          type: "text",
          rows: 3,
          description: "Optional text shown below the newsletter signup form.",
          hidden: ({ parent }) => parent?.layout !== "newsletter",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Footer" };
    },
  },
});
