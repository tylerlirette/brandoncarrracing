import { stegaClean } from "next-sanity";
import type { SanityColorValue } from "@/lib/globalStyles";

/**
 * Convert a Sanity color-input value (or CSS string) to a CSS color.
 * When `fallback` is omitted, invalid/empty values return `undefined`.
 * Stega characters from Draft Mode / Visual Editing are stripped.
 */
export function sanityColorToCss(
  color: SanityColorValue | string | undefined,
  fallback: string
): string;
export function sanityColorToCss(
  color: SanityColorValue | string | undefined,
  fallback?: undefined
): string | undefined;
export function sanityColorToCss(
  color: SanityColorValue | string | undefined,
  fallback?: string
): string | undefined {
  if (typeof color === "string") {
    const cleaned = stegaClean(color).trim();
    return cleaned || fallback;
  }

  if (color && typeof color === "object" && color.hex) {
    const hex = stegaClean(color.hex).trim();
    if (!hex) {
      return fallback;
    }

    const alpha = typeof color.alpha === "number" ? color.alpha : 1;
    if (alpha >= 1) {
      return hex;
    }

    const normalized = hex.replace("#", "");
    if (normalized.length !== 6) {
      return hex;
    }

    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return fallback;
}
