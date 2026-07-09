import { defineArrayMember, defineField, defineType, type PreviewValue } from "sanity";
import { headerLinkFields, richTextWithLinks, sectionIdField } from "./shared/contentFields";

function heroTextFieldsHidden({ parent }: { parent?: { showHeroText?: boolean } }) {
  return !parent?.showHeroText;
}

const imageWithAltPreview = {
  select: {
    alt: "alt",
    src: "src",
    media: "imageAsset",
  },
  prepare({ alt, src, media }: { alt?: string; src?: string; media?: PreviewValue["media"] }): PreviewValue {
    return {
      title: alt?.trim() || "Add alt text",
      subtitle: src?.trim() || undefined,
      media,
    };
  },
};

const titledImagePreview = {
  select: {
    title: "title",
    subtitle: "image",
    media: "imageAsset",
  },
  prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: PreviewValue["media"] }): PreviewValue {
    return {
      title: title?.trim() || "Untitled",
      subtitle: subtitle?.trim() || undefined,
      media,
    };
  },
};

const heroFields = [
  defineField({
    name: "displayMode",
    title: "Display mode",
    type: "string",
    options: {
      list: [
        { title: "Carousel", value: "carousel" },
        { title: "Static image", value: "static" },
      ],
      layout: "radio",
    },
    initialValue: "carousel",
  }),
  defineField({
    name: "height",
    title: "Height / ratio",
    type: "string",
    description: "Cinematic (21:9) is the default wide hero. Viewport fills ~70% of the screen height.",
    options: {
      list: [
        { title: "Cinematic (21:9)", value: "cinematic" },
        { title: "Wide (16:9)", value: "wide" },
        { title: "Standard (3:2)", value: "standard" },
        { title: "Viewport (~70vh)", value: "viewport" },
        { title: "Compact", value: "compact" },
      ],
      layout: "radio",
    },
    initialValue: "cinematic",
  }),
  defineField({
    name: "images",
    title: "Images",
    type: "array",
    description: "Static mode uses the first image. Carousel mode cycles through all images.",
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
        preview: imageWithAltPreview,
      }),
    ],
  }),
  defineField({
    name: "showHeroText",
    title: "Show hero text",
    type: "boolean",
    description: "Enable heading, subtext, and call-to-action over the hero image.",
    initialValue: false,
  }),
  defineField({
    name: "heading",
    title: "Heading",
    type: "string",
    hidden: heroTextFieldsHidden,
  }),
  defineField({
    name: "subtext",
    title: "Subtext",
    ...richTextWithLinks,
    hidden: heroTextFieldsHidden,
  }),
  defineField({
    name: "cta",
    title: "Call to action",
    type: "object",
    hidden: heroTextFieldsHidden,
    fields: [
      defineField({ name: "label", title: "Button label", type: "string" }),
      defineField({
        name: "href",
        title: "Link URL",
        type: "string",
        description: "Internal path, #anchor, or full URL.",
      }),
      defineField({ name: "openInNewTab", title: "Open in new tab", type: "boolean", initialValue: false }),
    ],
  }),
  defineField({
    name: "textAlign",
    title: "Text alignment",
    type: "string",
    options: {
      list: [
        { title: "Left", value: "left" },
        { title: "Center", value: "center" },
        { title: "Right", value: "right" },
      ],
      layout: "radio",
    },
    initialValue: "center",
    hidden: heroTextFieldsHidden,
  }),
  defineField({
    name: "textVerticalAlign",
    title: "Text vertical position",
    type: "string",
    options: {
      list: [
        { title: "Center", value: "center" },
        { title: "Bottom", value: "bottom" },
      ],
      layout: "radio",
    },
    initialValue: "bottom",
    hidden: heroTextFieldsHidden,
  }),
  defineField({
    name: "contentWidth",
    title: "Text container width",
    type: "string",
    description: "Site matches the max width used by page sections (6xl). Wide and full span more of the hero.",
    options: {
      list: [
        { title: "Site (max-w-6xl)", value: "site" },
        { title: "Wide (max-w-7xl)", value: "wide" },
        { title: "Full width", value: "full" },
      ],
      layout: "radio",
    },
    initialValue: "site",
    hidden: heroTextFieldsHidden,
  }),
  defineField({
    name: "textStyle",
    title: "Text style",
    type: "string",
    options: {
      list: [
        { title: "Default", value: "default" },
        { title: "Minimal", value: "minimal" },
        { title: "Boxed", value: "boxed" },
        { title: "Brand accent heading", value: "brand-accent" },
      ],
      layout: "radio",
    },
    initialValue: "default",
    hidden: heroTextFieldsHidden,
  }),
  defineField({
    name: "overlay",
    title: "Image overlay",
    type: "object",
    fields: [
      defineField({
        name: "type",
        title: "Overlay type",
        type: "string",
        options: {
          list: [
            { title: "None", value: "none" },
            { title: "Gradient", value: "gradient" },
            { title: "Solid color", value: "color" },
          ],
          layout: "radio",
        },
        initialValue: "gradient",
      }),
      defineField({
        name: "gradientMode",
        title: "Gradient style",
        type: "string",
        options: {
          list: [
            { title: "Preset", value: "preset" },
            { title: "Custom", value: "custom" },
          ],
          layout: "radio",
        },
        initialValue: "preset",
        hidden: ({ parent }) => parent?.type !== "gradient",
      }),
      defineField({
        name: "gradientDirection",
        title: "Gradient direction",
        type: "string",
        description: "Quick presets for common hero overlays.",
        options: {
          list: [
            { title: "Dark at bottom (text at bottom)", value: "bottom" },
            { title: "Dark at top", value: "top" },
            { title: "Dark in center", value: "center" },
            { title: "Even wash", value: "full" },
          ],
          layout: "radio",
        },
        initialValue: "bottom",
        hidden: ({ parent }) => parent?.type !== "gradient" || parent?.gradientMode === "custom",
      }),
      defineField({
        name: "gradientAngle",
        title: "Gradient direction (degrees)",
        type: "number",
        description: "CSS angle: 0° = toward top, 90° = toward right, 180° = toward bottom.",
        validation: (rule) => rule.min(0).max(360),
        initialValue: 0,
        hidden: ({ parent }) => parent?.type !== "gradient" || parent?.gradientMode !== "custom",
      }),
      defineField({
        name: "gradientStops",
        title: "Gradient stops",
        type: "array",
        description: "Add at least two stops. Position is 0–100 along the gradient line.",
        validation: (rule) => rule.min(2).max(6),
        hidden: ({ parent }) => parent?.type !== "gradient" || parent?.gradientMode !== "custom",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "color",
                title: "Color",
                type: "color",
                options: {
                  disableAlpha: false,
                  colorList: ["#000000", "#e30613", "#ffffff"],
                },
              }),
              defineField({
                name: "position",
                title: "Position (%)",
                type: "number",
                validation: (rule) => rule.required().min(0).max(100),
              }),
            ],
            preview: {
              select: { position: "position", color: "color.hex" },
              prepare({ position, color }) {
                return {
                  title: `${position ?? 0}%`,
                  subtitle: color || "Pick a color",
                };
              },
            },
          }),
        ],
        initialValue: [
          { color: { hex: "#000000", alpha: 0.65 }, position: 0 },
          { color: { hex: "#000000", alpha: 0.25 }, position: 50 },
          { color: { hex: "#000000", alpha: 0 }, position: 100 },
        ],
      }),
      defineField({
        name: "color",
        title: "Overlay color",
        type: "color",
        description: "Use the color picker and alpha slider to set the overlay color and transparency.",
        options: {
          disableAlpha: false,
          colorList: ["#000000", "#e30613", "#ffffff"],
        },
        hidden: ({ parent }) => parent?.type !== "color",
      }),
    ],
  }),
  defineField({
    name: "carouselIntervalMs",
    title: "Carousel interval (ms)",
    type: "number",
    description: "Time between slides in carousel mode. Minimum 2000ms.",
    initialValue: 6500,
    hidden: ({ parent }) => parent?.displayMode !== "carousel",
  }),
  defineField({
    name: "showCarouselDots",
    title: "Show carousel dots",
    type: "boolean",
    initialValue: true,
    hidden: ({ parent }) => parent?.displayMode !== "carousel",
  }),
];

