import { PageSections } from "@/components/page/PageSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  convertLegacyHomePage,
  mergePageContent,
  slugFromPathSegments,
  staticParamsFromSlug,
  type RawLegacyHomePageContent,
} from "@/lib/page";
import { siteConfig } from "@/lib/siteConfig";
import { client } from "@/sanity/lib/client";
import { allPageSlugsQuery, legacyHomePageQuery, pageBySlugQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/** Re-fetch pages from Sanity periodically so published edits show without redeploying. */
export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

async function getPageBySlug(slug: string) {
  try {
    const page = await client.fetch(pageBySlugQuery, { slug });
    if (page) {
      return mergePageContent(page);
    }

    if (slug === "/") {
      const legacy = await client.fetch<RawLegacyHomePageContent | null>(legacyHomePageQuery);
      if (legacy) {
        return mergePageContent(convertLegacyHomePage(legacy));
      }
    }

    return null;
  } catch {
    if (slug === "/") {
      return mergePageContent(null);
    }
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const pages = await client.fetch<{ slug: string }[]>(allPageSlugsQuery);
    const params = pages.map((page) => staticParamsFromSlug(page.slug));
    const hasHome = pages.some((page) => page.slug === "/");
    return hasHome ? params : [{}, ...params];
  } catch {
    return [{}];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = slugFromPathSegments(segments);
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Page not found" };
  }

  const title = page.seo.title?.trim() || page.title || siteConfig.name;
  const description = page.seo.description?.trim() || siteConfig.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug: segments } = await params;
  const slug = slugFromPathSegments(segments);
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <SiteHeader links={page.headerLinks} />
      <main className="flex-1">
        <PageSections page={page} />
      </main>
      <SiteFooter />
    </>
  );
}
