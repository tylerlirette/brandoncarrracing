import type { SanityColorValue } from "@/lib/globalStyles";
import { isExternalHref, sanitizeHref } from "@/lib/href";
import type { RichTextContent } from "@/lib/richText";
import { sanityColorToCss } from "@/lib/sanityColor";
import { radiusStyles, headingVoice } from "@/lib/theme";
import { stegaClean } from "next-sanity";

/** Strip Sanity Visual Editing stega chars so enum comparisons work. */
function clean(value: string | undefined | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const cleaned = stegaClean(value).trim();
  return cleaned || undefined;
}

/** Top-level card kinds the editor picks between. */
export type ContentCardType = "feature" | "info" | "event" | "press";

/** Visual styles per card type. */
export type FeatureCardStyle = "overlay" | "filled" | "minimal";
export type InfoCardStyle = "panel" | "accent" | "muted";
export type EventCardStyle = "stacked" | "horizontal" | "featured";
export type PressCardStyle = "article" | "featured" | "compact";
export type ContentCardStyle = FeatureCardStyle | InfoCardStyle | EventCardStyle | PressCardStyle;

/** @deprecated Prefer cardType + style. Kept for legacy Sanity docs. */
export type ContentCardVariant = FeatureCardStyle | "info" | "event" | "press";

export type ContentCardClickMode = "none" | "card" | "cta";
export type ContentCardShadow = "none" | "subtle" | "medium" | "strong";
export type ContentCardAlign = "left" | "center" | "right";
export type ContentCardAspectRatio = "square" | "landscape" | "wide" | "portrait" | "cinematic";
export type ContentCardTextSize = "small" | "medium" | "large";
export type ContentCardCtaStyle = "link" | "button";

export type ContentCardCta = {
  label: string;
  href: string;
  style: ContentCardCtaStyle;
  openInNewTab?: boolean;
};

export type ContentCard = {
  title: string;
  cardType: ContentCardType;
  style: ContentCardStyle;
  clickMode: ContentCardClickMode;
  description?: RichTextContent;
  image?: string;
  imageAlt?: string;
  shadow: ContentCardShadow;
  alignment: ContentCardAlign;
  aspectRatio: ContentCardAspectRatio;
  textSize: ContentCardTextSize;
  /** Event card */
  subtitle?: string;
  date?: string;
  note?: string;
  /** Press card */
  source?: string;
  excerpt?: string;
  /** Whole-card link when clickMode is "card" */
  href?: string;
  openInNewTab?: boolean;
  /** CTA when clickMode is "cta" (also used as hover label for overlay feature cards) */
  cta?: ContentCardCta;
  bodyBackgroundColor?: string;
};

type RawContentCardCta = {
  label?: string;
  href?: string;
  style?: string;
  openInNewTab?: boolean;
};

export type RawContentCard = {
  _type?: string;
  title?: string;
  description?: RichTextContent;
  image?: string;
  imageAlt?: string;
  /** New model */
  cardType?: string;
  style?: string;
  /** Legacy model — mapped to cardType + style */
  variant?: string;
  clickMode?: string;
  shadow?: string;
  alignment?: string;
  aspectRatio?: string;
  textSize?: string;
  subtitle?: string;
  date?: string;
  note?: string;
  source?: string;
  excerpt?: string;
  cta?: RawContentCardCta;
  href?: string;
  openInNewTab?: boolean;
  bodyBackgroundColor?: SanityColorValue | string;
};

function isCardType(value: string | undefined): value is ContentCardType {
  const cleaned = clean(value);
  return cleaned === "feature" || cleaned === "info" || cleaned === "event" || cleaned === "press";
}

function isFeatureStyle(value: string | undefined): value is FeatureCardStyle {
  const cleaned = clean(value);
  return cleaned === "overlay" || cleaned === "filled" || cleaned === "minimal";
}

function isInfoStyle(value: string | undefined): value is InfoCardStyle {
  const cleaned = clean(value);
  return cleaned === "panel" || cleaned === "accent" || cleaned === "muted";
}

function isEventStyle(value: string | undefined): value is EventCardStyle {
  const cleaned = clean(value);
  return cleaned === "stacked" || cleaned === "horizontal" || cleaned === "featured";
}

function isPressStyle(value: string | undefined): value is PressCardStyle {
  const cleaned = clean(value);
  return cleaned === "article" || cleaned === "featured" || cleaned === "compact";
}

function isClickMode(value: string | undefined): value is ContentCardClickMode {
  const cleaned = clean(value);
  return cleaned === "none" || cleaned === "card" || cleaned === "cta";
}

