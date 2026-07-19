import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Build a Sanity CDN URL from an image source (asset ref / image object). */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Prefer a sized/auto-format Sanity CDN URL when the source is an image object;
 * otherwise return a string URL (optionally with Sanity CDN params when applicable).
 */
export function resolveImageSrc(
  source: SanityImageSource | string | null | undefined,
  width: number,
  quality = 80
): string | undefined {
  if (!source) {
    return undefined;
  }

  if (typeof source === "string") {
    return sizedCdnUrl(source, width, quality);
  }

  try {
    return urlForImage(source).width(width).quality(quality).auto("format").url();
  } catch {
    return undefined;
  }
}

/** Append width/format/quality params to an existing Sanity CDN asset URL. */
export function sizedCdnUrl(src: string, width: number, quality = 80): string {
  if (!src.includes("cdn.sanity.io")) {
    return src;
  }

  try {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", String(quality));
    return url.toString();
  } catch {
    return src;
  }
}
