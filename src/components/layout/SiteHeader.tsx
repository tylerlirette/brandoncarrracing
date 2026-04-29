import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { defaultHomeSectionAnchors } from "@/lib/homePage";
import { INSTAGRAM_URL } from "@/lib/site";

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: `#${defaultHomeSectionAnchors.welcome}` },
  { label: "Schedule", href: `#${defaultHomeSectionAnchors.highlights}` },
  { label: "Partners", href: `#${defaultHomeSectionAnchors.partners}` },
] as const;

export function SiteHeader() {
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
          {nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`transition hover:text-brand ${item.label === "Home" ? "text-brand" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition hover:text-brand"
            aria-label="Instagram"
          >
            <Icon icon="mdi:instagram" className="h-5 w-5" aria-hidden suppressHydrationWarning />
          </Link>
        </nav>
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="md:hidden"
          aria-label="Instagram"
        >
          <Icon icon="mdi:instagram" className="h-6 w-6 text-zinc-700" aria-hidden suppressHydrationWarning />
        </Link>
      </div>
    </header>
  );
}
