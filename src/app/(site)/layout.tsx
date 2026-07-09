import type { Metadata } from "next";
import {
  buildGoogleFontsStylesheetUrl,
  globalStylesToCssProperties,
  mergeGlobalStyles,
} from "@/lib/globalStyles";
import { siteConfig } from "@/lib/siteConfig";
import { client } from "@/sanity/lib/client";
import { globalStylesQuery } from "@/sanity/lib/queries";
import "../globals.css";

/** Re-fetch global styles from Sanity periodically so published edits show without redeploying. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.ico?v=4", sizes: "any" },
      { url: "/favicon.png?v=4", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/favicon.ico?v=4"],
    apple: ["/favicon.png?v=4"],
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.openGraphDescription,
    type: "website",
  },
};

async function getGlobalStyles() {
  try {
    const content = await client.fetch(globalStylesQuery);
    return mergeGlobalStyles(content);
  } catch {
    return mergeGlobalStyles(null);
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalStyles = await getGlobalStyles();
  const googleFontsHref = buildGoogleFontsStylesheetUrl(globalStyles.typography);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={googleFontsHref} rel="stylesheet" />
      <div
        data-type-scale={globalStyles.typography.typeScale}
        className="site-root min-h-full flex flex-col font-sans antialiased scroll-smooth"
        style={globalStylesToCssProperties(globalStyles)}
      >
        {children}
      </div>
    </>
  );
}
