import Link from "next/link";
import Script from "next/script";
import { RichText } from "@/components/content/RichText";
import { sanitizeHref } from "@/lib/href";
import { sanitizeLightWidgetIframeSrc } from "@/lib/lightwidget";
import type { RichTextContent } from "@/lib/richText";
import { INSTAGRAM_URL } from "@/lib/site";
import { headingStyles, radiusStyles, textStyles } from "@/lib/theme";

type InstagramFeedProps = {
  widgetIframeSrc?: string;
  heading?: string;
  description?: RichTextContent;
  instagramUrl?: string;
};

export function InstagramFeed({
  widgetIframeSrc,
  heading = "Instagram",
  description,
  instagramUrl = INSTAGRAM_URL,
}: InstagramFeedProps) {
  const safeWidgetSrc = sanitizeLightWidgetIframeSrc(widgetIframeSrc);
  const safeInstagramUrl = sanitizeHref(instagramUrl) || INSTAGRAM_URL;

  return (
    <section className="mx-auto max-w-6xl px-4" aria-labelledby="instagram-heading">
      <div className="flex flex-col gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h2 id="instagram-heading" className={headingStyles.page}>
            {heading}
          </h2>
          {description ? (
            <RichText className={`mt-2 ${textStyles.bodyCompact}`} value={description} />
          ) : null}
        </div>
        <Link
          href={safeInstagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center justify-center self-center ${radiusStyles.button} bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-secondary md:self-auto`}
        >
          Open Instagram
        </Link>
      </div>

      {safeWidgetSrc ? (
        <>
          <Script
            src="https://cdn.lightwidget.com/widgets/lightwidget.js"
            strategy="lazyOnload"
          />
          <div className={`mt-8 overflow-hidden ${radiusStyles.card} bg-background shadow ring-1 ring-black/5`}>
            <iframe
              title="Instagram feed"
              src={safeWidgetSrc}
              className="h-[540px] w-full border-0"
              loading="lazy"
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer"
            />
          </div>
        </>
      ) : (
        <p className={`mt-8 ${radiusStyles.card} bg-surface-subtle px-4 py-6 text-center text-sm text-muted`}>
          Add a LightWidget iframe URL in Sanity to embed the feed, or use the button above to open Instagram.
        </p>
      )}
    </section>
  );
}
