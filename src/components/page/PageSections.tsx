import { ContentSection } from "@/components/page/ContentSection";
import { Hero } from "@/components/sections/Hero";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { sanitizeLightWidgetIframeSrc } from "@/lib/lightwidget";
import type { PageContent, PageLayout } from "@/lib/page";
import { INSTAGRAM_LIGHTWIDGET_IFRAME_SRC } from "@/lib/site";

/** Applied to non-hero blocks so heroes stay full-bleed on narrow layouts. */
const layoutClasses: Record<PageLayout, string> = {
  default: "",
  narrow: "mx-auto max-w-4xl px-4",
  fullWidth: "",
};

type PageSectionsProps = {
  page: PageContent;
  instagramWidgetSrc?: string;
};

function resolveDefaultWidgetSrc(override?: string): string | undefined {
  return (
    sanitizeLightWidgetIframeSrc(override) ||
    sanitizeLightWidgetIframeSrc(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC) ||
    sanitizeLightWidgetIframeSrc(INSTAGRAM_LIGHTWIDGET_IFRAME_SRC)
  );
}

export function PageSections({ page, instagramWidgetSrc }: PageSectionsProps) {
  const layoutClass = layoutClasses[page.layout];
  const defaultWidgetSrc = resolveDefaultWidgetSrc(instagramWidgetSrc);

  return (
    <>
      {page.sections.map((block) => {
        if (block._type === "heroSection") {
          return <Hero key={block._key} config={block} />;
        }

        if (block._type === "instagramSection") {
          return (
            <div
              key={block._key}
              id={block.sectionId}
              className={`py-14 md:py-20 ${layoutClass}`.trim()}
            >
              <InstagramFeed
                widgetIframeSrc={block.widgetIframeSrc || defaultWidgetSrc}
                heading={block.heading}
                description={block.description}
                instagramUrl={block.instagramUrl}
              />
            </div>
          );
        }

        return (
          <div key={block._key} className={layoutClass || undefined}>
            <ContentSection section={block} />
          </div>
        );
      })}
    </>
  );
}
