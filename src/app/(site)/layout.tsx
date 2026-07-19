import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  buildGoogleFontsStylesheetUrl,
  globalStylesToCssProperties,
  mergeGlobalStyles,
} from "@/lib/globalStyles";
import { mergeSiteFooter } from "@/lib/footer";
import { mergeSiteHeader } from "@/lib/header";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { buildSiteDefaultMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { globalStylesQuery, siteFooterQuery, siteHeaderQuery } from "@/sanity/lib/queries";
import "../globals.css";

/**
 * Fallback ISR window. Prefer the Sanity webhook (`/api/revalidate`) for immediate publishes.
 * Draft Mode / Presentation Tool bypass this via `sanityFetch` perspective switching.
 */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildSiteDefaultMetadata(settings);
}

async function getGlobalStyles() {
  try {
    const { data } = await sanityFetch({
      query: globalStylesQuery,
      stega: false,
    });
    return mergeGlobalStyles(data);
  } catch {
    return mergeGlobalStyles(null);
  }
}

async function getSiteHeader(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  try {
    const { data } = await sanityFetch({
      query: siteHeaderQuery,
    });
    return mergeSiteHeader(data, settings);
  } catch {
    return mergeSiteHeader(null, settings);
  }
}

async function getSiteFooter(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  try {
    const { data } = await sanityFetch({
      query: siteFooterQuery,
    });
    return mergeSiteFooter(data, settings);
  } catch {
    return mergeSiteFooter(null, settings);
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const [globalStyles, siteHeader, siteFooter] = await Promise.all([
    getGlobalStyles(),
    getSiteHeader(settings),
    getSiteFooter(settings),
  ]);
  const googleFontsHref = buildGoogleFontsStylesheetUrl(globalStyles.typography);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={googleFontsHref} rel="stylesheet" />
      <div
        data-type-scale={globalStyles.typography.typeScale}
        data-roundedness={globalStyles.roundedness}
        className="site-root min-h-full flex flex-col font-sans antialiased scroll-smooth"
        style={globalStylesToCssProperties(globalStyles)}
      >
        <SiteHeader config={siteHeader} />
        {children}
        <SiteFooter config={siteFooter} />
      </div>
    </>
  );
}
