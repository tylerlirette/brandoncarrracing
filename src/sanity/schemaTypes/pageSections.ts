import { defineArrayMember, defineField, defineType, type PreviewValue } from "sanity";
import { HREF_FIELD_DESCRIPTION, validateHrefValue } from "@/lib/href";
import { validateLightWidgetIframeSrc } from "@/lib/lightwidget";
import { columnLayoutType } from "./columnLayout";
import { richTextWithLinks, sectionIdField } from "./shared/contentFields";

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

/** Shared image overlay (hero + page sections): none / gradient / solid color. */
const imageOverlayField = (options?: { initialType?: "none" | "gradient" | "color"; title?: string }) =>
  defineField({
    name: "overlay",
    title: options?.title || "Image overlay",
    type: "object",
    description: "Optional wash over the background image to improve contrast.",
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
        initialValue: options?.initialType || "none",
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
        description: "Quick presets for common overlays.",
        options: {
          list: [
            { title: "Dark at bottom", value: "bottom" },
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
                  colorList: ["#000000", "#ffffff"],
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
          colorList: ["#000000", "#ffffff"],
        },
        hidden: ({ parent }) => parent?.type !== "color",
      }),
    ],
  });

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
            description: "Optional fallback, e.g. /images/hero.webp",
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
        description: HREF_FIELD_DESCRIPTION,
        validation: (rule) => rule.custom((value) => validateHrefValue(value, { required: true })),
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
  imageOverlayField({ initialType: "gradient", title: "Image overlay" }),
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

export const instagramSectionType = defineType({
  name: "instagramSection",
  title: "Instagram",
  type: "object",
  fields: [
    sectionIdField("instagram"),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", ...richTextWithLinks }),
    defineField({
      name: "instagramUrl",
      title: "Instagram profile URL",
      type: "url",
      description: "Link for the Open Instagram button.",
    }),
    defineField({
      name: "widgetIframeSrc",
      title: "LightWidget iframe URL",
      type: "string",
      description: "Paste the iframe src from lightwidget.com (e.g. https://lightwidget.com/widgets/….html).",
      validation: (Rule) => Rule.custom((value) => validateLightWidgetIframeSrc(value)),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "instagramUrl" },
    prepare({ title, subtitle }) {
      return {
        title: title?.trim() || "Instagram",
        subtitle: subtitle?.trim() || "Add Instagram URL and LightWidget embed",
      };
    },
  },
});

export const pageBlockTypes = [heroSectionType, instagramSectionType];

export const contentSectionType = defineType({
  name: "contentSection",
  title: "Section",
  type: "object",
  fields: [
    sectionIdField("section"),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional section heading displayed above the layouts.",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      ...richTextWithLinks,
      description: "Optional section subheading displayed below the heading.",
    }),
    defineField({
      name: "textAlign",
      title: "Heading alignment",
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
    }),
    defineField({
      name: "theme",
      title: "Section theme",
      type: "string",
      description: "Light sections use dark text; dark sections use light text.",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "light",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      type: "color",
      description:
        "Optional solid background. Spans the full page width. Shows behind a background image when both are set.",
      options: {
        disableAlpha: false,
        colorList: ["#ffffff", "#18181b", "#fafafa", "#09090b", "#000000"],
      },
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "object",
      description: "Optional full-bleed background image behind the section content.",
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
          description: "Optional fallback if no upload is set.",
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for accessibility. Decorative images can use a short label.",
        }),
      ],
      preview: imageWithAltPreview,
    }),
    imageOverlayField({
      initialType: "none",
      title: "Background overlay",
    }),
    defineField({
      name: "spacing",
      title: "Vertical spacing",
      type: "string",
      description: "Space above and below the section content.",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Tight", value: "tight" },
          { title: "Compact", value: "compact" },
          { title: "Default", value: "default" },
          { title: "Comfortable", value: "comfortable" },
          { title: "Loose", value: "loose" },
          { title: "Spacious", value: "spacious" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "border",
      title: "Border",
      type: "object",
      description: "Optional top and/or bottom border for the section.",
      fields: [
        defineField({
          name: "position",
          title: "Position",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Top", value: "top" },
              { title: "Bottom", value: "bottom" },
              { title: "Top and bottom", value: "both" },
            ],
            layout: "radio",
          },
          initialValue: "none",
        }),
        defineField({
          name: "width",
          title: "Size",
          type: "string",
          options: {
            list: [
              { title: "Hairline (1px)", value: "hairline" },
              { title: "Thin (2px)", value: "thin" },
              { title: "Medium (3px)", value: "medium" },
              { title: "Thick (4px)", value: "thick" },
              { title: "Heavy (6px)", value: "heavy" },
            ],
            layout: "radio",
          },
          initialValue: "thin",
          hidden: ({ parent }) => !parent?.position || parent.position === "none",
        }),
        defineField({
          name: "color",
          title: "Color",
          type: "color",
          description: "Defaults to the theme border color when empty.",
          options: {
            disableAlpha: false,
            colorList: ["#e4e4e7", "#18181b", "#ffffff", "#000000"],
          },
          hidden: ({ parent }) => !parent?.position || parent.position === "none",
        }),
      ],
    }),
    defineField({
      name: "layouts",
      title: "Column layouts",
      type: "array",
      description:
        "Add single-, two-, three-column, or grid layouts. Each column holds one component (card, image, or rich text).",
      of: [defineArrayMember({ type: columnLayoutType.name })],
    }),
    defineField({
      name: "outro",
      title: "Outro",
      ...richTextWithLinks,
      description: "Optional paragraph shown below the column layouts.",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      layouts: "layouts",
    },
    prepare({ heading, layouts }: { heading?: string; layouts?: { variant?: string }[] }) {
      const layoutCount = layouts?.length ?? 0;
      const first = layouts?.[0]?.variant;
      const labels: Record<string, string> = {
        singleColumn: "1-col",
        twoColumn: "2-col",
        threeColumn: "3-col",
        grid: "grid",
      };
      return {
        title: heading?.trim() || "Section",
        subtitle: layoutCount
          ? `${layoutCount} layout${layoutCount === 1 ? "" : "s"}${first ? ` · ${labels[first] || first}` : ""}`
          : "No layouts",
      };
    },
  },
});

export const contentSectionMembers = [defineArrayMember({ type: contentSectionType.name })];
