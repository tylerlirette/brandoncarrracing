import { defineArrayMember, defineField, defineType, type PreviewValue } from "sanity";
import {
  eventCardFields,
  featureCardFields,
  infoCardFields,
  legacyColumnCardFields,
  pressCardFields,
  richTextWithLinks,
} from "./shared/contentFields";

const verticalAlignField = defineField({
  name: "verticalAlign",
  title: "Vertical alignment",
  type: "string",
  description: "Aligns this column’s content within the row on desktop. Stretch makes all columns in the row the same height.",
  options: {
    list: [
      { title: "Top", value: "top" },
      { title: "Center", value: "center" },
      { title: "Bottom", value: "bottom" },
      { title: "Stretch (equal height)", value: "stretch" },
    ],
    layout: "radio",
  },
  initialValue: "top",
});

export const columnFeatureCardType = defineType({
  name: "columnFeatureCard",
  title: "Feature Card",
  type: "object",
  fields: featureCardFields,
  preview: {
    select: { title: "title", style: "style", media: "imageAsset" },
    prepare({ title, style, media }: { title?: string; style?: string; media?: PreviewValue["media"] }) {
      const labels: Record<string, string> = { overlay: "Overlay", filled: "Filled", minimal: "Minimal" };
      return {
        title: title?.trim() || "Feature Card",
        subtitle: labels[style || ""] || "Feature",
        media,
      };
    },
  },
});

export const columnInfoCardType = defineType({
  name: "columnInfoCard",
  title: "Info Card",
  type: "object",
  fields: infoCardFields,
  preview: {
    select: { title: "title", style: "style" },
    prepare({ title, style }: { title?: string; style?: string }) {
      const labels: Record<string, string> = { panel: "Panel", accent: "Accent", muted: "Muted" };
      return {
        title: title?.trim() || "Info Card",
        subtitle: labels[style || ""] || "Info",
      };
    },
  },
});

export const columnEventCardType = defineType({
  name: "columnEventCard",
  title: "Event Card",
  type: "object",
  fields: eventCardFields,
  preview: {
    select: { title: "title", style: "style", subtitle: "date", media: "imageAsset" },
    prepare({
      title,
      style,
      subtitle,
      media,
    }: {
      title?: string;
      style?: string;
      subtitle?: string;
      media?: PreviewValue["media"];
    }) {
      const labels: Record<string, string> = {
        stacked: "Stacked",
        horizontal: "Horizontal",
        featured: "Featured",
      };
      return {
        title: title?.trim() || "Event Card",
        subtitle: [labels[style || ""], subtitle].filter(Boolean).join(" · ") || "Event",
        media,
      };
    },
  },
});

export const columnPressCardType = defineType({
  name: "columnPressCard",
  title: "Press Card",
  type: "object",
  fields: pressCardFields,
  preview: {
    select: { title: "title", style: "style", subtitle: "source" },
    prepare({ title, style, subtitle }: { title?: string; style?: string; subtitle?: string }) {
      const labels: Record<string, string> = {
        article: "Article",
        featured: "Featured",
        compact: "Compact",
      };
      return {
        title: title?.trim() || "Press Card",
        subtitle: [labels[style || ""], subtitle].filter(Boolean).join(" · ") || "Press",
      };
    },
  },
});

/** @deprecated Prefer columnFeatureCard / columnInfoCard / columnEventCard / columnPressCard. */
export const columnCardType = defineType({
  name: "columnCard",
  title: "Card (legacy)",
  type: "object",
  description:
    "Legacy card type from older content. Prefer Feature/Info/Event/Press Card when adding new cards.",
  fields: legacyColumnCardFields,
  preview: {
    select: { title: "title", style: "style", cardType: "cardType", media: "imageAsset" },
    prepare({
      title,
      style,
      cardType,
      media,
    }: {
      title?: string;
      style?: string;
      cardType?: string;
      media?: PreviewValue["media"];
    }) {
      const typeLabel =
        cardType === "info"
          ? "Info"
          : cardType === "event"
            ? "Event"
            : cardType === "press"
              ? "Press"
              : "Feature";
      return {
        title: title?.trim() || `${typeLabel} Card`,
        subtitle: `${typeLabel} · ${style || "legacy"}`,
        media,
      };
    },
  },
});

