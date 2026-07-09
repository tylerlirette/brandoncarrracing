import { heroSlides, type HeroSlide, type RichTextContent } from "@/lib/site";
import type { CSSProperties } from "react";

export type HeroDisplayMode = "static" | "carousel";

/** Aspect-ratio presets with min/max height caps for responsive heroes. */
export type HeroHeight = "cinematic" | "wide" | "standard" | "viewport" | "compact";

export type HeroTextAlign = "left" | "center" | "right";

export type HeroTextVerticalAlign = "center" | "bottom";

export type HeroTextStyle = "default" | "boxed" | "minimal" | "brand-accent";

/** Matches site body content width (`max-w-6xl`) with wider options. */
export type HeroContentWidth = "site" | "wide" | "full";

export type HeroOverlayType = "none" | "gradient" | "color";

export type HeroGradientDirection = "bottom" | "top" | "center" | "full";

export type HeroGradientMode = "preset" | "custom";

export type HeroGradientStop = {
  color: string;
  opacity: number;
  position: number;
};

export type HeroCustomGradient = {
  angle: number;
  stops: HeroGradientStop[];
};

export type HeroImage = HeroSlide;

export type HeroCta = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type HeroOverlay = {
  type: HeroOverlayType;
  gradientMode?: HeroGradientMode;
  gradientDirection?: HeroGradientDirection;
  customGradient?: HeroCustomGradient;
  /** Hex color, e.g. #000000 */
  color?: string;
  /** 0–100 */
  opacity?: number;
};

/** Sanity `@sanity/color-input` value shape. */
export type SanityColorValue = {
  _type?: string;
  hex?: string;
  alpha?: number;
};

