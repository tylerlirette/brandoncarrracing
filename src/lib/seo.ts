import { sizedCdnUrl } from "@/sanity/lib/image";
import type { Metadata } from "next";
import { pathFromSlug } from "@/lib/page";
import type { SiteSettings } from "@/lib/siteSettings";

const OG_IMAGE_WIDTH = 1200;

/** Resolve a share image to an absolute URL sized for Open Graph. */
export function resolveOgImageUrl(
  siteUrl: string,
  imageUrl: string | undefined
): string | undefined {
  if (!imageUrl?.trim()) {
    return undefined;
  }

  const sized = sizedCdnUrl(imageUrl.trim(), OG_IMAGE_WIDTH, 80);

  try {
    return new URL(sized, siteUrl).toString();
  } catch {
    return undefined;
  }
}

export type PageSeoInput = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function buildPageMetadata(input: {
  pageTitle: string;
  slug: string;
  seo: PageSeoInput;
  settings: SiteSettings;
}): Metadata {
  const { pageTitle, slug, seo, settings } = input;
  const title = seo.title?.trim() || pageTitle || settings.name;
  const description = seo.description?.trim() || settings.description;
  const imageUrl = resolveOgImageUrl(
    settings.url,
    seo.imageUrl || settings.defaultOgImage?.url
  );
  const imageAlt =
    seo.imageAlt?.trim() || settings.defaultOgImage?.alt || settings.name;
  const canonicalPath = pathFromSlug(slug);
  const canonicalUrl = new URL(canonicalPath, settings.url).toString();

  const images = imageUrl ? [{ url: imageUrl, alt: imageAlt, width: 1200, height: 630 }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function buildSiteDefaultMetadata(settings: SiteSettings): Metadata {
  const imageUrl = resolveOgImageUrl(settings.url, settings.defaultOgImage?.url);
  const images = imageUrl
    ? [
        {
          url: imageUrl,
          alt: settings.defaultOgImage?.alt || settings.name,
          width: 1200,
          height: 630,
        },
      ]
    : undefined;

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: settings.name,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    icons: {
      icon: [
        { url: "/favicon.ico?v=4", sizes: "any" },
        { url: "/favicon.png?v=4", type: "image/png", sizes: "32x32" },
      ],
      shortcut: ["/favicon.ico?v=4"],
      apple: ["/favicon.png?v=4"],
    },
    openGraph: {
      title: settings.name,
      description: settings.openGraphDescription,
      type: "website",
      url: settings.url,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: settings.name,
      description: settings.openGraphDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
