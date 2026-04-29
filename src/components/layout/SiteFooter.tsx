import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
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
            <Icon icon="mdi:instagram" className="h-6 w-6" aria-hidden suppressHydrationWarning />
          </Link>
        </div>
        <div>
          <h2 className="font-heading text-sm font-bold uppercase italic tracking-wide text-white">
            Updates
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Sign up for race schedule updates, partner news, and appearances.
          </p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
