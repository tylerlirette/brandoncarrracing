import { FeatureCards } from "@/components/home/FeatureCards";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { PressArticles } from "@/components/home/PressArticles";
import { RacingHighlights } from "@/components/home/RacingHighlights";
import { RichText } from "@/components/content/RichText";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { mergeHomePageContent } from "@/lib/homePage";
import { client } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";
import type { ReactNode } from "react";

/** Re-fetch homepage from Sanity periodically so published edits show without redeploying. */
export const revalidate = 60;

async function getHomePageContent() {
  try {
    const content = await client.fetch(homePageQuery);
    return mergeHomePageContent(content);
  } catch {
    return mergeHomePageContent(null);
  }
}

export default async function HomePage() {
  const instagramWidgetSrc = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC;
  const content = await getHomePageContent();

  const sections: Record<string, ReactNode> = {
    hero: <HeroCarousel slides={content.heroSlides} />,
    intro: (
      <section id={content.welcomeSectionId} className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
        <h1 className="font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
          {content.welcomeTitle}
        </h1>
        <RichText className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base [&_p+p]:mt-3" value={content.welcomeDescription} />
      </section>
    ),
    featureCards: (
      <section id={content.featureCardsSectionId} className="pb-14 md:pb-20" aria-label="Featured links">
        <FeatureCards cards={content.featureCards} />
      </section>
    ),
    profile: (
      <section id={content.profileSectionId} className="border-y border-zinc-200 bg-zinc-50 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:flex md:items-start md:gap-12">
          <div className="md:w-1/2">
            <h2 className="font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
              {content.profileTitle}
            </h2>
            <RichText className="mt-4 text-sm leading-relaxed text-zinc-600 md:text-base [&_p+p]:mt-3" value={content.profileDescription} />
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-zinc-700 md:mt-0 md:w-1/2">
            {content.careerHighlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    teams: (
      <section id={content.teamsSectionId} className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
          {content.teamsTitle}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {content.teams.map((team) => (
            <div key={team.title} className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold uppercase italic text-brand">{team.title}</h3>
              <RichText className="mt-2 text-sm leading-relaxed text-zinc-600 [&_p+p]:mt-2" value={team.description} />
            </div>
          ))}
        </div>
        <RichText className="mx-auto mt-8 max-w-3xl text-center text-sm text-zinc-600 [&_p+p]:mt-2" value={content.teamsSummary} />
      </section>
    ),
    highlights: (
      <section id={content.highlightsSectionId} className="bg-white py-14 md:py-20">
        <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
          {content.highlightsTitle}
        </h2>
        <RichText className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm text-zinc-600 [&_p+p]:mt-2" value={content.highlightsDescription} />
        <div className="mt-10">
          <RacingHighlights events={content.events} />
        </div>
      </section>
    ),
    news: (
      <section id={content.newsSectionId} className="border-t border-zinc-200 bg-zinc-50 py-14 md:py-20">
        <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
          {content.newsTitle}
        </h2>
        <RichText className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm text-zinc-600 [&_p+p]:mt-2" value={content.newsDescription} />
        <div className="mt-10">
          <PressArticles articles={content.pressArticles} />
        </div>
      </section>
    ),
    partners: (
      <section id={content.partnersSectionId} className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
          {content.partnersTitle}
        </h2>
        <RichText
          className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-zinc-600 md:text-base [&_p+p]:mt-3"
          value={content.partnersDescription}
        />
      </section>
    ),
    instagram: (
      <section id={content.instagramSectionId} className="border-t border-zinc-200 bg-white py-14 md:py-20">
        <InstagramFeed
          widgetIframeSrc={instagramWidgetSrc}
          heading={content.instagramHeading}
          description={content.instagramDescription}
          instagramUrl={content.instagramUrl}
        />
      </section>
    ),
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {content.sectionOrder.map((section) => {
          const sectionNode = sections[section];
          if (!sectionNode) {
            return null;
          }
          return <div key={section}>{sectionNode}</div>;
        })}
      </main>
      <SiteFooter />
    </>
  );
}
