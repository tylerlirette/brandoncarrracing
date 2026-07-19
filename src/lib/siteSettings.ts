import { sanitizeHref } from "@/lib/href";
import { sanitizeLightWidgetIframeSrc } from "@/lib/lightwidget";
import { siteConfig } from "@/lib/siteConfig";

export type SiteSettings = {
  name: string;
  url: string;
  description: string;
  openGraphDescription: string;
  defaultOgImage?: {
    url: string;
    alt?: string;
  };
  logos: {
    header: string;
    footer: string;
    headerAlt: string;
    footerAlt: string;
  };
  social: {
    instagram: string;
  };
  footer: {
    copyrightEntity: string;
    newsletterBlurb: string;
  };
  instagramWidget: {
    defaultIframeSrc?: string;
  };
};

type RawLogo = {
  alt?: string;
  asset?: { url?: string };
};

type RawSiteSettingsInput = {
  name?: string;
  description?: string;
  openGraphDescription?: string;
  copyrightEntity?: string;
  newsletterBlurb?: string;
  instagramUrl?: string;
  instagramWidgetIframeSrc?: string;
  logoHeader?: RawLogo;
  logoFooter?: RawLogo;
  defaultOgImage?: {
    alt?: string;
    url?: string;
  };
};

/** Code fallbacks — used when Site Settings is empty or unreachable. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  openGraphDescription: siteConfig.openGraphDescription,
  logos: { ...siteConfig.logos },
  social: { ...siteConfig.social },
  footer: { ...siteConfig.footer },
  instagramWidget: {
    defaultIframeSrc: siteConfig.instagramWidget.defaultIframeSrc,
  },
};

function resolveLogo(
  incoming: RawLogo | undefined,
  fallbackSrc: string,
  fallbackAlt: string,
  nameFallback: string
): { src: string; alt: string } {
  const src = incoming?.asset?.url?.trim() || fallbackSrc;
  const alt = incoming?.alt?.trim() || fallbackAlt || nameFallback;
  return { src, alt };
}

export function mergeSiteSettings(input: RawSiteSettingsInput | null | undefined): SiteSettings {
  const defaults = DEFAULT_SITE_SETTINGS;
  const name = input?.name?.trim() || defaults.name;
  const headerLogo = resolveLogo(input?.logoHeader, defaults.logos.header, defaults.logos.headerAlt, name);
  const footerLogo = resolveLogo(input?.logoFooter, defaults.logos.footer, defaults.logos.footerAlt, name);
  const instagram =
    sanitizeHref(input?.instagramUrl?.trim()) || defaults.social.instagram;
  const widgetSrc =
    sanitizeLightWidgetIframeSrc(input?.instagramWidgetIframeSrc) ||
    defaults.instagramWidget.defaultIframeSrc;
  const defaultOgUrl = input?.defaultOgImage?.url?.trim();

  return {
    name,
    url: defaults.url,
    description: input?.description?.trim() || defaults.description,
    openGraphDescription:
      input?.openGraphDescription?.trim() || defaults.openGraphDescription,
    defaultOgImage: defaultOgUrl
      ? {
          url: defaultOgUrl,
          alt: input?.defaultOgImage?.alt?.trim() || name,
        }
      : defaults.defaultOgImage,
    logos: {
      header: headerLogo.src,
      footer: footerLogo.src,
      headerAlt: headerLogo.alt,
      footerAlt: footerLogo.alt,
    },
    social: { instagram },
    footer: {
      copyrightEntity: input?.copyrightEntity?.trim() || defaults.footer.copyrightEntity || name,
      newsletterBlurb: input?.newsletterBlurb?.trim() || defaults.footer.newsletterBlurb,
    },
    instagramWidget: {
      defaultIframeSrc: widgetSrc,
    },
  };
}

export function defaultCopyrightText(settings: SiteSettings): string {
  return `Copyright © ${new Date().getFullYear()} ${settings.footer.copyrightEntity}. All rights reserved.`;
}
