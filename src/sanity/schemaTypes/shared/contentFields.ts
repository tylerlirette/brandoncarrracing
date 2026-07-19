import { defineArrayMember, defineField } from "sanity";
import { HREF_FIELD_DESCRIPTION, validateHrefValue } from "@/lib/href";
import { LegacyCardStyleInput } from "@/sanity/components/LegacyCardStyleInput";

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
            fields: [
              defineField({
                name: "href",
                type: "string",
                title: "URL",
                description: HREF_FIELD_DESCRIPTION,
                validation: (rule) => rule.custom((value) => validateHrefValue(value, { required: true })),
              }),
            ],
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

export const navSubLinkFields = [
  defineField({
    name: "label",
    title: "Label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "href",
    title: "Link URL",
    type: "string",
    description: HREF_FIELD_DESCRIPTION,
    validation: (rule) => rule.custom((value) => validateHrefValue(value, { required: true })),
  }),
  defineField({
    name: "openInNewTab",
    title: "Open in new tab",
    type: "boolean",
    initialValue: false,
  }),
];

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
    description: HREF_FIELD_DESCRIPTION,
    validation: (rule) => rule.custom((value) => validateHrefValue(value, { required: true })),
  }),
  defineField({
    name: "openInNewTab",
    title: "Open in new tab",
    type: "boolean",
    initialValue: false,
  }),
];

const brandColorList = ["#ffffff", "#18181b", "#e30613", "#b30510", "#808184", "#000000", "#fafafa", "#f4f4f5"];

function clickModeIsLinkable(clickMode: string | undefined) {
  return clickMode === "card" || clickMode === "cta";
}

const clickModeField = defineField({
  name: "clickMode",
  title: "Click behavior",
  type: "string",
  description: "None = visual only. Whole card = the entire card is a link. CTA = only the button/link is clickable.",
  options: {
    list: [
      { title: "Nothing clickable", value: "none" },
      { title: "Whole card clickable", value: "card" },
      { title: "CTA button / link", value: "cta" },
    ],
    layout: "radio",
  },
  initialValue: "none",
});

const titleField = defineField({
  name: "title",
  title: "Title",
  type: "string",
  validation: (rule) => rule.required(),
});

const shadowField = defineField({
  name: "shadow",
  title: "Shadow",
  type: "string",
  options: {
    list: [
      { title: "None", value: "none" },
      { title: "Subtle", value: "subtle" },
      { title: "Medium", value: "medium" },
      { title: "Strong", value: "strong" },
    ],
    layout: "radio",
  },
  initialValue: "medium",
});

const alignmentField = defineField({
  name: "alignment",
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
  initialValue: "left",
});

const linkFields = [
  defineField({
    name: "href",
    title: "Link URL",
    type: "string",
    description: HREF_FIELD_DESCRIPTION,
    hidden: ({ parent }) => !clickModeIsLinkable(parent?.clickMode),
    validation: (rule) =>
      rule.custom((value, context) => {
        const clickMode = (context.parent as { clickMode?: string } | undefined)?.clickMode;
        if (!clickModeIsLinkable(clickMode)) {
          return true;
        }
        // Optional at schema level when linkable; cards can derive CTA href elsewhere.
        return validateHrefValue(value);
      }),
  }),
  defineField({
    name: "openInNewTab",
    title: "Open in new tab",
    type: "boolean",
    initialValue: false,
    hidden: ({ parent }) => !clickModeIsLinkable(parent?.clickMode),
  }),
  defineField({
    name: "cta",
    title: "Call to action",
    type: "object",
    hidden: ({ parent }) => parent?.clickMode !== "cta",
    fields: [
      defineField({
        name: "label",
        title: "Label",
        type: "string",
        initialValue: "Learn more",
      }),
      defineField({
        name: "style",
        title: "CTA style",
        type: "string",
        options: {
          list: [
            { title: "Text link", value: "link" },
            { title: "Button", value: "button" },
          ],
          layout: "radio",
        },
        initialValue: "button",
      }),
    ],
  }),
];

const imageFields = [
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
  defineField({
    name: "imageAlt",
    title: "Image alt text",
    type: "string",
  }),
];

