import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { siteConfig } from "@/lib/siteConfig";
import { headingStyles, textStyles } from "@/lib/theme";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-surface-inverse text-inverse">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:gap-8">
        <div>
          <Image
            src={siteConfig.logos.footer}
            alt={siteConfig.logos.footerAlt}
            width={200}
            height={48}
            className="h-10 max-w-[200px] object-contain object-left"
          />
          <p className={`mt-4 ${textStyles.bodySmall} text-subtle`}>
            Copyright © {new Date().getFullYear()} {siteConfig.footer.copyrightEntity}. All rights reserved.
          </p>
        </div>
        <div>
          <h2 className={headingStyles.footer}>Follow us</h2>
          <Link
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-inverse-subtle transition hover:text-white"
          >
            <span className="sr-only">Instagram</span>
            <Icon icon="mdi:instagram" className="h-6 w-6" aria-hidden suppressHydrationWarning />
          </Link>
        </div>
        <div>
          <h2 className={headingStyles.footer}>Updates</h2>
          <p className={`mt-2 ${textStyles.bodySmall} text-subtle`}>{siteConfig.footer.newsletterBlurb}</p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