export const columnImageType = defineType({
  name: "columnImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "imageAsset",
      title: "Uploaded image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "image",
      title: "Fallback image path or URL",
      type: "string",
      description: "Optional fallback, e.g. /images/photo.webp",
    }),
    defineField({
      name: "imageAlt",
      title: "Alt text",
      type: "string",
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect ratio",
      type: "string",
      options: {
        list: [
          { title: "Square (1:1)", value: "square" },
          { title: "Landscape (3:2)", value: "landscape" },
          { title: "Wide (16:9)", value: "wide" },
          { title: "Portrait (3:4)", value: "portrait" },
          { title: "Cinematic (21:9)", value: "cinematic" },
          { title: "Auto (natural)", value: "auto" },
        ],
        layout: "radio",
      },
      initialValue: "landscape",
    }),
  ],
  preview: {
    select: { alt: "imageAlt", media: "imageAsset" },
    prepare({ alt, media }: { alt?: string; media?: PreviewValue["media"] }) {
      return {
        title: alt?.trim() || "Image",
        media,
      };
    },
  },
});

export const columnRichTextType = defineType({
  name: "columnRichText",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      ...richTextWithLinks,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { text: "text" },
    prepare({ text }: { text?: { children?: { text?: string }[] }[] }) {
      const first = text?.[0]?.children?.map((child) => child.text || "").join("") || "";
      return {
        title: first.trim() || "Rich text",
        subtitle: "Text",
      };
    },
  },
});

export const columnComponentTypes = [
  columnFeatureCardType,
  columnInfoCardType,
  columnEventCardType,
  columnPressCardType,
  columnCardType,
  columnImageType,
  columnRichTextType,
];

export const columnComponentMembers = columnComponentTypes.map((type) =>
  defineArrayMember({ type: type.name })
);

const cardComponentTypes = new Set([
  "columnFeatureCard",
  "columnInfoCard",
  "columnEventCard",
  "columnPressCard",
  "columnCard",
]);

function componentKindLabel(componentType?: string): string {
  switch (componentType) {
    case "columnFeatureCard":
      return "Feature Card";
    case "columnInfoCard":
      return "Info Card";
    case "columnEventCard":
      return "Event Card";
    case "columnPressCard":
      return "Press Card";
    case "columnCard":
      return "Card";
    case "columnImage":
      return "Image";
    case "columnRichText":
      return "Rich text";
    default:
      return "Empty";
  }
}

export const columnCellType = defineType({
  name: "columnCell",
  title: "Column",
  type: "object",
  fields: [
    verticalAlignField,
    defineField({
      name: "component",
      title: "Component",
      type: "array",
      description:
        "Choose one component: Feature Card, Info Card, Event Card, Press Card, Image, or Rich text.",
      of: columnComponentMembers,
      validation: (rule) => rule.min(1).max(1).error("Add exactly one component to this column."),
    }),
  ],
  preview: {
    select: {
      align: "verticalAlign",
      componentType: "component.0._type",
      cardTitle: "component.0.title",
      imageAlt: "component.0.imageAlt",
      media: "component.0.imageAsset",
    },
    prepare({
      align,
      componentType,
      cardTitle,
      imageAlt,
      media,
    }: {
      align?: string;
      componentType?: string;
      cardTitle?: string;
      imageAlt?: string;
      media?: PreviewValue["media"];
    }) {
      const kind = componentKindLabel(componentType);
      const title = cardComponentTypes.has(componentType || "")
        ? cardTitle?.trim() || kind
        : componentType === "columnImage"
          ? imageAlt?.trim() || "Image"
          : kind;
      return {
        title,
        subtitle: `${kind} · ${align || "top"}`,
        media,
      };
    },
  },
});

