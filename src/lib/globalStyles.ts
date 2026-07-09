import type { CSSProperties } from "react";
import {
  GOOGLE_FONT_OPTIONS,
  TYPE_SCALE_OPTIONS,
  parseGoogleFontsStylesheetUrl,
} from "@/lib/globalStyles.shared";

export {
  GOOGLE_FONT_OPTIONS,
  TYPE_SCALE_OPTIONS,
  parseGoogleFontsStylesheetUrl,
} from "@/lib/globalStyles.shared";

/** Sanity `@sanity/color-input` value shape. */
export type SanityColorValue = {
  _type?: string;
  hex?: string;
  alpha?: number;
};

export type TypeScale = "compact" | "default" | "large";

export type GlobalStylesColors = {
  background: string;
  foreground: string;
  muted: string;
  subtle: string;
  bodyEmphasis: string;
  surfaceMuted: string;
  surfaceSubtle: string;
  border: string;
  surfaceInverse: string;
  inverse: string;
  inverseMuted: string;
  inverseSubtle: string;
  badge: string;
  brand: string;
  brandSecondary: string;
  brandTertiary: string;
};

export type GlobalStylesTypography = {
  headingFont: string;
  bodyFont: string;
  /** Optional override — validated Google Fonts stylesheet URL from the embed code. */
  googleFontsStylesheetUrl?: string;
  typeScale: TypeScale;
};

export type GlobalStyles = {
  colors: GlobalStylesColors;
  typography: GlobalStylesTypography;
};

/** Mirrors `:root` defaults in globals.css — used when Sanity has no value. */
export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  colors: {
    background: "#ffffff",
    foreground: "#18181b",
    muted: "#52525b",
    subtle: "#71717a",
    bodyEmphasis: "#3f3f46",
    surfaceMuted: "#fafafa",
    surfaceSubtle: "#f4f4f5",
    border: "#e4e4e7",
    surfaceInverse: "#09090b",
    inverse: "#e4e4e7",
    inverseMuted: "#a1a1aa",
    inverseSubtle: "#d4d4d8",
    badge: "#27272a",
    brand: "#e30613",
    brandSecondary: "#b30510",
    brandTertiary: "#808184",
  },
  typography: {
    headingFont: "Barlow Condensed",
    bodyFont: "Source Sans 3",
    typeScale: "default",
  },
};

type SanityGlobalStylesInput = {
  colors?: Partial<Record<keyof GlobalStylesColors, SanityColorValue | string>> & {
    /** @deprecated Renamed to brandSecondary */
    brandDark?: SanityColorValue | string;
    /** @deprecated Renamed to brandTertiary */
    brandSilver?: SanityColorValue | string;
  };
  typography?: Partial<GlobalStylesTypography>;
};

const COLOR_FIELD_TO_CSS_VAR: Record<keyof GlobalStylesColors, string> = {
  background: "--background",
  foreground: "--foreground",
  muted: "--muted",
  subtle: "--subtle",
  bodyEmphasis: "--body-emphasis",
  surfaceMuted: "--surface-muted",
  surfaceSubtle: "--surface-subtle",
  border: "--border",
  surfaceInverse: "--surface-inverse",
  inverse: "--inverse",
  inverseMuted: "--inverse-muted",
  inverseSubtle: "--inverse-subtle",
  badge: "--badge",
  brand: "--brand",
  brandSecondary: "--brand-secondary",
  brandTertiary: "--brand-tertiary",
};

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return hex;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function sanityColorToCss(
  color: SanityColorValue | string | undefined,
  fallback: string
): string {
  if (typeof color === "string" && color.trim()) {
    return color.trim();
  }

  if (color && typeof color === "object" && color.hex?.trim()) {
    const alpha = typeof color.alpha === "number" ? color.alpha : 1;
    if (alpha >= 1) {
      return color.hex.trim();
    }
    return hexToRgba(color.hex.trim(), alpha);
  }

  return fallback;
}

function isTypeScale(value: string | undefined): value is TypeScale {
  return value === "compact" || value === "default" || value === "large";
}

function isAllowedGoogleFont(value: string | undefined): value is (typeof GOOGLE_FONT_OPTIONS)[number]["value"] {
  if (!value?.trim()) {
    return false;
  }
  return GOOGLE_FONT_OPTIONS.some((option) => option.value === value.trim());
}

function encodeGoogleFontFamily(family: string): string {
  return encodeURIComponent(family).replace(/%20/g, "+");
}

/** Builds a Google Fonts URL from heading/body selections when no custom URL is set. */
export function buildGoogleFontsStylesheetUrl(typography: GlobalStylesTypography): string {
  const customUrl = parseGoogleFontsStylesheetUrl(typography.googleFontsStylesheetUrl);
  if (customUrl) {
    return customUrl;
  }

  const heading = encodeGoogleFontFamily(typography.headingFont);
  const body = encodeGoogleFontFamily(typography.bodyFont);

  return `https://fonts.googleapis.com/css2?family=${heading}:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=${body}:wght@400;600;700&display=swap`;
}

export function mergeGlobalStyles(input: SanityGlobalStylesInput | null | undefined): GlobalStyles {
  const defaults = DEFAULT_GLOBAL_STYLES;
  const colors = { ...defaults.colors };
  const incomingColors = input?.colors;

  if (incomingColors) {
    const resolvedColors = {
      ...incomingColors,
      brandSecondary: incomingColors.brandSecondary ?? incomingColors.brandDark,
      brandTertiary: incomingColors.brandTertiary ?? incomingColors.brandSilver,
    };

    for (const key of Object.keys(colors) as (keyof GlobalStylesColors)[]) {
      colors[key] = sanityColorToCss(resolvedColors[key], defaults.colors[key]);
    }
  }

  const typography: GlobalStylesTypography = {
    headingFont: isAllowedGoogleFont(input?.typography?.headingFont)
      ? input.typography.headingFont.trim()
      : defaults.typography.headingFont,
    bodyFont: isAllowedGoogleFont(input?.typography?.bodyFont)
      ? input.typography.bodyFont.trim()
      : defaults.typography.bodyFont,
    googleFontsStylesheetUrl: parseGoogleFontsStylesheetUrl(input?.typography?.googleFontsStylesheetUrl),
    typeScale: isTypeScale(input?.typography?.typeScale)
      ? input.typography.typeScale
      : defaults.typography.typeScale,
  };

  return { colors, typography };
}

export function globalStylesToCssProperties(styles: GlobalStyles): CSSProperties {
  const vars: Record<string, string> = {
    "--font-heading-family": `"${styles.typography.headingFont}", ui-sans-serif, system-ui, sans-serif`,
    "--font-body-family": `"${styles.typography.bodyFont}", ui-sans-serif, system-ui, sans-serif`,
  };

  for (const [field, cssVar] of Object.entries(COLOR_FIELD_TO_CSS_VAR) as [keyof GlobalStylesColors, string][]) {
    vars[cssVar] = styles.colors[field];
  }

  return vars as CSSProperties;
}
