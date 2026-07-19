import type { SanityColorValue } from "@/lib/globalStyles";
import { DEFAULT_GLOBAL_STYLES } from "@/lib/globalStyles";
import { sanitizeHref } from "@/lib/href";
import { sanityColorToCss } from "@/lib/sanityColor";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/siteSettings";

export type HeaderHeight = "short" | "medium" | "tall";
export type NavAlignment = "left" | "center" | "right";
export type NavTheme = "light" | "dark";

export type NavLink = {
  _type: "navLink";
  label?: string;
  icon?: string;
  href: string;
  openInNewTab?: boolean;
};

export type NavDropdownItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type NavDropdown = {
  _type: "navDropdown";
  label: string;
  items: NavDropdownItem[];
};

export type NavItem = NavLink | NavDropdown;

export type HeaderCta = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type SiteHeaderConfig = {
  logo: {
    src: string;
    alt: string;
  };
  height: HeaderHeight;
  backgroundColor?: string;
  sticky: boolean;
  navTheme: NavTheme;
  navAlignment: NavAlignment;
  navItems: NavItem[];
  cta?: HeaderCta;
};

type RawNavLink = {
  _type?: string;
  label?: string;
  icon?: string;
  href?: string;
  openInNewTab?: boolean;
};

type RawNavDropdown = {
  _type?: string;
  label?: string;
  items?: RawNavDropdownItem[];
};

type RawNavDropdownItem = {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
};

type RawSiteHeaderInput = {
  logo?: {
    alt?: string;
    asset?: { url?: string };
  };
  height?: string;
  backgroundColor?: SanityColorValue | string;
  sticky?: boolean;
  navTheme?: string;
  navAlignment?: string;
  navItems?: (RawNavLink | RawNavDropdown)[];
  cta?: {
    enabled?: boolean;
    label?: string;
    href?: string;
    openInNewTab?: boolean;
  };
};

function isHeaderHeight(value: string | undefined): value is HeaderHeight {
  return value === "short" || value === "medium" || value === "tall";
}

function isNavAlignment(value: string | undefined): value is NavAlignment {
  return value === "left" || value === "center" || value === "right";
}

function isNavTheme(value: string | undefined): value is NavTheme {
  return value === "light" || value === "dark";
}

function normalizeNavLink(link: RawNavLink, fallback?: NavLink): NavLink | null {
  const label = link.label?.trim() || fallback?.label || "";
  const icon = link.icon?.trim() || fallback?.icon || "";
  const href = sanitizeHref(link.href?.trim() || fallback?.href);

  if (!href || (!label && !icon)) {
    return null;
  }

  return {
    _type: "navLink",
    label: label || undefined,
    icon: icon || undefined,
    href,
    openInNewTab: Boolean(link.openInNewTab ?? fallback?.openInNewTab),
  };
}

function normalizeNavDropdown(dropdown: RawNavDropdown, fallback?: NavDropdown): NavDropdown | null {
  const label = dropdown.label?.trim() || fallback?.label || "";
  const rawItems = dropdown.items?.length ? dropdown.items : fallback?.items;

  if (!label || !rawItems?.length) {
    return null;
  }

  const items: NavDropdownItem[] = [];

  for (const [index, item] of rawItems.entries()) {
    const fallbackItem = fallback?.items[index];
    const itemLabel = item.label?.trim() || fallbackItem?.label || "";
    const href = sanitizeHref(item.href?.trim() || fallbackItem?.href);

    if (!itemLabel || !href) {
      continue;
    }

    items.push({
      label: itemLabel,
      href,
      openInNewTab: Boolean(item.openInNewTab ?? fallbackItem?.openInNewTab),
    });
  }

  if (!items.length) {
    return null;
  }

  return {
    _type: "navDropdown",
    label,
    items,
  };
}

function normalizeNavItems(incoming: (RawNavLink | RawNavDropdown)[] | undefined, defaults: NavItem[]): NavItem[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  // Do not merge CMS items with defaults by index — that can attach an icon-only
  // fallback (e.g. Instagram) onto an unrelated labeled link (e.g. About).
  const merged: NavItem[] = [];

  for (const item of incoming) {
    const type = item._type || (Array.isArray((item as RawNavDropdown).items) ? "navDropdown" : "navLink");

    if (type === "navDropdown") {
      const normalized = normalizeNavDropdown(item as RawNavDropdown);
      if (normalized) {
        merged.push(normalized);
      }
      continue;
    }

    const normalized = normalizeNavLink(item as RawNavLink);
    if (normalized) {
      merged.push(normalized);
    }
  }

  return merged.length ? merged : [...defaults];
}

