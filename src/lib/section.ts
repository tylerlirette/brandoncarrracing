import type { CSSProperties } from "react";
import { stegaClean } from "next-sanity";
import type { SanityColorValue } from "@/lib/globalStyles";
import { sanityColorToCss } from "@/lib/sanityColor";
import { headingVoice } from "@/lib/theme";

export type SectionTheme = "light" | "dark";
export type SectionTextAlign = "left" | "center" | "right";
export type SectionSpacing = "none" | "tight" | "compact" | "default" | "comfortable" | "loose" | "spacious";
export type SectionBorderPosition = "none" | "top" | "bottom" | "both";
export type SectionBorderWidth = "hairline" | "thin" | "medium" | "thick" | "heavy";

export type SectionBorder = {
  position: SectionBorderPosition;
  width: SectionBorderWidth;
  color?: string;
};

export type SectionThemeClasses = {
  section: string;
  heading: string;
  subheading: string;
};

const sectionHeadingBase = `font-heading text-[length:var(--text-heading-page)] ${headingVoice} tracking-tight md:text-[length:var(--text-heading-page-md)]`;

export const sectionThemeClasses: Record<SectionTheme, SectionThemeClasses> = {
  light: {
    section: "text-foreground",
    heading: `${sectionHeadingBase} text-foreground`,
    subheading: "text-[length:var(--text-body)] leading-relaxed text-muted md:text-[length:var(--text-body-md)] [&_p+p]:mt-3",
  },
  dark: {
    section: "text-inverse",
    heading: `${sectionHeadingBase} text-white`,
    subheading: "text-[length:var(--text-body)] leading-relaxed text-inverse-muted md:text-[length:var(--text-body-md)] [&_p+p]:mt-3",
  },
};

export const sectionBackgroundClasses: Record<SectionTheme, string> = {
  light: "bg-background",
  dark: "bg-surface-inverse",
};

export const sectionTextAlignClasses: Record<SectionTextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const sectionSpacingClasses: Record<SectionSpacing, string> = {
  none: "py-0",
  tight: "py-4 md:py-6",
  compact: "py-8 md:py-10",
  default: "py-14 md:py-20",
  comfortable: "py-16 md:py-24",
  loose: "py-20 md:py-28",
  spacious: "py-24 md:py-32",
};

export const sectionBorderWidthPx: Record<SectionBorderWidth, number> = {
  hairline: 1,
  thin: 2,
  medium: 3,
  thick: 4,
  heavy: 6,
};

const defaultBorderColorByTheme: Record<SectionTheme, string> = {
  light: "var(--border)",
  dark: "rgba(255, 255, 255, 0.15)",
};

/** Strip Sanity Visual Editing stega chars so enum comparisons work. */
function cleanCmsString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const cleaned = stegaClean(value).trim();
  return cleaned || undefined;
}

export function isSectionTheme(value: unknown): value is SectionTheme {
  const cleaned = cleanCmsString(value);
  return cleaned === "light" || cleaned === "dark";
}

export function isSectionTextAlign(value: unknown): value is SectionTextAlign {
  const cleaned = cleanCmsString(value);
  return cleaned === "left" || cleaned === "center" || cleaned === "right";
}

export function isSectionSpacing(value: unknown): value is SectionSpacing {
  const cleaned = cleanCmsString(value);
  return (
    cleaned === "none" ||
    cleaned === "tight" ||
    cleaned === "compact" ||
    cleaned === "default" ||
    cleaned === "comfortable" ||
    cleaned === "loose" ||
    cleaned === "spacious"
  );
}

export function isSectionBorderPosition(value: unknown): value is SectionBorderPosition {
  const cleaned = cleanCmsString(value);
  return cleaned === "none" || cleaned === "top" || cleaned === "bottom" || cleaned === "both";
}

export function isSectionBorderWidth(value: unknown): value is SectionBorderWidth {
  const cleaned = cleanCmsString(value);
  return (
    cleaned === "hairline" ||
    cleaned === "thin" ||
    cleaned === "medium" ||
    cleaned === "thick" ||
    cleaned === "heavy"
  );
}

export function normalizeSectionTheme(value: unknown, fallback: SectionTheme = "light"): SectionTheme {
  const cleaned = cleanCmsString(value);
  return cleaned === "light" || cleaned === "dark" ? cleaned : fallback;
}

export function normalizeSectionTextAlign(
  value: unknown,
  fallback: SectionTextAlign = "center"
): SectionTextAlign {
  const cleaned = cleanCmsString(value);
  return cleaned === "left" || cleaned === "center" || cleaned === "right" ? cleaned : fallback;
}

export function normalizeSectionSpacing(
  value: unknown,
  fallback: SectionSpacing = "default"
): SectionSpacing {
  const cleaned = cleanCmsString(value);
  return cleaned && cleaned in sectionSpacingClasses ? (cleaned as SectionSpacing) : fallback;
}

export function normalizeSectionBackgroundColor(
  color: SanityColorValue | string | undefined
): string | undefined {
  return sanityColorToCss(color);
}

export function normalizeSectionBorder(
  border: {
    position?: unknown;
    width?: unknown;
    color?: SanityColorValue | string;
  } | null | undefined
): SectionBorder {
  const position = cleanCmsString(border?.position);
  const width = cleanCmsString(border?.width);

  return {
    position:
      position === "top" || position === "bottom" || position === "both" || position === "none"
        ? position
        : "none",
    width: width && width in sectionBorderWidthPx ? (width as SectionBorderWidth) : "thin",
    color: normalizeSectionBackgroundColor(border?.color),
  };
}

export function sectionBorderStyle(
  border: SectionBorder,
  theme: SectionTheme
): CSSProperties | undefined {
  if (border.position === "none") {
    return undefined;
  }

  const width = `${sectionBorderWidthPx[border.width]}px`;
  const color = border.color || defaultBorderColorByTheme[theme];
  const style: CSSProperties = {};

  if (border.position === "top" || border.position === "both") {
    style.borderTop = `${width} solid ${color}`;
  }

  if (border.position === "bottom" || border.position === "both") {
    style.borderBottom = `${width} solid ${color}`;
  }

  return style;
}
