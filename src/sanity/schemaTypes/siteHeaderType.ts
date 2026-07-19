import { defineArrayMember, defineField, defineType } from "sanity";
import { HREF_FIELD_DESCRIPTION, validateHrefValue } from "@/lib/href";
import { headerLinkFields, navSubLinkFields } from "./shared/contentFields";

const brandColorList = ["#ffffff", "#18181b", "#e30613", "#b30510", "#808184", "#000000"];

export const siteHeaderType = defineType({
  name: "siteHeader",
  title: "Site Header",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Upload the site logo. It scales to fit the selected header height.",
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
      name: "height",
      title: "Header height",
      type: "string",
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
      name: "backgroundColor",
      title: "Background color",
      type: "color",
      description: "Leave blank to use the site background color.",
      options: {
        disableAlpha: true,
        colorList: brandColorList,
      },
    }),
    defineField({
      name: "sticky",
      title: "Sticky header",
      type: "boolean",
      description: "When enabled, the header stays fixed at the top while scrolling.",
      initialValue: true,
    }),
    defineField({
      name: "navTheme",
      title: "Navigation theme",
      type: "string",
      description: "Light nav uses dark text; dark nav uses light text. Upload a light logo variant for dark nav if needed.",
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
      name: "navAlignment",
      title: "Navigation alignment",
      type: "string",
      description: "How primary nav items are aligned within the navbar (logo stays on the left).",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "navItems",
      title: "Navigation items",
      type: "array",
      description: "Add single links or dropdown menus to build the navigation.",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          title: "Link",
          fields: headerLinkFields,
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
          name: "navDropdown",
          title: "Dropdown",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Dropdown links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: navSubLinkFields,
                  preview: {
                    select: { label: "label", href: "href" },
                    prepare({ label, href }) {
                      return {
                        title: label || "Dropdown link",
                        subtitle: href,
                      };
                    },
                  },
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { label: "label", items: "items" },
            prepare({ label, items }) {
              const count = Array.isArray(items) ? items.length : 0;
              return {
                title: label || "Dropdown",
                subtitle: count ? `${count} link${count === 1 ? "" : "s"}` : "Add links",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA button",
      type: "object",
      description: "Optional call-to-action button, right-aligned in the navbar.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Show CTA button",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "label",
          title: "Button label",
          type: "string",
          hidden: ({ parent }) => !parent?.enabled,
          validation: (rule) =>
            rule.custom((value, context) => {
              const enabled = (context.parent as { enabled?: boolean })?.enabled;
              if (!enabled) {
                return true;
              }
              return typeof value === "string" && value.trim().length > 0
                ? true
                : "Button label is required when the CTA is enabled.";
            }),
        }),
        defineField({
          name: "href",
          title: "Link URL",
          type: "string",
          description: HREF_FIELD_DESCRIPTION,
          hidden: ({ parent }) => !parent?.enabled,
          validation: (rule) =>
            rule.custom((value, context) => {
              const enabled = (context.parent as { enabled?: boolean })?.enabled;
              if (!enabled) {
                return true;
              }
              return validateHrefValue(value, { required: true });
            }),
        }),
        defineField({
          name: "openInNewTab",
          title: "Open in new tab",
          type: "boolean",
          initialValue: false,
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Header" };
    },
  },
});
