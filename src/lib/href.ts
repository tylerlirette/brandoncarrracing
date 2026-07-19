/**
 * Safe href helpers for CMS-driven links.
 * Allowed: absolute http(s), site-relative paths (/…), hash anchors (#…), mailto:, tel:.
 */

import { stegaClean } from "next-sanity";

const ALLOWED_ABSOLUTE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(stegaClean(href)) || stegaClean(href).startsWith("//");
}

/** Human-readable rule for Sanity field descriptions. */
export const HREF_FIELD_DESCRIPTION =
  "Internal path (/about), #anchor, or http(s) / mailto: / tel: URL. javascript: and other schemes are blocked.";

export const HREF_VALIDATION_MESSAGE =
  "Use an internal path (starts with /), a #anchor, or an http(s)/mailto:/tel: URL.";

/**
 * Returns a safe href, or `undefined` if the value must not be rendered as a link.
 * Stega characters from Draft Mode are stripped so URLs remain valid.
 */
export function sanitizeHref(value: string | undefined | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const href = stegaClean(value).trim();
  if (!href) {
    return undefined;
  }

  const lower = href.toLowerCase();

  // Block dangerous / ambiguous schemes before any other parsing.
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    lower.startsWith("blob:")
  ) {
    return undefined;
  }

  // Protocol-relative URLs can point at untrusted hosts — require an explicit scheme.
  if (href.startsWith("//")) {
    return undefined;
  }

  if (href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  try {
    const url = new URL(href);
    if (!ALLOWED_ABSOLUTE_PROTOCOLS.has(url.protocol)) {
      return undefined;
    }
    return href;
  } catch {
    return undefined;
  }
}

/** Sanity `Rule.custom` helper — returns `true` or an error string. */
export function validateHrefValue(value: unknown, options?: { required?: boolean }): true | string {
  if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
    return options?.required ? "Link URL is required." : true;
  }

  if (typeof value !== "string") {
    return HREF_VALIDATION_MESSAGE;
  }

  return sanitizeHref(value) ? true : HREF_VALIDATION_MESSAGE;
}
