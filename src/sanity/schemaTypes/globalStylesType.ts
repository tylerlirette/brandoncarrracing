import { GOOGLE_FONT_OPTIONS, TYPE_SCALE_OPTIONS, parseGoogleFontsStylesheetUrl } from "@/lib/globalStyles.shared";
import { defineField, defineType } from "sanity";

const brandColorList = ["#ffffff", "#18181b", "#e30613", "#b30510", "#808184", "#000000"];

const colorField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "color",
    description,
    options: {
      disableAlpha: false,
      colorList: brandColorList,
    },
  });

export const globalStylesType = defineType({
  name: "globalStyles",
  title: "Global Styles",
  type: "document",
  groups: [
    { name: "colors", title: "Colors", default: true },
    { name: "typography", title: "Typography" },
  ],
  fields: [
    defineField({
      name: "colors",
      title: "Theme colors",
      type: "object",
      group: "colors",
      description:
        "Controls site-wide color tokens used by components (background, text, brand, surfaces, etc.). Leave blank to use code defaults.",
      options: { collapsible: true, collapsed: false },
      fields: [
        colorField("background", "Background", "Main page background."),
        colorField("foreground", "Foreground", "Primary text color."),
        colorField("muted", "Muted text"),
        colorField("subtle", "Subtle text"),
        colorField("bodyEmphasis", "Body emphasis"),
        colorField("surfaceMuted", "Muted surface"),
        colorField("surfaceSubtle", "Subtle surface"),
        colorField("border", "Border"),
        colorField("surfaceInverse", "Inverse surface", "Dark sections such as the footer."),
        colorField("inverse", "Inverse text"),
        colorField("inverseMuted", "Inverse muted text"),
        colorField("inverseSubtle", "Inverse subtle text"),
        colorField("badge", "Badge"),
        colorField("brand", "Brand"),
        colorField("brandSecondary", "Brand secondary"),
        colorField("brandTertiary", "Brand tertiary"),
      ],
    }),
    defineField({
      name: "typography",
      title: "Typography",
      type: "object",
      group: "typography",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "headingFont",
          title: "Heading font",
          type: "string",
          description: "Used for headings site-wide (font-heading). Loaded from Google Fonts.",
          options: {
            list: [...GOOGLE_FONT_OPTIONS],
            layout: "dropdown",
          },
          initialValue: "Barlow Condensed",
        }),
        defineField({
          name: "bodyFont",
          title: "Body font",
          type: "string",
          description: "Used for body copy site-wide (font-sans). Loaded from Google Fonts.",
          options: {
            list: [...GOOGLE_FONT_OPTIONS],
            layout: "dropdown",
          },
          initialValue: "Source Sans 3",
        }),
        defineField({
          name: "typeScale",
          title: "Type scale",
          type: "string",
          description: "Adjusts heading, body, and hero text sizes across the site.",
          options: {
            list: [...TYPE_SCALE_OPTIONS],
            layout: "radio",
          },
          initialValue: "default",
        }),
        defineField({
          name: "googleFontsStylesheetUrl",
          title: "Advanced: Google Fonts stylesheet URL",
          type: "url",
          description:
            "Optional. Paste the href from Google Fonts embed code to load custom weights or families not in the dropdowns. Must be a fonts.googleapis.com/css2 URL.",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) {
                return true;
              }
              return parseGoogleFontsStylesheetUrl(String(value))
                ? true
                : "Use a Google Fonts stylesheet URL (fonts.googleapis.com/css2…), or paste the full <link> embed code.";
            }),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Global Styles" };
    },
  },
});