/** Feature Card — styles: Overlay, Filled, Minimal */
export const featureCardFields = [
  defineField({
    name: "style",
    title: "Feature card style",
    type: "string",
    options: {
      list: [
        { title: "Overlay", value: "overlay" },
        { title: "Filled", value: "filled" },
        { title: "Minimal", value: "minimal" },
      ],
      layout: "radio",
    },
    initialValue: "overlay",
  }),
  // Legacy field kept so existing documents still edit; hidden in Studio.
  defineField({
    name: "variant",
    title: "Legacy variant",
    type: "string",
    hidden: true,
  }),
  clickModeField,
  titleField,
  defineField({
    name: "description",
    title: "Description",
    ...richTextWithLinks,
  }),
  shadowField,
  alignmentField,
  defineField({
    name: "textSize",
    title: "Text size",
    type: "string",
    description: "Controls title, body, and CTA sizing within the card.",
    options: {
      list: [
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Large", value: "large" },
      ],
      layout: "radio",
    },
    initialValue: "large",
  }),
  defineField({
    name: "aspectRatio",
    title: "Image aspect ratio",
    type: "string",
    options: {
      list: [
        { title: "Square (1:1)", value: "square" },
        { title: "Landscape (3:2)", value: "landscape" },
        { title: "Wide (16:9)", value: "wide" },
        { title: "Portrait (3:4)", value: "portrait" },
        { title: "Cinematic (21:9)", value: "cinematic" },
      ],
      layout: "radio",
    },
    initialValue: "landscape",
    hidden: ({ parent }) => parent?.style === "overlay" || parent?.variant === "overlay",
  }),
  ...imageFields,
  defineField({
    name: "bodyBackgroundColor",
    title: "Body background color",
    type: "color",
    description: "Background for the text area (Filled style only).",
    options: {
      disableAlpha: true,
      colorList: brandColorList,
    },
    hidden: ({ parent }) => parent?.style !== "filled" && parent?.variant !== "filled",
  }),
  ...linkFields,
];

/** Info Card — styles: Panel, Accent, Muted */
export const infoCardFields = [
  defineField({
    name: "style",
    title: "Info card style",
    type: "string",
    options: {
      list: [
        { title: "Panel", value: "panel" },
        { title: "Accent", value: "accent" },
        { title: "Muted", value: "muted" },
      ],
      layout: "radio",
    },
    initialValue: "panel",
  }),
  defineField({ name: "variant", title: "Legacy variant", type: "string", hidden: true }),
  clickModeField,
  titleField,
  defineField({
    name: "description",
    title: "Description",
    ...richTextWithLinks,
  }),
  shadowField,
  alignmentField,
  ...linkFields,
];

/** Event Card — styles: Stacked, Horizontal, Featured */
export const eventCardFields = [
  defineField({
    name: "style",
    title: "Event card style",
    type: "string",
    options: {
      list: [
        { title: "Stacked", value: "stacked" },
        { title: "Horizontal", value: "horizontal" },
        { title: "Featured", value: "featured" },
      ],
      layout: "radio",
    },
    initialValue: "stacked",
  }),
  defineField({ name: "variant", title: "Legacy variant", type: "string", hidden: true }),
  clickModeField,
  titleField,
  defineField({
    name: "subtitle",
    title: "Subtitle",
    type: "string",
    description: "Venue, series detail, or supporting line.",
  }),
  defineField({
    name: "date",
    title: "Date",
    type: "string",
  }),
  defineField({
    name: "note",
    title: "Note",
    type: "text",
    rows: 2,
    description: "Short supporting note under the event details.",
  }),
  shadowField,
  ...imageFields,
  ...linkFields,
];

/** Press Card — styles: Article, Featured, Compact */
export const pressCardFields = [
  defineField({
    name: "style",
    title: "Press card style",
    type: "string",
    options: {
      list: [
        { title: "Article", value: "article" },
        { title: "Featured", value: "featured" },
        { title: "Compact", value: "compact" },
      ],
      layout: "radio",
    },
    initialValue: "article",
  }),
  defineField({ name: "variant", title: "Legacy variant", type: "string", hidden: true }),
  clickModeField,
  titleField,
  defineField({
    name: "source",
    title: "Source",
    type: "string",
    description: "Publication or outlet name.",
  }),
  defineField({
    name: "date",
    title: "Date",
    type: "string",
  }),
  defineField({
    name: "excerpt",
    title: "Excerpt",
    type: "text",
    rows: 3,
    hidden: ({ parent }) => parent?.style === "compact",
  }),
  shadowField,
  ...linkFields,
];

/**
 * @deprecated Prefer featureCardFields / infoCardFields / eventCardFields / pressCardFields.
 * Kept for legacy featureCardsSection and columnCard documents.
 */
export const contentCardFields = featureCardFields;

/**
 * Fields for legacy `columnCard` objects that store `cardType` on the document.
 * Hides type-specific fields (images, event/press metadata) based on `cardType`.
 */
