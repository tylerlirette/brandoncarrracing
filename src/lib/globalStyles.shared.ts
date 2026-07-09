/** Studio-safe shared constants — no React imports (used by Sanity schema). */

export const GOOGLE_FONT_OPTIONS = [
  { title: "Barlow Condensed", value: "Barlow Condensed" },
  { title: "Source Sans 3", value: "Source Sans 3" },
  { title: "Inter", value: "Inter" },
  { title: "Roboto", value: "Roboto" },
  { title: "Open Sans", value: "Open Sans" },
  { title: "Lato", value: "Lato" },
  { title: "Montserrat", value: "Montserrat" },
  { title: "Oswald", value: "Oswald" },
  { title: "Poppins", value: "Poppins" },
  { title: "Raleway", value: "Raleway" },
  { title: "Playfair Display", value: "Playfair Display" },
  { title: "Merriweather", value: "Merriweather" },
] as const;

export const TYPE_SCALE_OPTIONS = [
  { title: "Compact", value: "compact" },
  { title: "Default", value: "default" },
  { title: "Large", value: "large" },
] as const;

/** Validates and normalizes a Google Fonts stylesheet URL pasted from embed code. */
export function parseGoogleFontsStylesheetUrl(input: string | undefined): string | undefined {
  if (!input?.trim()) {
    return undefined;
  }

  const trimmed = input.trim();

  try {
    const url = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed);
    if (url.protocol !== "https:" || url.hostname !== "fonts.googleapis.com") {
      return undefined;
    }
    if (!url.pathname.startsWith("/css2")) {
      return undefined;
    }
    return url.toString();
  } catch {
    const hrefMatch = trimmed.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch?.[1]) {
      return undefined;
    }
    return parseGoogleFontsStylesheetUrl(hrefMatch[1]);
  }
}
