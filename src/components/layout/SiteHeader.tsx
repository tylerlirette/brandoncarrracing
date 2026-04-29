import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import type { HeaderLink } from "@/lib/homePage";

type SiteHeaderProps = {
  links: HeaderLink[];
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function SiteHeader({ links }: SiteHeaderProps) {
  const mobileIconLinks = links.filter((link) => Boolean(link.icon)).slice(0, 1);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brandon-carr-racing-logo.svg"
            alt="Brandon Carr Racing"
            width={220}
            height={50}
            className="h-9 w-auto md:h-11"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wide text-zinc-800 md:flex">
          {links.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              target={item.openInNewTab || isExternalHref(item.href) ? "_blank" : undefined}
              rel={item.openInNewTab || isExternalHref(item.href) ? "noopener noreferrer" : undefined}
              aria-label={item.label || item.icon || "Navigation link"}
              className={`transition hover:text-brand ${item.label === "Home" ? "text-brand" : "text-zinc-800"}`}
            >
              {item.icon ? (
                <Icon icon={item.icon} className="h-5 w-5" aria-hidden suppressHydrationWarning />
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>
        {mobileIconLinks.length ? (
          <Link
            href={mobileIconLinks[0].href}
            target={mobileIconLinks[0].openInNewTab || isExternalHref(mobileIconLinks[0].href) ? "_blank" : undefined}
            rel={mobileIconLinks[0].openInNewTab || isExternalHref(mobileIconLinks[0].href) ? "noopener noreferrer" : undefined}
            className="md:hidden"
            aria-label={mobileIconLinks[0].label || mobileIconLinks[0].icon || "Navigation link"}
          >
            <Icon
              icon={mobileIconLinks[0].icon || "mdi:link"}
              className="h-6 w-6 text-zinc-700"
              aria-hidden
              suppressHydrationWarning
            />
          </Link>
        ) : null}
      </div>
    </header>
  );
}
