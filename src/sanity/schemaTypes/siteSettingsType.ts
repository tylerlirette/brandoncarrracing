import { HREF_FIELD_DESCRIPTION, validateHrefValue } from "@/lib/href";
import { validateLightWidgetIframeSrc } from "@/lib/lightwidget";
import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "seo", title: "SEO" },
    { name: "social", title: "Social & Instagram" },
    { name: "newsletter", title: "Newsletter" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Site name",
      type: "string",
      group: "identity",
      description: "Used in the browser title template and fallback UI copy.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "copyrightEntity",
      title: "Copyright entity",
      type: "string",
      group: "identity",
      description: "Shown in the default footer copyright line when the footer brand text is empty.",
    }),
    defineField({
      name: "logoHeader",
      title: "Default header logo",
      type: "image",
      group: "identity",
      description: "Fallback when Site Header has no logo uploaded.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "logoFooter",
      title: "Default footer logo",
      type: "image",
      group: "identity",
      description: "Fallback when Site Footer has no logo uploaded. Prefer a light/white mark for dark footers.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Default meta description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Used when a page has no SEO description.",
    }),
    defineField({
      name: "openGraphDescription",
      title: "Open Graph description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Default social share description for the site.",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default share image",
      type: "image",
      group: "seo",
      description:
        "Used for Open Graph / Twitter cards when a page has no SEO image. Recommended 1200×630.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram profile URL",
      type: "string",
      group: "social",
      description: HREF_FIELD_DESCRIPTION,
      validation: (rule) => rule.custom((value) => validateHrefValue(value)),
    }),
    defineField({
      name: "instagramWidgetIframeSrc",
      title: "Default Instagram widget URL",
      type: "string",
      group: "social",
      description:
        "Optional LightWidget iframe src (https:// or //lightwidget.com/widgets/….html). Used when an Instagram section leaves the widget field blank. Can also be set with NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC.",
      validation: (rule) => rule.custom((value) => validateLightWidgetIframeSrc(value)),
    }),
    defineField({
      name: "newsletterBlurb",
      title: "Newsletter blurb",
      type: "text",
      rows: 2,
      group: "newsletter",
      description: "Default copy above the footer newsletter form when that field is empty.",
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return { title: title || "Site Settings" };
    },
  },
});
