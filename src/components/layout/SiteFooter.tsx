import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_URL } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-zinc-950 text-zinc-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:gap-8">
        <div>
          <Image
            src="/brandon-carr-racing-logo-white.svg"
            alt="Brandon Carr Racing"
            width={200}
            height={48}
            className="h-10 max-w-[200px] object-contain object-left"
          />
          <p className="mt-4 text-xs leading-relaxed text-zinc-400">
            Copyright © {new Date().getFullYear()} Brandon Carr Racing. All rights reserved.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-sm font-bold uppercase italic tracking-wide text-white">Follow us</h2>
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-zinc-300 transition hover:text-white"
          >
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A4.5 4.5 0 1112 16a4.5 4.5 0 01-4.5-4.5zm0 2A2.5 2.5 0 1012 9a2.5 2.5 0 00-2.5 2.5zm5.75-3.25a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </Link>
        </div>
        <div>
          <h2 className="font-heading text-sm font-bold uppercase italic tracking-wide text-white">
            Newsletter
          </h2>
          <p className="mt-2 text-xs text-zinc-400">Sign up for updates on races, partners, and appearances.</p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