function expectedColumnCount(variant: string | undefined, gridColumns?: number, gridRows?: number): number | null {
  if (variant === "singleColumn") return 1;
  if (variant === "twoColumn") return 2;
  if (variant === "threeColumn") return 3;
  if (variant === "grid") {
    const cols = typeof gridColumns === "number" ? gridColumns : 0;
    const rows = typeof gridRows === "number" ? gridRows : 0;
    return cols > 0 && rows > 0 ? cols * rows : null;
  }
  return null;
}

export const columnLayoutType = defineType({
  name: "columnLayout",
  title: "Column layout",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Single column", value: "singleColumn" },
          { title: "2 columns", value: "twoColumn" },
          { title: "3 columns", value: "threeColumn" },
          { title: "Grid", value: "grid" },
        ],
        layout: "radio",
      },
      initialValue: "twoColumn",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gridColumns",
      title: "Grid columns",
      type: "number",
      description: "Number of columns in the grid (2–6).",
      options: {
        list: [
          { title: "2", value: 2 },
          { title: "3", value: 3 },
          { title: "4", value: 4 },
          { title: "5", value: 5 },
          { title: "6", value: 6 },
        ],
        layout: "radio",
      },
      initialValue: 4,
      hidden: ({ parent }) => parent?.variant !== "grid",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { variant?: string } | undefined;
          if (parent?.variant !== "grid") return true;
          if (typeof value !== "number" || value < 2 || value > 6) {
            return "Choose between 2 and 6 columns.";
          }
          return true;
        }),
    }),
    defineField({
      name: "gridRows",
      title: "Grid rows",
      type: "number",
      description: "Number of rows in the grid (1–6).",
      options: {
        list: [
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
          { title: "4", value: 4 },
          { title: "5", value: 5 },
          { title: "6", value: 6 },
        ],
        layout: "radio",
      },
      initialValue: 1,
      hidden: ({ parent }) => parent?.variant !== "grid",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { variant?: string } | undefined;
          if (parent?.variant !== "grid") return true;
          if (typeof value !== "number" || value < 1 || value > 6) {
            return "Choose between 1 and 6 rows.";
          }
          return true;
        }),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "array",
      description: "Add one entry per column (or grid cell). Order is left-to-right, top-to-bottom.",
      of: [defineArrayMember({ type: columnCellType.name })],
      validation: (rule) =>
        rule.required().custom((columns, context) => {
          const parent = context.parent as {
            variant?: string;
            gridColumns?: number;
            gridRows?: number;
          } | undefined;
          const expected = expectedColumnCount(parent?.variant, parent?.gridColumns, parent?.gridRows);
          const count = Array.isArray(columns) ? columns.length : 0;
          if (!expected) {
            return "Choose a layout first.";
          }
          if (count !== expected) {
            return `This layout needs exactly ${expected} column${expected === 1 ? "" : "s"} (currently ${count}).`;
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      variant: "variant",
      gridColumns: "gridColumns",
      gridRows: "gridRows",
      columns: "columns",
    },
    prepare({
      variant,
      gridColumns,
      gridRows,
      columns,
    }: {
      variant?: string;
      gridColumns?: number;
      gridRows?: number;
      columns?: unknown[];
    }) {
      const labels: Record<string, string> = {
        singleColumn: "Single column",
        twoColumn: "2 columns",
        threeColumn: "3 columns",
        grid: "Grid",
      };
      const title = labels[variant || ""] || "Column layout";
      const count = columns?.length ?? 0;
      const subtitle =
        variant === "grid"
          ? `${gridColumns || "?"}×${gridRows || "?"} · ${count} cell${count === 1 ? "" : "s"}`
          : `${count} column${count === 1 ? "" : "s"}`;
      return { title, subtitle };
    },
  },
});

export const columnLayoutSchemaTypes = [
  ...columnComponentTypes,
  columnCellType,
  columnLayoutType,
];
