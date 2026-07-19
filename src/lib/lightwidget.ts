/**
 * LightWidget embed URL allowlist — used by Studio validation and runtime rendering.
 */

const LIGHTWIDGET_HOST_SUFFIX = "lightwidget.com";

function normalizeCandidate(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

export function isLightWidgetHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === LIGHTWIDGET_HOST_SUFFIX || host.endsWith(`.${LIGHTWIDGET_HOST_SUFFIX}`);
}

/**
 * Returns an absolute https LightWidget iframe src, or undefined if not allowlisted.
 */
export function sanitizeLightWidgetIframeSrc(value: string | undefined | null): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  try {
    const url = new URL(normalizeCandidate(value));
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return undefined;
    }
    if (!isLightWidgetHostname(url.hostname)) {
      return undefined;
    }
    // Always load over HTTPS at render time.
    url.protocol = "https:";
    return url.toString();
  } catch {
    return undefined;
  }
}

export const LIGHTWIDGET_VALIDATION_MESSAGE =
  "Use a LightWidget URL (lightwidget.com), e.g. https://lightwidget.com/widgets/….html";

/** Sanity `Rule.custom` helper for optional LightWidget iframe fields. */
export function validateLightWidgetIframeSrc(value: unknown): true | string {
  if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
    return true;
  }
  if (typeof value !== "string") {
    return LIGHTWIDGET_VALIDATION_MESSAGE;
  }
  return sanitizeLightWidgetIframeSrc(value) ? true : LIGHTWIDGET_VALIDATION_MESSAGE;
}