function normalizeCta(
  incoming: RawSiteHeaderInput["cta"] | undefined,
  fallback?: HeaderCta
): HeaderCta | undefined {
  if (!incoming?.enabled) {
    return undefined;
  }

  const label = incoming.label?.trim() || fallback?.label || "";
  const href = sanitizeHref(incoming.href?.trim() || fallback?.href);

  if (!label || !href) {
    return undefined;
  }

  return {
    label,
    href,
    openInNewTab: Boolean(incoming.openInNewTab ?? fallback?.openInNewTab),
  };
}

export function defaultSiteHeader(settings: SiteSettings = DEFAULT_SITE_SETTINGS): SiteHeaderConfig {
  return {
    logo: {
      src: settings.logos.header,
      alt: settings.logos.headerAlt,
    },
    height: "medium",
    sticky: true,
    navTheme: "light",
    navAlignment: "left",
    navItems: [
      { _type: "navLink", label: "Home", href: "/" },
      {
        _type: "navLink",
        icon: "mdi:instagram",
        href: settings.social.instagram,
        openInNewTab: true,
      },
    ],
  };
}

/** @deprecated Prefer `defaultSiteHeader(settings)` so Site Settings drive fallbacks. */
export const DEFAULT_SITE_HEADER: SiteHeaderConfig = defaultSiteHeader();

export function mergeSiteHeader(
  input: RawSiteHeaderInput | null | undefined,
  settings: SiteSettings = DEFAULT_SITE_SETTINGS
): SiteHeaderConfig {
  const defaults = defaultSiteHeader(settings);
  const logoUrl = input?.logo?.asset?.url?.trim();
  const logoAlt = input?.logo?.alt?.trim() || defaults.logo.alt;

  return {
    logo: {
      src: logoUrl || defaults.logo.src,
      alt: logoAlt,
    },
    height: isHeaderHeight(input?.height) ? input.height : defaults.height,
    backgroundColor: sanityColorToCss(input?.backgroundColor, DEFAULT_GLOBAL_STYLES.colors.background),
    sticky: input?.sticky ?? defaults.sticky,
    navTheme: isNavTheme(input?.navTheme) ? input.navTheme : defaults.navTheme,
    navAlignment: isNavAlignment(input?.navAlignment) ? input.navAlignment : defaults.navAlignment,
    navItems: normalizeNavItems(input?.navItems, defaults.navItems),
    cta: normalizeCta(input?.cta, defaults.cta),
  };
}

export const headerHeightClasses: Record<HeaderHeight, { bar: string; logo: string }> = {
  short: {
    bar: "py-2",
    logo: "h-7 w-auto md:h-8",
  },
  medium: {
    bar: "py-3 md:py-4",
    logo: "h-9 w-auto md:h-11",
  },
  tall: {
    bar: "py-4 md:py-5",
    logo: "h-11 w-auto md:h-14",
  },
};

export const navAlignmentClasses: Record<NavAlignment, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export type NavThemeClasses = {
  header: string;
  border: string;
  navLink: string;
  navLinkActive: string;
  dropdownPanel: string;
  dropdownLink: string;
  mobilePanel: string;
  mobileBorder: string;
  mobileSubLink: string;
  menuButton: string;
};

export const navThemeClasses: Record<NavTheme, NavThemeClasses> = {
  light: {
    header: "bg-background/95",
    border: "border-border",
    navLink: "text-foreground hover:text-brand",
    navLinkActive: "text-brand",
    dropdownPanel: "border-border bg-background",
    dropdownLink: "text-foreground hover:bg-surface-muted hover:text-brand",
    mobilePanel: "border-border bg-background",
    mobileBorder: "border-border/60",
    mobileSubLink: "text-muted hover:text-brand",
    menuButton: "border-border text-foreground",
  },
  dark: {
    header: "bg-surface-inverse/95",
    border: "border-white/15",
    navLink: "text-inverse hover:text-brand",
    navLinkActive: "text-brand",
    dropdownPanel: "border-white/15 bg-surface-inverse",
    dropdownLink: "text-inverse hover:bg-white/10 hover:text-brand",
    mobilePanel: "border-white/15 bg-surface-inverse",
    mobileBorder: "border-white/15",
    mobileSubLink: "text-inverse-muted hover:text-brand",
    menuButton: "border-white/20 text-inverse",
  },
};
