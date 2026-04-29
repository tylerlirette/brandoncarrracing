import {
  INSTAGRAM_URL,
  careerHighlights,
  featureCards,
  heroSlides,
  pressArticles,
  teamCards,
  upcomingEvents,
  type FeatureCard,
  type HeroSlide,
  type PressArticle,
  type RichTextContent,
  type TeamCard,
  type UpcomingEvent,
} from "@/lib/site";

const defaultSectionOrder = ["hero", "intro", "featureCards", "profile", "teams", "highlights", "news", "partners", "instagram"] as const;

function toRichText(value: RichTextContent): RichTextContent {
  if (Array.isArray(value)) {
    return value;
  }

  return [
    {
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", text: value, marks: [] }],
    },
  ];
}

function normalizeHeroSlides(incoming: HeroSlide[] | undefined, defaults: HeroSlide[]): HeroSlide[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((slide, index) => ({
      src: slide.src?.trim() || defaults[index]?.src || "",
      alt: slide.alt?.trim() || defaults[index]?.alt || "",
    }))
    .filter((slide) => Boolean(slide.src && slide.alt));

  return merged.length ? merged : [...defaults];
}

function normalizeFeatureCards(incoming: FeatureCard[] | undefined, defaults: FeatureCard[]): FeatureCard[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((card, index) => ({
      title: card.title?.trim() || defaults[index]?.title || "",
      description: card.description !== undefined && card.description !== null ? toRichText(card.description) : defaults[index]?.description ?? "",
      href: card.href?.trim() || defaults[index]?.href || "#",
      image: card.image?.trim() || defaults[index]?.image || "",
    }))
    .filter((card) => Boolean(card.title && card.image));

  return merged.length ? merged : [...defaults];
}

function normalizeEvents(incoming: UpcomingEvent[] | undefined, defaults: UpcomingEvent[]): UpcomingEvent[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((event, index) => ({
      title: event.title?.trim() || defaults[index]?.title || "",
      subtitle: event.subtitle?.trim() || defaults[index]?.subtitle || "",
      date: event.date?.trim() || defaults[index]?.date || "",
      image: event.image?.trim() || defaults[index]?.image || "",
      note: event.note?.trim() || defaults[index]?.note || "",
    }))
    .filter((event) => Boolean(event.title && event.image));

  return merged.length ? merged : [...defaults];
}

function normalizeTeams(incoming: TeamCard[] | undefined, defaults: TeamCard[]): TeamCard[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((team, index) => ({
      title: team.title?.trim() || defaults[index]?.title || "",
      description:
        team.description !== undefined && team.description !== null
          ? toRichText(team.description)
          : (defaults[index]?.description ?? ""),
    }))
    .filter((team) => Boolean(team.title));

  return merged.length ? merged : [...defaults];
}

function normalizePressArticles(incoming: PressArticle[] | undefined, defaults: PressArticle[]): PressArticle[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((article, index) => ({
      title: article.title?.trim() || defaults[index]?.title || "",
      source: article.source?.trim() || defaults[index]?.source || "",
      date: article.date?.trim() || defaults[index]?.date || "",
      excerpt: article.excerpt?.trim() || defaults[index]?.excerpt || "",
      href: article.href?.trim() || defaults[index]?.href || `#press-${index}`,
    }))
    .filter((article) => Boolean(article.title));

  return merged.length ? merged : [...defaults];
}

function dedupeSectionOrder(order: string[] | undefined): string[] {
  const allowed = new Set<string>([...defaultSectionOrder]);
  if (!order?.length) {
    return [...defaultSectionOrder];
  }

  const seen = new Set<string>();
  const next: string[] = [];

  for (const key of order) {
    if (!allowed.has(key) || seen.has(key)) {
      continue;
    }

    seen.add(key);
    next.push(key);
  }

  return next.length ? next : [...defaultSectionOrder];
}