function clampOpacity(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function resolveOverlayColor(
  colorValue: string | SanityColorValue | undefined,
  opacityValue: number | undefined,
  defaults: { color: string; opacity: number }
): { color: string; opacity: number } {
  if (typeof colorValue === "string" && colorValue.trim()) {
    return {
      color: colorValue.trim(),
      opacity: typeof opacityValue === "number" ? clampOpacity(opacityValue) : defaults.opacity,
    };
  }

  if (colorValue && typeof colorValue === "object" && colorValue.hex?.trim()) {
    const alpha = typeof colorValue.alpha === "number" ? colorValue.alpha : 1;
    return {
      color: colorValue.hex.trim(),
      opacity: typeof opacityValue === "number" ? clampOpacity(opacityValue) : clampOpacity(Math.round(alpha * 100)),
    };
  }

  return defaults;
}

export type HeroConfig = {
  displayMode: HeroDisplayMode;
  images: HeroImage[];
  height: HeroHeight;
  heading?: string;
  subtext?: RichTextContent;
  cta?: HeroCta;
  showHeroText: boolean;
  textAlign: HeroTextAlign;
  textVerticalAlign: HeroTextVerticalAlign;
  textStyle: HeroTextStyle;
  contentWidth: HeroContentWidth;
  overlay: HeroOverlay;
  carouselIntervalMs: number;
  showCarouselDots: boolean;
};

export const heroHeightClasses: Record<HeroHeight, string> = {
  cinematic: "aspect-21/9 min-h-64 max-h-[min(80vh,860px)]",
  wide: "aspect-video min-h-56 max-h-[min(75vh,720px)]",
  standard: "aspect-3/2 min-h-72 max-h-[min(70vh,640px)]",
  viewport: "h-[70vh] min-h-96 max-h-screen",
  compact: "aspect-5/2 min-h-48 max-h-[min(50vh,480px)]",
};

export const heroContentWidthClasses: Record<HeroContentWidth, string> = {
  site: "mx-auto w-full max-w-6xl",
  wide: "mx-auto w-full max-w-7xl",
  full: "w-full",
};

export const defaultHeroConfig: HeroConfig = {
  displayMode: "carousel",
  images: [...heroSlides],
  height: "cinematic",
  showHeroText: false,
  textAlign: "center",
  textVerticalAlign: "bottom",
  textStyle: "default",
  contentWidth: "site",
  overlay: {
    type: "gradient",
    gradientMode: "preset",
    gradientDirection: "bottom",
  },
  carouselIntervalMs: 6500,
  showCarouselDots: true,
};

const heroHeights = new Set<HeroHeight>(["cinematic", "wide", "standard", "viewport", "compact"]);
const displayModes = new Set<HeroDisplayMode>(["static", "carousel"]);
const textAligns = new Set<HeroTextAlign>(["left", "center", "right"]);
const textVerticalAligns = new Set<HeroTextVerticalAlign>(["center", "bottom"]);
const textStyles = new Set<HeroTextStyle>(["default", "boxed", "minimal", "brand-accent"]);
const contentWidths = new Set<HeroContentWidth>(["site", "wide", "full"]);
const overlayTypes = new Set<HeroOverlayType>(["none", "gradient", "color"]);
const gradientModes = new Set<HeroGradientMode>(["preset", "custom"]);
const gradientDirections = new Set<HeroGradientDirection>(["bottom", "top", "center", "full"]);

export const defaultCustomGradient: HeroCustomGradient = {
  angle: 0,
  stops: [
    { color: "#000000", opacity: 65, position: 0 },
    { color: "#000000", opacity: 25, position: 50 },
    { color: "#000000", opacity: 0, position: 100 },
  ],
};

function clampPosition(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function normalizeAngle(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

type IncomingGradientStop = {
  color?: string | SanityColorValue;
  position?: number;
};

function normalizeGradientStops(
  incoming: IncomingGradientStop[] | undefined,
  defaults: HeroGradientStop[]
): HeroGradientStop[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((stop, index) => {
      const fallback = defaults[index] ?? defaults[defaults.length - 1];
      const resolved = resolveOverlayColor(stop.color, undefined, {
        color: fallback?.color ?? "#000000",
        opacity: fallback?.opacity ?? 50,
      });

      return {
        color: resolved.color,
        opacity: resolved.opacity,
        position: typeof stop.position === "number" ? clampPosition(stop.position) : (fallback?.position ?? 0),
      };
    })
    .filter((stop) => Boolean(stop.color));

  return merged.length >= 2 ? merged : [...defaults];
}

function normalizeCustomGradient(
  incoming: Partial<HeroCustomGradient> & {
    gradientAngle?: number;
    gradientStops?: IncomingGradientStop[];
  },
  defaults: HeroCustomGradient
): HeroCustomGradient {
  const angle = normalizeAngle(incoming.angle ?? incoming.gradientAngle, defaults.angle);
  const stops = normalizeGradientStops(incoming.stops ?? incoming.gradientStops, defaults.stops);

  return { angle, stops };
}

function pickEnum<T extends string>(value: unknown, allowed: Set<T>, fallback: T): T {
  return typeof value === "string" && allowed.has(value as T) ? (value as T) : fallback;
}

function normalizeImages(incoming: HeroImage[] | undefined, defaults: HeroImage[]): HeroImage[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((image, index) => ({
      src: image.src?.trim() || defaults[index]?.src || "",
      alt: image.alt?.trim() || defaults[index]?.alt || "",
    }))
    .filter((image) => Boolean(image.src && image.alt));

  return merged.length ? merged : [...defaults];
}

function normalizeOverlay(incoming: Partial<HeroOverlay> & {
  gradientMode?: HeroGradientMode;
  gradientAngle?: number;
  gradientStops?: IncomingGradientStop[];
} | undefined, defaults: HeroOverlay): HeroOverlay {
  const type = pickEnum(incoming?.type, overlayTypes, defaults.type);

  if (type === "none") {
    return { type: "none" };
  }

  if (type === "color") {
    const resolved = resolveOverlayColor(
      incoming?.color as string | SanityColorValue | undefined,
      incoming?.opacity,
      { color: defaults.color ?? "#000000", opacity: defaults.opacity ?? 50 }
    );
    return { type: "color", color: resolved.color, opacity: resolved.opacity };
  }

  const gradientMode = pickEnum(incoming?.gradientMode, gradientModes, defaults.gradientMode ?? "preset");

  if (gradientMode === "custom") {
    return {
      type: "gradient",
      gradientMode: "custom",
      customGradient: normalizeCustomGradient(
        {
          angle: incoming?.gradientAngle,
          gradientAngle: incoming?.gradientAngle,
          stops: incoming?.customGradient?.stops,
          gradientStops: incoming?.gradientStops,
          ...incoming?.customGradient,
        },
        defaults.customGradient ?? defaultCustomGradient
      ),
    };
  }

  return {
    type: "gradient",
    gradientMode: "preset",
    gradientDirection: pickEnum(incoming?.gradientDirection, gradientDirections, defaults.gradientDirection ?? "bottom"),
  };
}

function normalizeCta(incoming: Partial<HeroCta> | undefined | null): HeroCta | undefined {
  if (!incoming) {
    return undefined;
  }

  const label = incoming.label?.trim();
  const href = incoming.href?.trim();
  if (!label || !href) {
    return undefined;
  }

  return {
    label,
    href,
    openInNewTab: Boolean(incoming.openInNewTab),
  };
}

function hasSubtext(value: RichTextContent | undefined): boolean {
  if (!value) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return Array.isArray(value) && value.length > 0;
}

function resolveShowHeroText(incoming: Partial<HeroConfig>): boolean {
  return incoming.showHeroText === true;
}

export function normalizeHeroConfig(incoming: Partial<HeroConfig> | undefined | null, defaults: HeroConfig = defaultHeroConfig): HeroConfig {
  if (!incoming) {
    return { ...defaults, images: [...defaults.images], overlay: { ...defaults.overlay } };
  }

  const images = normalizeImages(incoming.images, defaults.images);
  const displayMode = pickEnum(incoming.displayMode, displayModes, defaults.displayMode);
  const showHeroText = resolveShowHeroText(incoming);

  return {
    displayMode,
    images: displayMode === "static" ? images.slice(0, 1) : images,
    height: pickEnum(incoming.height, heroHeights, defaults.height),
    showHeroText,
    heading: showHeroText ? incoming.heading?.trim() || undefined : undefined,
    subtext: showHeroText && hasSubtext(incoming.subtext) ? incoming.subtext : undefined,
    cta: showHeroText ? normalizeCta(incoming.cta) : undefined,
    textAlign: pickEnum(incoming.textAlign, textAligns, defaults.textAlign),
    textVerticalAlign: pickEnum(incoming.textVerticalAlign, textVerticalAligns, defaults.textVerticalAlign),
    textStyle: pickEnum(incoming.textStyle, textStyles, defaults.textStyle),
    contentWidth: pickEnum(incoming.contentWidth, contentWidths, defaults.contentWidth),
    overlay: normalizeOverlay(incoming.overlay, defaults.overlay),
    carouselIntervalMs:
      typeof incoming.carouselIntervalMs === "number" && incoming.carouselIntervalMs >= 2000
        ? incoming.carouselIntervalMs
        : defaults.carouselIntervalMs,
    showCarouselDots: incoming.showCarouselDots ?? defaults.showCarouselDots,
  };
}

/** Map legacy `heroSlides` arrays into a hero config. */
export function heroConfigFromSlides(slides: HeroImage[] | undefined, defaults: HeroConfig = defaultHeroConfig): HeroConfig {
  return normalizeHeroConfig({ ...defaults, images: slides }, defaults);
}

export function hexToRgba(hex: string, opacityPercent: number): string {
  const normalized = hex.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padStart(6, "0").slice(0, 6);

  const r = Number.parseInt(safeHex.slice(0, 2), 16);
  const g = Number.parseInt(safeHex.slice(2, 4), 16);
  const b = Number.parseInt(safeHex.slice(4, 6), 16);
  const alpha = Math.min(100, Math.max(0, opacityPercent)) / 100;

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildHeroGradientCss(gradient: HeroCustomGradient): string {
  const stops = [...gradient.stops].sort((a, b) => a.position - b.position);
  const stopParts = stops.map(
    (stop) => `${hexToRgba(stop.color, stop.opacity)} ${clampPosition(stop.position)}%`
  );

  return `linear-gradient(${normalizeAngle(gradient.angle, 0)}deg, ${stopParts.join(", ")})`;
}

function getPresetGradientClassName(direction: HeroGradientDirection | undefined): string {
  switch (direction) {
    case "top":
      return "bg-linear-to-b from-black/70 via-black/30 to-transparent";
    case "center":
      return "bg-linear-to-b from-transparent via-black/50 to-transparent";
    case "full":
      return "bg-black/45";
    case "bottom":
    default:
      return "bg-linear-to-t from-black/65 via-black/25 to-transparent";
  }
}

export type HeroOverlayPresentation = {
  className: string;
  style?: CSSProperties;
};

export function getHeroOverlayPresentation(overlay: HeroOverlay): HeroOverlayPresentation {
  if (overlay.type === "none") {
    return { className: "" };
  }

  if (overlay.type === "color") {
    return {
      className: "",
      style: {
        backgroundColor: hexToRgba(overlay.color ?? "#000000", overlay.opacity ?? 50),
      },
    };
  }

  if (overlay.gradientMode === "custom" && overlay.customGradient && overlay.customGradient.stops.length >= 2) {
    return {
      className: "",
      style: {
        background: buildHeroGradientCss(overlay.customGradient),
      },
    };
  }

  return {
    className: getPresetGradientClassName(overlay.gradientDirection),
  };
}
