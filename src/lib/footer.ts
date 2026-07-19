import type { SanityColorValue } from "@/lib/globalStyles";
import { isExternalHref, sanitizeHref } from "@/lib/href";
import { sanityColorToCss } from "@/lib/sanityColor";
import {
  DEFAULT_SITE_SETTINGS,
  defaultCopyrightText,
  type SiteSettings,
} from "@/lib/siteSettings";
import { headingVoice } from "@/lib/theme";

export type FooterHeight = "short" | "medium" | "tall";
export type FooterTheme = "light" | "dark";

export type FooterLink = {
  _type: "footerLink";
  label?: string;
  icon?: string;
  href: string;
  openInNewTab?: boolean;
};

export type FooterText = {
  _type: "footerText";
  text: string;
};

export type FooterColumnItem = FooterLink | FooterText;

export type FooterBrandColumn = {
  logo?: {
    src: string;
    alt: string;
  };
  text?: string;
};

export type FooterLinksColumn = {
  heading?: string;
  items: FooterColumnItem[];
};

export type FooterRightColumnLayout = "links" | "newsletter";

export type FooterRightColumn = {
  layout: FooterRightColumnLayout;
  heading?: string;
  items: FooterColumnItem[];
  newsletterTextAbove?: string;
  newsletterTextBelow?: string;
};

export type SiteFooterConfig = {
  height: FooterHeight;
  theme: FooterTheme;
  backgroundColor?: string;
  brandColumn: FooterBrandColumn;
  middleColumn: FooterLinksColumn;
  rightColumn: FooterRightColumn;
};

type RawFooterLink = {
  _type?: string;
  label?: string;
  icon?: string;
  href?: string;
  openInNewTab?: boolean;
};

type RawFooterText = {
  _type?: string;
  text?: string;
};

type RawFooterColumnItem = RawFooterLink | RawFooterText;

type RawFooterLinksColumn = {
  heading?: string;
  items?: RawFooterColumnItem[];
};

type RawFooterRightColumn = RawFooterLinksColumn & {
  layout?: string;
  newsletterTextAbove?: string;
  newsletterTextBelow?: string;
};

type RawSiteFooterInput = {
  height?: string;
  theme?: string;
  backgroundColor?: SanityColorValue | string;
  brandColumn?: {
    logo?: {
      alt?: string;
      asset?: { url?: string };
    };
    text?: string;
  };
  middleColumn?: RawFooterLinksColumn;
  rightColumn?: RawFooterRightColumn;
};

function isFooterHeight(value: string | undefined): value is FooterHeight {
  return value === "short" || value === "medium" || value === "tall";
}

function isFooterTheme(value: string | undefined): value is FooterTheme {
  return value === "light" || value === "dark";
}

function normalizeFooterLink(link: RawFooterLink, fallback?: FooterLink): FooterLink | null {
  const label = link.label?.trim() || fallback?.label || "";
  const icon = link.icon?.trim() || fallback?.icon || "";
  const href = sanitizeHref(link.href?.trim() || fallback?.href);

  if (!href || (!label && !icon)) {
    return null;
  }

  return {
    _type: "footerLink",
    label: label || undefined,
    icon: icon || undefined,
    href,
    openInNewTab: Boolean(link.openInNewTab ?? fallback?.openInNewTab),
  };
}

function normalizeFooterText(text: RawFooterText, fallback?: FooterText): FooterText | null {
  const value = text.text?.trim() || fallback?.text || "";
  if (!value) {
    return null;
  }

  return {
    _type: "footerText",
    text: value,
  };
}