export type HomePageContent = {
  headerLinks: HeaderLink[];
  heroSlides: HeroSlide[];
  welcomeTitle: string;
  welcomeSectionId: string;
  welcomeDescription: RichTextContent;
  profileTitle: string;
  profileSectionId: string;
  profileDescription: RichTextContent;
  careerHighlights: string[];
  teamsTitle: string;
  teamsSectionId: string;
  teamsSummary: RichTextContent;
  teams: TeamCard[];
  featureCards: FeatureCard[];
  featureCardsSectionId: string;
  highlightsTitle: string;
  highlightsSectionId: string;
  highlightsDescription: RichTextContent;
  events: UpcomingEvent[];
  newsTitle: string;
  newsSectionId: string;
  newsDescription: RichTextContent;
  pressArticles: PressArticle[];
  partnersTitle: string;
  partnersSectionId: string;
  partnersDescription: RichTextContent;
  instagramHeading: string;
  instagramSectionId: string;
  instagramDescription: RichTextContent;
  instagramUrl: string;
  sectionOrder: string[];
};

export type HeaderLink = {
  label?: string;
  icon?: string;
  href: string;
  openInNewTab?: boolean;
};

type HeaderLinkAnchors = {
  welcome: string;
  highlights: string;
  partners: string;
};

function buildDefaultHeaderLinks(anchors: HeaderLinkAnchors, instagramUrl: string): HeaderLink[] {
  return [
    { label: "Home", href: "/" },
    { label: "About", href: `#${anchors.welcome}` },
    { label: "Schedule", href: `#${anchors.highlights}` },
    { label: "Partners", href: `#${anchors.partners}` },
    { icon: "mdi:instagram", href: instagramUrl, openInNewTab: true },
  ];
}

function normalizeHeaderLinks(incoming: HeaderLink[] | undefined, defaults: HeaderLink[]): HeaderLink[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged: HeaderLink[] = [];
  incoming.forEach((link, index) => {
      const fallback = defaults[index];
      const label = link.label?.trim() || fallback?.label || "";
      const icon = link.icon?.trim() || fallback?.icon || "";
      const href = link.href?.trim() || fallback?.href || "";

      if (!href) {
        return;
      }

      if (!label && !icon) {
        return;
      }

      merged.push({
        label: label || undefined,
        icon: icon || undefined,
        href,
        openInNewTab: Boolean(link.openInNewTab ?? fallback?.openInNewTab),
      });
    });

  return merged.length ? merged : [...defaults];
}

export const defaultHomePageContent: HomePageContent = {
  headerLinks: buildDefaultHeaderLinks(
    {
      welcome: "about",
      highlights: "highlights",
      partners: "partners",
    },
    INSTAGRAM_URL
  ),
  heroSlides: [...heroSlides],
  welcomeTitle: "Welcome to Brandon Carr Racing",
  welcomeSectionId: "about",
  welcomeDescription: toRichText(
    "Eighteen-year-old British racer climbing the US ladder — from karting championships to dirt midgets and asphalt late models, with eyes on ARCA and NASCAR national series."
  ),
  profileTitle: "Profile",
  profileSectionId: "profile",
  profileDescription: toRichText(
    "Brandon competes in midgets with Keith Kunz Motorsports and late model stock cars with Setzer Racing & Development. A karting and Kartmasters champion with midget and late model wins, he is focused on ARCA and the NASCAR development ladder — Trucks, Xfinity, and Cup as long-term goals."
  ),
  careerHighlights: [...careerHighlights],
  teamsTitle: "Current teams & 2026 plans",
  teamsSectionId: "teams",
  teamsSummary: toRichText(
    "2026 includes late model stock car races with Setzer Racing, selected ARCA Racing Series events, and continued progression toward the NASCAR national divisions."
  ),
  teams: [...teamCards],
  featureCards: [...featureCards],
  featureCardsSectionId: "feature-cards",
  highlightsTitle: "Racing highlights",
  highlightsSectionId: "highlights",
  highlightsDescription: toRichText("Dates and venues evolve quickly — confirm tickets and schedules with each track and series."),
  events: [...upcomingEvents],
  newsTitle: "In the news",
  newsSectionId: "news",
  newsDescription: toRichText("Recent coverage from IHRA and Speedway Digest."),
  pressArticles: [...pressArticles],
  partnersTitle: "Sponsorship & partnerships",
  partnersSectionId: "partners",
  partnersDescription: toRichText(
    "Brandon partners with brands that want motorsport as a marketing platform — car and suit branding, social promotion, race hospitality, and corporate events. For partnership inquiries, reach out via Instagram or your existing team contact."
  ),
  instagramHeading: "Latest from Instagram",
  instagramSectionId: "instagram",
  instagramDescription: toRichText("Follow @brandon_carr_racing for news, behind-the-scenes, and weekend updates."),
  instagramUrl: INSTAGRAM_URL,
  sectionOrder: [...defaultSectionOrder],
};