function isShadow(value: string | undefined): value is ContentCardShadow {
  const cleaned = clean(value);
  return cleaned === "none" || cleaned === "subtle" || cleaned === "medium" || cleaned === "strong";
}

function isAlignment(value: string | undefined): value is ContentCardAlign {
  const cleaned = clean(value);
  return cleaned === "left" || cleaned === "center" || cleaned === "right";
}

function isAspectRatio(value: string | undefined): value is ContentCardAspectRatio {
  const cleaned = clean(value);
  return (
    cleaned === "square" ||
    cleaned === "landscape" ||
    cleaned === "wide" ||
    cleaned === "portrait" ||
    cleaned === "cinematic"
  );
}

function isTextSize(value: string | undefined): value is ContentCardTextSize {
  const cleaned = clean(value);
  return cleaned === "small" || cleaned === "medium" || cleaned === "large";
}

function isCtaStyle(value: string | undefined): value is ContentCardCtaStyle {
  const cleaned = clean(value);
  return cleaned === "link" || cleaned === "button";
}

function cardTypeFromColumnType(_type: string | undefined): ContentCardType | undefined {
  switch (clean(_type)) {
    case "columnFeatureCard":
      return "feature";
    case "columnInfoCard":
      return "info";
    case "columnEventCard":
      return "event";
    case "columnPressCard":
      return "press";
    default:
      return undefined;
  }
}

/** Map legacy variant-only docs and column `_type` into cardType + style. */
export function resolveCardTypeAndStyle(
  incoming: RawContentCard,
  fallback?: ContentCard
): { cardType: ContentCardType; style: ContentCardStyle } {
  const fromColumn = cardTypeFromColumnType(incoming._type);
  const incomingCardType = clean(incoming.cardType);
  const incomingVariant = clean(incoming.variant);
  const incomingStyle = clean(incoming.style);

  const cardType =
    fromColumn ||
    (isCardType(incomingCardType) ? (incomingCardType as ContentCardType) : undefined) ||
    (isFeatureStyle(incomingVariant)
      ? "feature"
      : incomingVariant === "info"
        ? "info"
        : incomingVariant === "event"
          ? "event"
          : incomingVariant === "press"
            ? "press"
            : undefined) ||
    fallback?.cardType ||
    "feature";

  const styleCandidate = incomingStyle || (isFeatureStyle(incomingVariant) ? incomingVariant : undefined);

  if (cardType === "feature") {
    return {
      cardType,
      style: isFeatureStyle(styleCandidate)
        ? (clean(styleCandidate) as FeatureCardStyle)
        : isFeatureStyle(fallback?.style)
          ? (fallback.style as FeatureCardStyle)
          : "overlay",
    };
  }

  if (cardType === "info") {
    return {
      cardType,
      style: isInfoStyle(styleCandidate)
        ? (clean(styleCandidate) as InfoCardStyle)
        : isInfoStyle(fallback?.style)
          ? (fallback.style as InfoCardStyle)
          : "panel",
    };
  }

  if (cardType === "event") {
    return {
      cardType,
      style: isEventStyle(styleCandidate)
        ? (clean(styleCandidate) as EventCardStyle)
        : isEventStyle(fallback?.style)
          ? (fallback.style as EventCardStyle)
          : "stacked",
    };
  }

  return {
    cardType: "press",
    style: isPressStyle(styleCandidate)
      ? (clean(styleCandidate) as PressCardStyle)
      : isPressStyle(fallback?.style)
        ? (fallback.style as PressCardStyle)
        : "article",
  };
}

function defaultTextSize(cardType: ContentCardType, style: ContentCardStyle): ContentCardTextSize {
  if (cardType === "feature" && style === "overlay") {
    return "large";
  }
  return "medium";
}

function needsImage(cardType: ContentCardType, style: ContentCardStyle): boolean {
  if (cardType === "feature") {
    return true;
  }
  if (cardType === "event") {
    return style !== "horizontal" ? true : false; // horizontal still prefers image but allow without
  }
  return false;
}

function eventNeedsImage(style: ContentCardStyle): boolean {
  return style === "stacked" || style === "featured" || style === "horizontal";
}

