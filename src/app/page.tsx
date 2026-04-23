import { FeatureCards } from "@/components/home/FeatureCards";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { PressArticles } from "@/components/home/PressArticles";
import { RacingHighlights } from "@/components/home/RacingHighlights";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { careerHighlights, INSTAGRAM_URL } from "@/lib/site";
import Link from "next/link";

export default function HomePage() {
  const instagramWidgetSrc = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroCarousel />

        <section className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <h1 className="font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
            Welcome to Brandon Carr Racing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base">
            Eighteen-year-old British racer climbing the US ladder — from karting championships to dirt midgets and asphalt
            late models, with eyes on ARCA and NASCAR national series.
          </p>
        </section>

        <section className="pb-14 md:pb-20" aria-label="Featured links">
          <FeatureCards />
        </section>

        <section id="profile" className="border-y border-zinc-200 bg-zinc-50 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:flex md:items-start md:gap-12">
            <div className="md:w-1/2">
              <h2 className="font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
                Profile
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 md:text-base">
                Brandon competes in midgets with{" "}
                <strong className="font-semibold text-zinc-800">Keith Kunz Motorsports</strong> and late model stock cars
                with <strong className="font-semibold text-zinc-800">Setzer Racing &amp; Development</strong>. A karting
                and Kartmasters champion with midget and late model wins, he is focused on ARCA and the NASCAR development
                ladder — Trucks, Xfinity, and Cup as long-term goals.
              </p>
            </div>
            <ul className="mt-8 grid gap-3 text-sm text-zinc-700 md:mt-0 md:w-1/2">
              {careerHighlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="teams" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
            Current teams &amp; 2026 plans
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold uppercase italic text-brand">Keith Kunz Motorsports</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">National midget competition — A-Mains and feature events across the US.</p>
            </div>
            <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold uppercase italic text-brand">Setzer Racing &amp; Development</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Late model stock car races on Southeast short tracks, including the IHRA Stock Car Series.
              </p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-zinc-600">
            2026 includes late model stock car races with Setzer Racing, selected ARCA Racing Series events, and continued
            progression toward the NASCAR national divisions.
          </p>
        </section>

        <section id="highlights" className="bg-white py-14 md:py-20">
          <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
            Racing highlights
          </h2>
          <p className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm text-zinc-600">
            Dates and venues evolve quickly — confirm tickets and schedules with each track and series.
          </p>
          <div className="mt-10">
            <RacingHighlights />
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50 py-14 md:py-20">
          <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
            In the news
          </h2>
          <p className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm text-zinc-600">
            Recent coverage from IHRA and Speedway Digest.
          </p>
          <div className="mt-10">
            <PressArticles />
          </div>
        </section>

        <section id="partners" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-center font-heading text-3xl font-bold uppercase italic tracking-tight text-zinc-900 md:text-4xl">
            Sponsorship &amp; partnerships
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-zinc-600 md:text-base">
            Brandon partners with brands that want motorsport as a marketing platform — car and suit branding, social
            promotion, race hospitality, and corporate events. For partnership inquiries, reach out via{" "}
            <Link href={INSTAGRAM_URL} className="font-semibold text-brand underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
              Instagram
            </Link>{" "}
            or your existing team contact.
          </p>
        </section>

        <section className="border-t border-zinc-200 bg-white py-14 md:py-20">
          <InstagramFeed widgetIframeSrc={instagramWidgetSrc} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
