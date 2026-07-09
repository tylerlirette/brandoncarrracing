import { FeatureCards } from "@/components/home/FeatureCards";
import { Hero } from "@/components/home/Hero";
import { EventCards } from "@/components/home/EventCards";
import { InfoCards } from "@/components/home/InfoCards";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { PressArticles } from "@/components/home/PressArticles";
import { RichText } from "@/components/content/RichText";
import type { PageContent, PageLayout, PageSection } from "@/lib/page";
import { INSTAGRAM_LIGHTWIDGET_IFRAME_SRC } from "@/lib/site";
import { headingStyles, surfaceStyles, textStyles } from "@/lib/theme";
import type { ReactNode } from "react";

const layoutClasses: Record<PageLayout, string> = {
  default: "",
  narrow: "mx-auto max-w-4xl px-4",
  fullWidth: "",
};

function renderSection(section: PageSection, instagramWidgetSrc: string): ReactNode {
  switch (section._type) {
    case "heroSection":
      return <Hero key={section._key} config={section} />;
    case "introSection":
      return (
        <section key={section._key} id={section.sectionId} className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <h1 className={headingStyles.page}>{section.title}</h1>
          <RichText className={`mx-auto mt-4 max-w-2xl ${textStyles.body} [&_p+p]:mt-3`} value={section.description} />
        </section>
      );
    case "featureCardsSection":
      return (
        <section key={section._key} id={section.sectionId} className="pb-14 md:pb-20" aria-label="Featured links">
          <FeatureCards cards={section.cards} />
        </section>
      );
    case "profileSection":
      return (
        <section key={section._key} id={section.sectionId} className={surfaceStyles.pageSection}>
          <div className="mx-auto max-w-6xl px-4 md:flex md:items-start md:gap-12">
            <div className="md:w-1/2">
              <h2 className={headingStyles.page}>{section.title}</h2>
              <RichText className={`mt-4 ${textStyles.body} [&_p+p]:mt-3`} value={section.description} />
            </div>
            <ul className={`mt-8 grid gap-3 ${textStyles.list} md:mt-0 md:w-1/2`}>
              {section.bullets.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case "infoCardsSection":
      return (
        <section key={section._key} id={section.sectionId} className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className={`text-center ${headingStyles.page}`}>{section.title}</h2>
          <InfoCards items={section.cards} />
          <RichText className={`mx-auto mt-8 max-w-3xl text-center ${textStyles.bodyCompact}`} value={section.summary} />
        </section>
      );
    case "eventCardsSection":
      return (
        <section key={section._key} id={section.sectionId} className="bg-background py-14 md:py-20">
          <h2 className={`text-center ${headingStyles.page}`}>{section.title}</h2>
          <RichText className={`mx-auto mt-3 max-w-2xl px-4 text-center ${textStyles.bodyCompact}`} value={section.description} />
          <div className="mt-10">
            <EventCards items={section.events} />
          </div>
        </section>
      );
    case "newsSection":
      return (
        <section key={section._key} id={section.sectionId} className={surfaceStyles.borderedSection}>
          <h2 className={`text-center ${headingStyles.page}`}>{section.title}</h2>
          <RichText className={`mx-auto mt-3 max-w-2xl px-4 text-center ${textStyles.bodyCompact}`} value={section.description} />
          <div className="mt-10">
            <PressArticles articles={section.articles} />
          </div>
        </section>
      );
    case "partnersSection":
      return (
        <section key={section._key} id={section.sectionId} className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className={`text-center ${headingStyles.page}`}>{section.title}</h2>
          <RichText
            className={`mx-auto mt-4 max-w-3xl text-center ${textStyles.body} [&_p+p]:mt-3`}
            value={section.description}
          />
        </section>
      );
    case "instagramSection":
      return (
        <section key={section._key} id={section.sectionId} className="border-t border-border bg-background py-14 md:py-20">
          <InstagramFeed
            widgetIframeSrc={instagramWidgetSrc}
            heading={section.heading}
            description={section.description}
            instagramUrl={section.instagramUrl}
          />
        </section>
      );
    default:
      return null;
  }
}

type PageSectionsProps = {
  page: PageContent;
  instagramWidgetSrc?: string;
};

export function PageSections({
  page,
  instagramWidgetSrc = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC ?? INSTAGRAM_LIGHTWIDGET_IFRAME_SRC,
}: PageSectionsProps) {
  const layoutClass = layoutClasses[page.layout];

  return (
    <div className={layoutClass}>
      {page.sections.map((section) => renderSection(section, instagramWidgetSrc))}
    </div>
  );
}