function normalizeCta(incoming: RawContentCardCta | undefined, fallback?: ContentCardCta): ContentCardCta | undefined {
  const label = incoming?.label?.trim() || fallback?.label || "";
  const href = sanitizeHref(incoming?.href?.trim() || fallback?.href);
  const style = isCtaStyle(incoming?.style) ? incoming.style : fallback?.style || "button";

  if (!label || !href) {
    return undefined;
  }

  return {
    label,
    href,
    style,
    openInNewTab: Boolean(incoming?.openInNewTab ?? fallback?.openInNewTab),
  };
}

function resolveClickMode(
  incoming: RawContentCard,
  fallback: ContentCard | undefined,
  cta: ContentCardCta | undefined,
  href: string | undefined,
  cardType: ContentCardType,
  style: ContentCardStyle
): ContentCardClickMode {
  const cleaned = clean(incoming.clickMode);
  if (isClickMode(cleaned)) {
    return cleaned as ContentCardClickMode;
  }
  if (fallback?.clickMode) {
    return fallback.clickMode;
  }
  if (cta?.href) {
    return cardType === "feature" && style === "overlay" ? "card" : "cta";
  }
  if (href) {
    return "card";
  }
  return "none";
}

export function normalizeContentCard(incoming: RawContentCard, fallback?: ContentCard): ContentCard | null {
  const title = incoming.title?.trim() || fallback?.title || "";
  const { cardType, style } = resolveCardTypeAndStyle(incoming, fallback);
  const image = incoming.image?.trim() || fallback?.image || "";

  if (!title) {
    return null;
  }

  const requireImage =
    cardType === "feature" || (cardType === "event" && eventNeedsImage(style) && needsImage(cardType, style));
  if (requireImage && !image && cardType === "feature") {
    return null;
  }
  if (cardType === "event" && !image && (style === "stacked" || style === "featured")) {
    return null;
  }

  const legacyHref = sanitizeHref(incoming.href?.trim() || fallback?.href);
  const legacyCta = normalizeCta(incoming.cta, fallback?.cta);
  const clickMode = resolveClickMode(incoming, fallback, legacyCta, legacyHref, cardType, style);

  const cardHref =
    clickMode === "card"
      ? sanitizeHref(incoming.href?.trim() || legacyCta?.href || legacyHref || fallback?.href)
      : undefined;

  const defaultCtaLabel = cardType === "press" ? "Read article" : "Learn more";

  const cardCta =
    clickMode === "cta"
      ? (() => {
          const href = sanitizeHref(
            incoming.cta?.href?.trim() || incoming.href?.trim() || legacyHref || fallback?.href
          );
          const label = incoming.cta?.label?.trim() || fallback?.cta?.label || defaultCtaLabel;
          if (!href || !label) {
            return undefined;
          }
          return {
            label,
            href,
            style: isCtaStyle(incoming.cta?.style)
              ? (clean(incoming.cta?.style) as ContentCardCtaStyle)
              : fallback?.cta?.style || "link",
            openInNewTab: Boolean(incoming.openInNewTab ?? incoming.cta?.openInNewTab ?? fallback?.openInNewTab),
          };
        })()
      : clickMode === "card" && cardHref
        ? {
            label: incoming.cta?.label?.trim() || fallback?.cta?.label || defaultCtaLabel,
            href: cardHref,
            style: (isCtaStyle(incoming.cta?.style)
              ? (clean(incoming.cta?.style) as ContentCardCtaStyle)
              : fallback?.cta?.style || "button") as ContentCardCtaStyle,
            openInNewTab: Boolean(
              incoming.openInNewTab ?? incoming.cta?.openInNewTab ?? fallback?.openInNewTab ?? fallback?.cta?.openInNewTab
            ),
          }
        : undefined;

  const resolvedClickMode: ContentCardClickMode =
    clickMode === "card" && !cardHref ? "none" : clickMode === "cta" && !cardCta ? "none" : clickMode;

  const bodyBackgroundColor =
    cardType === "feature" && style === "filled"
      ? sanityColorToCss(incoming.bodyBackgroundColor) ?? fallback?.bodyBackgroundColor
      : undefined;

  const cleanedShadow = clean(incoming.shadow);
  const cleanedAlignment = clean(incoming.alignment);
  const cleanedAspect = clean(incoming.aspectRatio);
  const cleanedTextSize = clean(incoming.textSize);

  return {
    title,
    cardType,
    style,
    clickMode: resolvedClickMode,
    description:
      incoming.description !== undefined && incoming.description !== null
        ? incoming.description
        : fallback?.description,
    image: image || undefined,
    imageAlt: incoming.imageAlt?.trim() || fallback?.imageAlt,
    shadow: isShadow(cleanedShadow) ? (cleanedShadow as ContentCardShadow) : fallback?.shadow || "medium",
    alignment: isAlignment(cleanedAlignment)
      ? (cleanedAlignment as ContentCardAlign)
      : fallback?.alignment || "left",
    aspectRatio: isAspectRatio(cleanedAspect)
      ? (cleanedAspect as ContentCardAspectRatio)
      : fallback?.aspectRatio || "landscape",
    textSize: isTextSize(cleanedTextSize)
      ? (cleanedTextSize as ContentCardTextSize)
      : fallback?.textSize || defaultTextSize(cardType, style),
    subtitle: incoming.subtitle?.trim() || fallback?.subtitle,
    date: incoming.date?.trim() || fallback?.date,
    note: incoming.note?.trim() || fallback?.note,
    source: incoming.source?.trim() || fallback?.source,
    excerpt: incoming.excerpt?.trim() || fallback?.excerpt,
    href: cardHref,
    openInNewTab: Boolean(
      incoming.openInNewTab ?? incoming.cta?.openInNewTab ?? fallback?.openInNewTab ?? fallback?.cta?.openInNewTab
    ),
    cta: cardCta,
    bodyBackgroundColor,
  };
}