/** Default DOM ids for homepage sections — keep in sync with `defaultHomePageContent` *SectionId fields. Site nav uses these until we wire CMS ids into the header. */
export const defaultHomeSectionAnchors = {
  welcome: defaultHomePageContent.welcomeSectionId,
  profile: defaultHomePageContent.profileSectionId,
  featureCards: defaultHomePageContent.featureCardsSectionId,
  teams: defaultHomePageContent.teamsSectionId,
  highlights: defaultHomePageContent.highlightsSectionId,
  news: defaultHomePageContent.newsSectionId,
  partners: defaultHomePageContent.partnersSectionId,
  instagram: defaultHomePageContent.instagramSectionId,
} as const;

export function mergeHomePageContent(content?: Partial<HomePageContent> | null): HomePageContent {
  if (!content) {
    return defaultHomePageContent;
  }

  const resolvedAnchors: HeaderLinkAnchors = {
    welcome: content.welcomeSectionId || defaultHomePageContent.welcomeSectionId,
    highlights: content.highlightsSectionId || defaultHomePageContent.highlightsSectionId,
    partners: content.partnersSectionId || defaultHomePageContent.partnersSectionId,
  };
  const resolvedInstagramUrl = content.instagramUrl || defaultHomePageContent.instagramUrl;

  return {
    ...defaultHomePageContent,
    ...content,
    headerLinks: normalizeHeaderLinks(content.headerLinks, buildDefaultHeaderLinks(resolvedAnchors, resolvedInstagramUrl)),
    heroSlides: normalizeHeroSlides(content.heroSlides, defaultHomePageContent.heroSlides),
    careerHighlights: content.careerHighlights?.length ? content.careerHighlights : defaultHomePageContent.careerHighlights,
    teams: normalizeTeams(content.teams, defaultHomePageContent.teams),
    featureCards: normalizeFeatureCards(content.featureCards, defaultHomePageContent.featureCards),
    events: normalizeEvents(content.events, defaultHomePageContent.events),
    pressArticles: normalizePressArticles(content.pressArticles, defaultHomePageContent.pressArticles),
    sectionOrder: dedupeSectionOrder(content.sectionOrder),
    welcomeDescription: content.welcomeDescription ? toRichText(content.welcomeDescription) : defaultHomePageContent.welcomeDescription,
    profileDescription: content.profileDescription ? toRichText(content.profileDescription) : defaultHomePageContent.profileDescription,
    teamsSummary: content.teamsSummary ? toRichText(content.teamsSummary) : defaultHomePageContent.teamsSummary,
    highlightsDescription: content.highlightsDescription
      ? toRichText(content.highlightsDescription)
      : defaultHomePageContent.highlightsDescription,
    newsDescription: content.newsDescription ? toRichText(content.newsDescription) : defaultHomePageContent.newsDescription,
    partnersDescription: content.partnersDescription ? toRichText(content.partnersDescription) : defaultHomePageContent.partnersDescription,
    instagramDescription: content.instagramDescription
      ? toRichText(content.instagramDescription)
      : defaultHomePageContent.instagramDescription,
    instagramUrl: content.instagramUrl || defaultHomePageContent.instagramUrl,
    welcomeSectionId: content.welcomeSectionId || defaultHomePageContent.welcomeSectionId,
    profileSectionId: content.profileSectionId || defaultHomePageContent.profileSectionId,
    teamsSectionId: content.teamsSectionId || defaultHomePageContent.teamsSectionId,
    featureCardsSectionId: content.featureCardsSectionId || defaultHomePageContent.featureCardsSectionId,
    highlightsSectionId: content.highlightsSectionId || defaultHomePageContent.highlightsSectionId,
    newsSectionId: content.newsSectionId || defaultHomePageContent.newsSectionId,
    partnersSectionId: content.partnersSectionId || defaultHomePageContent.partnersSectionId,
    instagramSectionId: content.instagramSectionId || defaultHomePageContent.instagramSectionId,
  };
}
