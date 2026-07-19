/**
 * Site identity helpers. Prefer `getSiteSettings()` / Site Settings in Sanity.
 * These exports remain as code fallbacks for modules that need sync defaults.
 */
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { siteConfig } from "@/lib/siteConfig";

export { siteConfig };
export { DEFAULT_SITE_SETTINGS };

export const INSTAGRAM_URL = DEFAULT_SITE_SETTINGS.social.instagram;

/** Default LightWidget embed; Site Settings or env can override at runtime. */
export const INSTAGRAM_LIGHTWIDGET_IFRAME_SRC =
  DEFAULT_SITE_SETTINGS.instagramWidget.defaultIframeSrc;