export const contentCardAspectClasses: Record<ContentCardAspectRatio, string> = {
  square: "aspect-square",
  landscape: "aspect-[3/2]",
  wide: "aspect-video",
  portrait: "aspect-[3/4]",
  cinematic: "aspect-[21/9]",
};

export const contentCardShadowClasses: Record<ContentCardShadow, string> = {
  none: "",
  subtle: "shadow-sm ring-1 ring-black/5",
  medium: "shadow-md ring-1 ring-black/5",
  strong: "shadow-lg ring-1 ring-black/10",
};

export const contentCardAlignClasses: Record<ContentCardAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export type ContentCardTextSizeClasses = {
  title: string;
  description: string;
  descriptionOverlay: string;
  ctaLink: string;
  ctaButton: string;
  overlayCta: string;
};

export const contentCardTextSizeClasses: Record<ContentCardTextSize, ContentCardTextSizeClasses> = {
  small: {
    title: `font-heading text-xl ${headingVoice} leading-snug tracking-tight md:text-2xl`,
    description: "text-[length:var(--text-body-small)] leading-relaxed",
    descriptionOverlay: "text-xs font-medium italic",
    ctaLink: "text-[10px] font-bold uppercase tracking-widest",
    ctaButton: "text-[10px] font-bold uppercase tracking-widest",
    overlayCta: "text-[10px] font-bold uppercase tracking-widest",
  },
  medium: {
    title: `font-heading text-[length:var(--text-heading-card)] ${headingVoice} leading-snug tracking-tight md:text-[length:var(--text-heading-card-md)]`,
    description: "text-[length:var(--text-body-small)] leading-relaxed",
    descriptionOverlay: "text-sm font-medium italic",
    ctaLink: "text-xs font-bold uppercase tracking-widest",
    ctaButton: "text-xs font-bold uppercase tracking-widest",
    overlayCta: "text-xs font-bold uppercase tracking-widest",
  },
  large: {
    title: `font-heading text-3xl ${headingVoice} leading-snug tracking-tight md:text-4xl`,
    description: "text-[length:var(--text-body)] leading-relaxed md:text-[length:var(--text-body-md)]",
    descriptionOverlay: "text-sm font-medium italic",
    ctaLink: "text-xs font-bold uppercase tracking-widest",
    ctaButton: "text-xs font-bold uppercase tracking-widest",
    overlayCta: "text-xs font-bold uppercase tracking-widest",
  },
};

export function contentCardCtaLinkClass(textSize: ContentCardTextSize): string {
  return `inline-flex w-fit text-brand transition hover:text-brand-secondary ${contentCardTextSizeClasses[textSize].ctaLink}`;
}

export function contentCardCtaButtonClass(textSize: ContentCardTextSize): string {
  return `inline-flex w-fit items-center ${radiusStyles.button} bg-brand px-4 py-2 text-white transition hover:bg-brand-secondary ${contentCardTextSizeClasses[textSize].ctaButton}`;
}

export function cardLinkTarget(openInNewTab: boolean | undefined, href: string): string | undefined {
  return openInNewTab || isExternalHref(href) ? "_blank" : undefined;
}

export function cardLinkRel(openInNewTab: boolean | undefined, href: string): string | undefined {
  return openInNewTab || isExternalHref(href) ? "noopener noreferrer" : undefined;
}

export { isExternalHref };
