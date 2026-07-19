import {
  normalizeColumnLayouts,
  type ColumnLayout,
} from "@/lib/columnLayout";
import {
  defaultHeroConfig,
  normalizeHeroConfig,
  normalizeHeroOverlay,
  type HeroConfig,
  type HeroOverlay,
} from "@/lib/hero";
import {
  hasRichText,
  toRichText,
  type RichTextContent,
} from "@/lib/richText";
import {
  normalizeSectionBackgroundColor,
  normalizeSectionBorder,
  normalizeSectionSpacing,
  normalizeSectionTextAlign,
  normalizeSectionTheme,
  type SectionBorder,
  type SectionSpacing,
  type SectionTextAlign,
  type SectionTheme,
} from "@/lib/section";
import { INSTAGRAM_URL } from "@/lib/site";
import type { SanityColorValue } from "@/lib/globalStyles";
import { sanitizeHref } from "@/lib/href";
import { sanitizeLightWidgetIframeSrc } from "@/lib/lightwidget";

export type PageLayout = "default" | "narrow" | "fullWidth";

export type HeroSection = HeroConfig & {
  _type: "heroSection";
  _key: string;
};

export type InstagramSection = {
  _type: "instagramSection";
  _key: string;
  sectionId: string;
  heading: string;
  description?: RichTextContent;
  instagramUrl: string;
  widgetIframeSrc?: string;
};

export type ContentSectionBackgroundImage = {
  src: string;
  alt: string;
};

export type ContentSection = {
  _type: "contentSection";
  _key: string;
  sectionId: string;
  heading?: string;
  subheading?: RichTextContent;
  textAlign: SectionTextAlign;
  theme: SectionTheme;
  backgroundColor?: string;
  backgroundImage?: ContentSectionBackgroundImage;
  overlay: HeroOverlay;
  spacing: SectionSpacing;
  border: SectionBorder;
  layouts: ColumnLayout[];
  outro?: RichTextContent;
};

/** Top-level page blocks — matches what editors can add on a page document. */
export type PageBlock = ContentSection | HeroSection | InstagramSection;

export type PageSeo = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type PageContent = {
  title: string;
  slug: string;
  layout: PageLayout;
  sections: PageBlock[];
  seo: PageSeo;
};

type RawPageSection = {
  _type?: string;
  _key?: string;
  [key: string]: unknown;
};

type RawPageContent = {
  title?: string;
  slug?: string;
  layout?: PageLayout;
  sections?: RawPageSection[];
  seo?: PageSeo;
};

function normalizeSlug(value: string | undefined): string {
  if (!value?.trim() || value.trim() === "/") {
    return "/";
  }
  return value.trim().replace(/^\/+|\/+$/g, "");
}

function sectionKey(index: number, value?: string): string {
  return value?.trim() || `section-${index}`;
}

function normalizeHeroSection(section: RawPageSection, index: number): HeroSection {
  return {
    _type: "heroSection",
    _key: sectionKey(index, section._key),
    ...normalizeHeroConfig(section as Partial<HeroConfig>, defaultHeroConfig),
  };
}

function normalizeInstagramSection(
  section: RawPageSection,
  index: number,
  defaults?: { instagramUrl?: string }
): InstagramSection {
  const widgetIframeSrc = sanitizeLightWidgetIframeSrc(
    typeof section.widgetIframeSrc === "string" ? section.widgetIframeSrc : undefined
  );
  const description = section.description
    ? toRichText(section.description as RichTextContent)
    : undefined;
  const instagramUrl =
    sanitizeHref(typeof section.instagramUrl === "string" ? section.instagramUrl : undefined) ||
    defaults?.instagramUrl ||
    INSTAGRAM_URL;

  return {
    _type: "instagramSection",
    _key: sectionKey(index, section._key),
    sectionId: String(section.sectionId || "instagram"),
    heading: String(section.heading || "Instagram").trim() || "Instagram",
    ...(hasRichText(description) ? { description } : {}),
    instagramUrl,
    ...(widgetIframeSrc ? { widgetIframeSrc } : {}),
  };
}

function normalizeSectionBackgroundImage(raw: unknown): ContentSectionBackgroundImage | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const image = raw as { src?: string; alt?: string };
  const src = typeof image.src === "string" ? image.src.trim() : "";
  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: typeof image.alt === "string" ? image.alt.trim() : "",
  };
}

function normalizeContentSection(section: RawPageSection, index: number): ContentSection {
  return {
    _type: "contentSection",
    _key: sectionKey(index, section._key),
    sectionId: String(section.sectionId || `section-${index}`),
    heading: typeof section.heading === "string" ? section.heading.trim() || undefined : undefined,
    subheading: section.subheading ? toRichText(section.subheading as RichTextContent) : undefined,
    textAlign: normalizeSectionTextAlign(section.textAlign),
    theme: normalizeSectionTheme(section.theme),
    backgroundColor: normalizeSectionBackgroundColor(
      section.backgroundColor as SanityColorValue | string | undefined
    ),
    backgroundImage: normalizeSectionBackgroundImage(section.backgroundImage),
    overlay: normalizeHeroOverlay(section.overlay as Parameters<typeof normalizeHeroOverlay>[0], {
      type: "none",
    }),
    spacing: normalizeSectionSpacing(section.spacing),
    border: normalizeSectionBorder(
      section.border as
        | { position?: unknown; width?: unknown; color?: SanityColorValue | string }
        | null
        | undefined
    ),
    layouts: normalizeColumnLayouts(section.layouts),
    outro: section.outro ? toRichText(section.outro as RichTextContent) : undefined,
  };
}

function normalizeSection(
  section: RawPageSection,
  index: number,
  defaults?: { instagramUrl?: string }
): PageBlock | null {
  switch (section._type) {
    case "heroSection":
      return normalizeHeroSection(section, index);
    case "instagramSection":
      return normalizeInstagramSection(section, index, defaults);
    case "contentSection":
      return normalizeContentSection(section, index);
    default:
      return null;
  }
}

/** Empty page shell — content comes from Sanity; no branded fallbacks. */
export const emptyPageContent: PageContent = {
  title: "Home",
  slug: "/",
  layout: "default",
  sections: [],
  seo: {},
};

export type MergePageDefaults = {
  instagramUrl?: string;
};

function normalizePageSeo(seo: PageSeo | undefined): PageSeo {
  if (!seo) {
    return {};
  }

  return {
    title: seo.title?.trim() || undefined,
    description: seo.description?.trim() || undefined,
    imageUrl: seo.imageUrl?.trim() || undefined,
    imageAlt: seo.imageAlt?.trim() || undefined,
  };
}

export function mergePageContent(
  content?: RawPageContent | null,
  defaults?: MergePageDefaults
): PageContent {
  if (!content) {
    return emptyPageContent;
  }

  const sections = (content.sections || [])
    .map((section, index) => normalizeSection(section, index, defaults))
    .filter((section): section is PageBlock => Boolean(section));

  return {
    title: content.title?.trim() || emptyPageContent.title,
    slug: normalizeSlug(content.slug),
    layout: content.layout || "default",
    sections,
    seo: normalizePageSeo(content.seo),
  };
}

export function slugFromPathSegments(segments: string[] | undefined): string {
  if (!segments?.length) {
    return "/";
  }
  return segments.join("/");
}

export function pathFromSlug(slug: string): string {
  return slug === "/" ? "/" : `/${slug}`;
}

export function staticParamsFromSlug(slug: string): { slug?: string[] } {
  if (slug === "/") {
    return {};
  }
  return { slug: slug.split("/") };
}
