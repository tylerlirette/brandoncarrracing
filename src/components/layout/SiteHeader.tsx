import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_URL } from "@/lib/site";

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "#profile" },
  { label: "Schedule", href: "#highlights" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#partners" },
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
            <InstagramGlyph className="h-5 w-5" />
          </Link>
        </nav>
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="md:hidden"
          aria-label="Instagram"
        >
          <InstagramGlyph className="h-6 w-6 text-zinc-700" />
        </Link>
      </div>
    </header>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A4.5 4.5 0 1112 16a4.5 4.5 0 01-4.5-4.5zm0 2A2.5 2.5 0 1012 9a2.5 2.5 0 00-2.5 2.5zm5.75-3.25a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}
