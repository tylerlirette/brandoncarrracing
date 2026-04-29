import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/content/RichText";
import type { RichTextContent } from "@/lib/site";
import { INSTAGRAM_URL } from "@/lib/site";

const gridImages = [
  "/images/ig-grid-1.jpg",
  "/images/ig-grid-2.jpg",
  "/images/ig-grid-3.jpg",
  "/images/ig-grid-4.jpg",
  "/images/ig-grid-5.jpg",
  "/images/ig-grid-6.jpg",
] as const;

type InstagramFeedProps = {
  widgetIframeSrc?: string;
  heading?: string;
  description?: RichTextContent;
  instagramUrl?: string;
};

export function InstagramFeed({
  widgetIframeSrc,
  heading = "Latest from Instagram",
  description = "Follow @brandon_carr_racing for news, behind-the-scenes, and weekend updates.",
  instagramUrl = INSTAGRAM_URL,
}: InstagramFeedProps) {
  return (
    <section className="mx-auto max-w-6xl px-4" aria-labelledby="instagram-heading">
      <div className="flex flex-col gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h2
            id="instagram-heading"
            className="font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl"
          >
            {heading}
          </h2>
          <RichText className="mt-2 text-sm text-zinc-600 [&_p+p]:mt-2" value={description} />
        </div>
        <Link
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center self-center rounded-sm bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark md:self-auto"
        >
          Open Instagram
        </Link>
      </div>

      {widgetIframeSrc ? (
        <div className="mt-8 overflow-hidden rounded-sm bg-white shadow ring-1 ring-black/5">
          <iframe
            title="Instagram feed"
            src={widgetIframeSrc}
            className="h-[540px] w-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mt-8">
          <p className="mb-4 rounded-sm bg-zinc-100 px-4 py-3 text-center text-xs text-zinc-600">
            For a live embedded grid, add a widget iframe URL (for example from{" "}
            <a
              href="https://lightwidget.com/"
              className="font-semibold text-brand underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LightWidget
            </a>
            ) to{" "}
            <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] text-zinc-800 ring-1 ring-zinc-200">
              NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC
            </code>{" "}
            in your environment. Until then, tap any photo to open Instagram.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
            {gridImages.map((src, i) => (
              <Link
                key={src}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-sm bg-zinc-200 ring-1 ring-black/5"
              >
                <Image
                  src={src}
                  alt={`Racing photo ${i + 1}`}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width:640px) 50vw, 33vw"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-center text-xs font-bold uppercase tracking-wide text-white opacity-0 transition group-hover:bg-black/45 group-hover:opacity-100">
                  View on Instagram
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