export const heroSectionType = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: heroFields,
  preview: {
    prepare() {
      return { title: "Hero" };
    },
  },
});

export const introSectionType = defineType({
  name: "introSection",
  title: "Intro",
  type: "object",
  fields: [
    sectionIdField("about"),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", ...richTextWithLinks }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title?.trim() || "Intro" };
    },
  },
});

export const featureCardsSectionType = defineType({
  name: "featureCardsSection",
  title: "Feature Cards",
  type: "object",
  fields: [
    sectionIdField("feature-cards"),
    defineField({
      name: "cards",
      title: "Cards",
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
          preview: {
            select: { title: "title", subtitle: "href", media: "imageAsset" },
            prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: PreviewValue["media"] }): PreviewValue {
              return {
                title: title?.trim() || "Feature card",
                subtitle: subtitle?.trim() || undefined,
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Feature Cards" };
    },
  },
});

export const profileSectionType = defineType({
  name: "profileSection",
  title: "Profile",
  type: "object",
  fields: [
    sectionIdField("profile"),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", ...richTextWithLinks }),
    defineField({
      name: "bullets",
      title: "Bullet points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title?.trim() || "Profile" };
    },
  },
});

export const infoCardsSectionType = defineType({
  name: "infoCardsSection",
  title: "Info Cards",
  type: "object",
  fields: [
    sectionIdField("info"),
    defineField({ name: "title", title: "Section title", type: "string" }),
    defineField({ name: "summary", title: "Section summary", ...richTextWithLinks }),
    defineField({
      name: "cards",
      title: "Cards",
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
          preview: {
            select: { title: "title" },
            prepare({ title }: { title?: string }) {
              return { title: title?.trim() || "Info card" };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title?.trim() || "Info Cards" };
    },
  },
});

export const eventCardsSectionType = defineType({
  name: "eventCardsSection",
  title: "Event Cards",
  type: "object",
  fields: [
    sectionIdField("highlights"),
    defineField({ name: "title", title: "Section title", type: "string" }),
    defineField({ name: "description", title: "Section description", ...richTextWithLinks }),
    defineField({
      name: "events",
      title: "Events",
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
          preview: titledImagePreview,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title?.trim() || "Event Cards" };
    },
  },
});

export const newsSectionType = defineType({
  name: "newsSection",
  title: "News",
  type: "object",
  fields: [
    sectionIdField("news"),
    defineField({ name: "title", title: "Section title", type: "string" }),
    defineField({ name: "description", title: "Section description", ...richTextWithLinks }),
    defineField({
      name: "articles",
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
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title?.trim() || "News" };
    },
  },
});

export const partnersSectionType = defineType({
  name: "partnersSection",
  title: "Partners",
  type: "object",
  fields: [
    sectionIdField("partners"),
    defineField({ name: "title", title: "Section title", type: "string" }),
    defineField({ name: "description", title: "Section description", ...richTextWithLinks }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title?.trim() || "Partners" };
    },
  },
});

export const instagramSectionType = defineType({
  name: "instagramSection",
  title: "Instagram",
  type: "object",
  fields: [
    sectionIdField("instagram"),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", ...richTextWithLinks }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title?.trim() || "Instagram" };
    },
  },
});

export const pageSectionTypes = [
  heroSectionType,
  introSectionType,
  featureCardsSectionType,
  profileSectionType,
  infoCardsSectionType,
  eventCardsSectionType,
  newsSectionType,
  partnersSectionType,
  instagramSectionType,
];

export const pageSectionMembers = pageSectionTypes.map((sectionType) =>
  defineArrayMember({ type: sectionType.name })
);

export const headerLinksField = defineField({
  name: "headerLinks",
  title: "Header Links",
  type: "array",
  description: "Controls header navigation. Each link can show text or an Iconify icon.",
  of: [
    defineArrayMember({
      type: "object",
      fields: headerLinkFields,
      preview: {
        select: { label: "label", icon: "icon", href: "href" },
        prepare({ label, icon, href }) {
          return {
            title: label || icon || "Header link",
            subtitle: href,
          };
        },
      },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value || typeof value !== "object") {
            return true;
          }
          const hasLabel = typeof value.label === "string" && value.label.trim().length > 0;
          const hasIcon = typeof value.icon === "string" && value.icon.trim().length > 0;
          if (!hasLabel && !hasIcon) {
            return "Provide either a text label or an Iconify icon name.";
          }
          return true;
        }),
    }),
  ],
});