function normalizeFooterColumnItems(
  incoming: RawFooterColumnItem[] | undefined,
  defaults: FooterColumnItem[]
): FooterColumnItem[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  // Do not merge CMS items with defaults by index — positional fallbacks can
  // attach an icon/href from an unrelated default onto a CMS-authored link.
  const merged: FooterColumnItem[] = [];

  for (const item of incoming) {
    const type = item._type || ("text" in item ? "footerText" : "footerLink");

    if (type === "footerText") {
      const normalized = normalizeFooterText(item as RawFooterText);
      if (normalized) {
        merged.push(normalized);
      }
      continue;
    }

    const normalized = normalizeFooterLink(item as RawFooterLink);
    if (normalized) {
      merged.push(normalized);
    }
  }

  return merged.length ? merged : [...defaults];
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function isFooterRightColumnLayout(value: string | undefined): value is FooterRightColumnLayout {
  return value === "links" || value === "newsletter";
}

export function defaultSiteFooter(settings: SiteSettings = DEFAULT_SITE_SETTINGS): SiteFooterConfig {
  return {
    height: "medium",
    theme: "dark",
    brandColumn: {
      logo: {
        src: settings.logos.footer,
        alt: settings.logos.footerAlt,
      },
      text: defaultCopyrightText(settings),
    },
    middleColumn: {
      heading: "Follow us",
      items: [
        {
          _type: "footerLink",
          icon: "mdi:instagram",
          href: settings.social.instagram,
          openInNewTab: true,
        },
      ],
    },
    rightColumn: {
      layout: "newsletter",
      heading: "Updates",
      items: [],
      newsletterTextAbove: settings.footer.newsletterBlurb,
    },
  };
}

/** @deprecated Prefer `defaultSiteFooter(settings)` so Site Settings drive fallbacks. */
export const DEFAULT_SITE_FOOTER: SiteFooterConfig = defaultSiteFooter();

export function mergeSiteFooter(
  input: RawSiteFooterInput | null | undefined,
  settings: SiteSettings = DEFAULT_SITE_SETTINGS
): SiteFooterConfig {
  const defaults = defaultSiteFooter(settings);
  const brandInput = input?.brandColumn;
  const logoUrl = brandInput?.logo?.asset?.url?.trim();

  const brandColumn: FooterBrandColumn = {
    logo: logoUrl
      ? {
          src: logoUrl,
          alt: brandInput?.logo?.alt?.trim() || defaults.brandColumn.logo?.alt || settings.logos.footerAlt,
        }
      : defaults.brandColumn.logo,
    text: normalizeOptionalText(brandInput?.text) ?? defaults.brandColumn.text,
  };

  const middleColumn: FooterLinksColumn = {
    heading: normalizeOptionalText(input?.middleColumn?.heading) ?? defaults.middleColumn.heading,
    items: normalizeFooterColumnItems(input?.middleColumn?.items, defaults.middleColumn.items),
  };

  const rightLayout = isFooterRightColumnLayout(input?.rightColumn?.layout)
    ? input.rightColumn.layout
    : defaults.rightColumn.layout;

  const rightColumn: FooterRightColumn = {
    layout: rightLayout,
    heading: normalizeOptionalText(input?.rightColumn?.heading) ?? defaults.rightColumn.heading,
    items:
      rightLayout === "links"
        ? normalizeFooterColumnItems(input?.rightColumn?.items, defaults.rightColumn.items)
        : [],
    newsletterTextAbove:
      rightLayout === "newsletter"
        ? normalizeOptionalText(input?.rightColumn?.newsletterTextAbove) ?? defaults.rightColumn.newsletterTextAbove
        : undefined,
    newsletterTextBelow:
      rightLayout === "newsletter"
        ? normalizeOptionalText(input?.rightColumn?.newsletterTextBelow)
        : undefined,
  };

  const theme = isFooterTheme(input?.theme) ? input.theme : defaults.theme;

  return {
    height: isFooterHeight(input?.height) ? input.height : defaults.height,
    theme,
    backgroundColor: sanityColorToCss(input?.backgroundColor),
    brandColumn,
    middleColumn,
    rightColumn,
  };
}

const footerHeadingBase = `font-heading text-[length:var(--text-heading-footer)] ${headingVoice} tracking-wide`;

export type FooterThemeClasses = {
  footer: string;
  text: string;
  heading: string;
  bodyText: string;
  link: string;
};

export const footerHeightClasses: Record<FooterHeight, { padding: string; gap: string }> = {
  short: {
    padding: "py-8",
    gap: "gap-8",
  },
  medium: {
    padding: "py-12",
    gap: "gap-10 md:gap-8",
  },
  tall: {
    padding: "py-16 md:py-20",
    gap: "gap-12 md:gap-10",
  },
};

export const footerThemeClasses: Record<FooterTheme, FooterThemeClasses> = {
  light: {
    footer: "bg-background",
    text: "text-foreground",
    heading: `${footerHeadingBase} text-foreground`,
    bodyText: "text-muted",
    link: "text-muted hover:text-brand",
  },
  dark: {
    footer: "bg-surface-inverse",
    text: "text-inverse",
    heading: `${footerHeadingBase} text-white`,
    bodyText: "text-subtle",
    link: "text-inverse-subtle hover:text-white",
  },
};

export { isExternalHref };