export const legacyColumnCardFields = [
  defineField({
    name: "cardType",
    title: "Card type",
    type: "string",
    description:
      "This is a legacy card. Prefer inserting a Feature/Info/Event/Press Card for new content.",
    options: {
      list: [
        { title: "Feature", value: "feature" },
        { title: "Info", value: "info" },
        { title: "Event", value: "event" },
        { title: "Press", value: "press" },
      ],
      layout: "radio",
    },
    initialValue: "feature",
  }),
  defineField({
    name: "style",
    title: "Card style",
    type: "string",
    components: {
      input: LegacyCardStyleInput,
    },
    validation: (rule) =>
      rule.custom((value, context) => {
        const parent = context.parent as { cardType?: string } | undefined;
        const cardType = parent?.cardType || "feature";
        const allowed: Record<string, string[]> = {
          feature: ["overlay", "filled", "minimal"],
          info: ["panel", "accent", "muted"],
          event: ["stacked", "horizontal", "featured"],
          press: ["article", "featured", "compact"],
        };
        if (!value) {
          return true;
        }
        if (!(allowed[cardType] || []).includes(value)) {
          return `Choose a style that matches this ${cardType} card.`;
        }
        return true;
      }),
  }),
  defineField({ name: "variant", title: "Legacy variant", type: "string", hidden: true }),
  clickModeField,
  titleField,
  defineField({
    name: "description",
    title: "Description",
    ...richTextWithLinks,
    hidden: ({ parent }) => parent?.cardType === "event" || parent?.cardType === "press",
  }),
  defineField({
    name: "subtitle",
    title: "Subtitle",
    type: "string",
    description: "Venue, series detail, or supporting line.",
    hidden: ({ parent }) => parent?.cardType !== "event",
  }),
  defineField({
    name: "date",
    title: "Date",
    type: "string",
    hidden: ({ parent }) => parent?.cardType !== "event" && parent?.cardType !== "press",
  }),
  defineField({
    name: "note",
    title: "Note",
    type: "text",
    rows: 2,
    description: "Short supporting note under the event details.",
    hidden: ({ parent }) => parent?.cardType !== "event",
  }),
  defineField({
    name: "source",
    title: "Source",
    type: "string",
    description: "Publication or outlet name.",
    hidden: ({ parent }) => parent?.cardType !== "press",
  }),
  defineField({
    name: "excerpt",
    title: "Excerpt",
    type: "text",
    rows: 3,
    hidden: ({ parent }) => parent?.cardType !== "press" || parent?.style === "compact",
  }),
  shadowField,
  defineField({
    ...alignmentField,
    hidden: ({ parent }) => {
      const cardType = parent?.cardType || "feature";
      return cardType === "event" || cardType === "press";
    },
  }),
  defineField({
    name: "textSize",
    title: "Text size",
    type: "string",
    description: "Controls title, body, and CTA sizing within the card.",
    options: {
      list: [
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Large", value: "large" },
      ],
      layout: "radio",
    },
    initialValue: "large",
    hidden: ({ parent }) => (parent?.cardType || "feature") !== "feature",
  }),
  defineField({
    name: "aspectRatio",
    title: "Image aspect ratio",
    type: "string",
    options: {
      list: [
        { title: "Square (1:1)", value: "square" },
        { title: "Landscape (3:2)", value: "landscape" },
        { title: "Wide (16:9)", value: "wide" },
        { title: "Portrait (3:4)", value: "portrait" },
        { title: "Cinematic (21:9)", value: "cinematic" },
      ],
      layout: "radio",
    },
    initialValue: "landscape",
    hidden: ({ parent }) => {
      const cardType = parent?.cardType || "feature";
      if (cardType === "info" || cardType === "press") {
        return true;
      }
      if (cardType === "feature") {
        return parent?.style === "overlay" || parent?.variant === "overlay";
      }
      return false;
    },
  }),
  ...imageFields.map((field) =>
    defineField({
      ...field,
      hidden: ({ parent }) => {
        const cardType = parent?.cardType || "feature";
        return cardType === "info" || cardType === "press";
      },
    })
  ),
  defineField({
    name: "bodyBackgroundColor",
    title: "Body background color",
    type: "color",
    description: "Background for the text area (Filled style only).",
    options: {
      disableAlpha: true,
      colorList: brandColorList,
    },
    hidden: ({ parent }) =>
      (parent?.cardType || "feature") !== "feature" ||
      (parent?.style !== "filled" && parent?.variant !== "filled"),
  }),
  ...linkFields,
];

export const footerLinkFields = headerLinkFields;

export const footerColumnItemMembers = [
  defineArrayMember({
    type: "object",
    name: "footerLink",
    title: "Link",
    fields: footerLinkFields,
    preview: {
      select: { label: "label", icon: "icon", href: "href" },
      prepare({ label, icon, href }) {
        return {
          title: label || icon || "Link",
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
  defineArrayMember({
    type: "object",
    name: "footerText",
    title: "Text",
    fields: [
      defineField({
        name: "text",
        title: "Text",
        type: "text",
        rows: 4,
        description: "Plain text — useful for store hours, addresses, or short notes.",
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {
      select: { text: "text" },
      prepare({ text }) {
        const preview = text?.trim().split("\n")[0] || "Text block";
        return { title: preview };
      },
    },
  }),
];
