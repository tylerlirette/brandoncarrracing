"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { HeaderCta, NavAlignment, NavItem, NavTheme, NavThemeClasses } from "@/lib/header";
import { navAlignmentClasses, navThemeClasses } from "@/lib/header";
import { isExternalHref } from "@/lib/href";
import { radiusStyles } from "@/lib/theme";

type SiteHeaderNavProps = {
  navItems: NavItem[];
  navAlignment: NavAlignment;
  navTheme: NavTheme;
  cta?: HeaderCta;
};

function linkTarget(openInNewTab: boolean | undefined, href: string): string | undefined {
  return openInNewTab || isExternalHref(href) ? "_blank" : undefined;
}

function linkRel(openInNewTab: boolean | undefined, href: string): string | undefined {
  return openInNewTab || isExternalHref(href) ? "noopener noreferrer" : undefined;
}

function isActiveHref(pathname: string, href: string): boolean {
  if (!href || isExternalHref(href) || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  const normalized = href.startsWith("/") ? href : `/${href}`;
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}

/** Accessible name for icon-only nav items (never announce raw Iconify ids). */
function iconOnlyAriaLabel(icon: string | undefined): string {
  if (!icon) {
    return "Navigation link";
  }
  const name = icon.includes(":") ? icon.split(":")[1] || icon : icon;
  if (/instagram/i.test(name)) return "Instagram";
  if (/facebook/i.test(name)) return "Facebook";
  if (/twitter|x-/i.test(name)) return "X";
  if (/youtube/i.test(name)) return "YouTube";
  if (/linkedin/i.test(name)) return "LinkedIn";
  if (/tiktok/i.test(name)) return "TikTok";
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function navItemAriaLabel(item: { label?: string; icon?: string }): string | undefined {
  // Visible text label is enough; icon-only links need an explicit accessible name.
  if (item.label?.trim()) {
    return undefined;
  }
  if (item.icon) {
    return iconOnlyAriaLabel(item.icon);
  }
  return "Navigation link";
}

const navLinkBaseClassName = "text-xs font-bold uppercase tracking-wide transition";

function NavLinkContent({ label, icon }: { label?: string; icon?: string }) {
  const hasLabel = Boolean(label?.trim());
  const hasIcon = Boolean(icon?.trim());

  if (hasIcon && hasLabel) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Icon icon={icon!} className="h-5 w-5 shrink-0" aria-hidden suppressHydrationWarning />
        {label}
      </span>
    );
  }

  if (hasIcon) {
    return <Icon icon={icon!} className="h-5 w-5" aria-hidden suppressHydrationWarning />;
  }

  return <>{label}</>;
}

function DesktopNavLink({
  item,
  theme,
  pathname,
}: {
  item: Extract<NavItem, { _type: "navLink" }>;
  theme: NavThemeClasses;
  pathname: string;
}) {
  const active = isActiveHref(pathname, item.href);
  const ariaLabel = navItemAriaLabel(item);

  return (
    <Link
      href={item.href}
      target={linkTarget(item.openInNewTab, item.href)}
      rel={linkRel(item.openInNewTab, item.href)}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`${navLinkBaseClassName} ${active ? theme.navLinkActive : theme.navLink}`}
    >
      <NavLinkContent label={item.label} icon={item.icon} />
    </Link>
  );
}

function DesktopNavDropdown({
  item,
  theme,
}: {
  item: Extract<NavItem, { _type: "navDropdown" }>;
  theme: NavThemeClasses;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${navLinkBaseClassName} ${theme.navLink} inline-flex items-center gap-1`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        {item.label}
        <Icon
          icon="mdi:chevron-down"
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div id={menuId} role="menu" className="absolute left-0 top-full z-50 min-w-44 pt-2">
          <div className={`${radiusStyles.card} border py-2 shadow-lg ${theme.dropdownPanel}`}>
            {item.items.map((subItem) => (
              <Link
                key={subItem.href + subItem.label}
                href={subItem.href}
                role="menuitem"
                target={linkTarget(subItem.openInNewTab, subItem.href)}
                rel={linkRel(subItem.openInNewTab, subItem.href)}
                className={`block px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${theme.dropdownLink}`}
                onClick={() => setOpen(false)}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CtaButton({ cta }: { cta: HeaderCta }) {
  return (
    <Link
      href={cta.href}
      target={linkTarget(cta.openInNewTab, cta.href)}
      rel={linkRel(cta.openInNewTab, cta.href)}
      className={`inline-flex shrink-0 items-center justify-center ${radiusStyles.button} bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {cta.label}
    </Link>
  );
}

export function SiteHeaderNav({ navItems, navAlignment, navTheme, cta }: SiteHeaderNavProps) {
  const theme = navThemeClasses[navTheme];
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenDropdown(null);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`hidden w-full items-center gap-6 md:flex ${navAlignmentClasses[navAlignment]}`}
        aria-label="Main navigation"
      >
        {navItems.map((item) =>
          item._type === "navDropdown" ? (
            <DesktopNavDropdown key={item.label} item={item} theme={theme} />
          ) : (
            <DesktopNavLink
              key={item.href + (item.label || item.icon)}
              item={item}
              theme={theme}
              pathname={pathname}
            />
          )
        )}
      </nav>

      <div className="flex items-center gap-3 md:hidden">
        {cta ? <CtaButton cta={cta} /> : null}
        <button
          ref={menuButtonRef}
          type="button"
          className={`inline-flex items-center justify-center ${radiusStyles.button} border p-2 ${theme.menuButton}`}
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            setMobileOpen((open) => !open);
            setOpenDropdown(null);
          }}
        >
          <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} className="h-6 w-6" aria-hidden />
        </button>
      </div>

      {mobileOpen ? (
        <div
          id={panelId}
          ref={panelRef}
          className={`absolute inset-x-0 top-full border-b shadow-lg md:hidden ${theme.mobilePanel}`}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => {
              if (item._type === "navDropdown") {
                const isOpen = openDropdown === item.label;

                return (
                  <div key={item.label} className={`border-b pb-2 ${theme.mobileBorder}`}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between py-2 text-left text-xs font-bold uppercase tracking-wide ${theme.navLink}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    >
                      {item.label}
                      <Icon
                        icon="mdi:chevron-down"
                        className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {isOpen ? (
                      <div className="flex flex-col gap-1 pl-3">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href + subItem.label}
                            href={subItem.href}
                            target={linkTarget(subItem.openInNewTab, subItem.href)}
                            rel={linkRel(subItem.openInNewTab, subItem.href)}
                            className={`py-2 text-xs font-semibold uppercase tracking-wide transition ${theme.mobileSubLink}`}
                            onClick={() => {
                              setMobileOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              const active = isActiveHref(pathname, item.href);
              const ariaLabel = navItemAriaLabel(item);

              return (
                <Link
                  key={item.href + (item.label || item.icon)}
                  href={item.href}
                  target={linkTarget(item.openInNewTab, item.href)}
                  rel={linkRel(item.openInNewTab, item.href)}
                  aria-label={ariaLabel}
                  aria-current={active ? "page" : undefined}
                  className={`border-b py-2 ${navLinkBaseClassName} ${active ? theme.navLinkActive : theme.navLink} ${theme.mobileBorder}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <NavLinkContent label={item.label} icon={item.icon} />
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}

export function SiteHeaderCta({ cta }: { cta?: HeaderCta }) {
  if (!cta) {
    return null;
  }

  return (
    <div className="hidden shrink-0 md:block">
      <CtaButton cta={cta} />
    </div>
  );
}
