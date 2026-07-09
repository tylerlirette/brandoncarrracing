import {
  defaultHeroConfig,
  heroConfigFromSlides,
  normalizeHeroConfig,
  type HeroConfig,
  type HeroImage,
} from "@/lib/hero";
import {
  INSTAGRAM_URL,
  defaultEventCards,
  defaultInfoCards,
  defaultProfileBullets,
  featureCards,
  pressArticles,
  type EventCard,
  type FeatureCard,
  type InfoCard,
  type PressArticle,
  type RichTextContent,
} from "@/lib/site";

export type PageLayout = "default" | "narrow" | "fullWidth";

export type HeaderLink = {
  label?: string;
  icon?: string;
  href: string;
  openInNewTab?: boolean;
};

export type HeroSection = HeroConfig & {
  _type: "heroSection";
  _key: string;
};

export type IntroSection = {
  _type: "introSection";
  _key: string;
  sectionId: string;
  title: string;
  description: RichTextContent;
};

export type FeatureCardsSection = {
  _type: "featureCardsSection";
  _key: string;
  sectionId: string;
  cards: FeatureCard[];
};

export type ProfileSection = {
  _type: "profileSection";
  _key: string;
  sectionId: string;
  title: string;
  description: RichTextContent;
  bullets: string[];
};

export type InfoCardsSection = {
  _type: "infoCardsSection";
  _key: string;
  sectionId: string;
  title: string;
  summary: RichTextContent;
  cards: InfoCard[];
};

export type EventCardsSection = {
  _type: "eventCardsSection";
  _key: string;
  sectionId: string;
  title: string;
  description: RichTextContent;
  events: EventCard[];
};

export type NewsSection = {
  _type: "newsSection";
  _key: string;
  sectionId: string;
  title: string;
  description: RichTextContent;
  articles: PressArticle[];
};

export type PartnersSection = {
  _type: "partnersSection";
  _key: string;
  sectionId: string;
  title: string;
  description: RichTextContent;
};

export type InstagramSection = {
  _type: "instagramSection";
  _key: string;
  sectionId: string;
  heading: string;
  description: RichTextContent;
  instagramUrl: string;
};

export type PageSection =
  | HeroSection
  | IntroSection
  | FeatureCardsSection
  | ProfileSection
  | InfoCardsSection
  | EventCardsSection
  | NewsSection
  | PartnersSection
  | InstagramSection;

export type PageSeo = {
  title?: string;
  description?: string;
};

export type PageContent = {
  title: string;
  slug: string;
  layout: PageLayout;
  headerLinks: HeaderLink[];
  sections: PageSection[];
  seo: PageSeo;
};

const LEGACY_SECTION_KEYS: Record<string, string> = {
  highlights: "eventCards",
  teams: "infoCards",
};

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

function normalizeSlug(value: string | undefined): string {
  if (!value?.trim() || value.trim() === "/") {
    return "/";
  }
  return value.trim().replace(/^\/+|\/+$/g, "");
}

function sectionKey(index: number, value?: string): string {
  return value?.trim() || `section-${index}`;
}

function normalizeHero(
  hero: Partial<HeroConfig> | undefined,
  legacySlides: HeroImage[] | undefined,
  defaults: HeroConfig
): HeroConfig {
  if (hero) {
    return normalizeHeroConfig(hero, defaults);
  }

  if (legacySlides?.length) {
    return heroConfigFromSlides(legacySlides, defaults);
  }

  return normalizeHeroConfig(undefined, defaults);
}

function normalizeFeatureCards(incoming: FeatureCard[] | undefined, defaults: FeatureCard[]): FeatureCard[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((card, index) => ({
      title: card.title?.trim() || defaults[index]?.title || "",
      description:
        card.description !== undefined && card.description !== null
          ? toRichText(card.description)
          : (defaults[index]?.description ?? ""),
      href: card.href?.trim() || defaults[index]?.href || "#",
      image: card.image?.trim() || defaults[index]?.image || "",
    }))
    .filter((card) => Boolean(card.title && card.image));

  return merged.length ? merged : [...defaults];
}

function normalizeEventCards(incoming: EventCard[] | undefined, defaults: EventCard[]): EventCard[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((item, index) => ({
      title: item.title?.trim() || defaults[index]?.title || "",
      subtitle: item.subtitle?.trim() || defaults[index]?.subtitle || "",
      date: item.date?.trim() || defaults[index]?.date || "",
      image: item.image?.trim() || defaults[index]?.image || "",
      note: item.note?.trim() || defaults[index]?.note || "",
    }))
    .filter((item) => Boolean(item.title && item.image));

  return merged.length ? merged : [...defaults];
}

function normalizeInfoCards(incoming: InfoCard[] | undefined, defaults: InfoCard[]): InfoCard[] {
  if (!incoming?.length) {
    return [...defaults];
  }

  const merged = incoming
    .map((item, index) => ({
      title: item.title?.trim() || defaults[index]?.title || "",
      description:
        item.description !== undefined && item.description !== null
          ? toRichText(item.description)
          : (defaults[index]?.description ?? ""),
    }))
    .filter((item) => Boolean(item.title));

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

type HeaderLinkAnchors = {
  welcome: string;
  eventCards: string;
  partners: string;
};

function buildDefaultHeaderLinks(anchors: HeaderLinkAnchors, instagramUrl: string): HeaderLink[] {
  return [
    { label: "Home", href: "/" },
    { label: "About", href: `#${anchors.welcome}` },
    { label: "Schedule", href: `#${anchors.eventCards}` },
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

const defaultIntro: Omit<IntroSection, "_key"> = {
  _type: "introSection",
  sectionId: "about",
  title: "Welcome to Brandon Carr Racing",
  description: toRichText(
    "Eighteen-year-old British racer climbing the US ladder — from karting championships to dirt midgets and asphalt late models, with eyes on ARCA and NASCAR national series."
  ),
};

const defaultProfile: Omit<ProfileSection, "_key"> = {
  _type: "profileSection",
  sectionId: "profile",
  title: "Profile",
  description: toRichText(
    "Brandon competes in midgets with Keith Kunz Motorsports and late model stock cars with Setzer Racing & Development. A karting and Kartmasters champion with midget and late model wins, he is focused on ARCA and the NASCAR development ladder — Trucks, Xfinity, and Cup as long-term goals."
  ),
  bullets: [...defaultProfileBullets],
};

const defaultInfoCardsSection: Omit<InfoCardsSection, "_key"> = {
  _type: "infoCardsSection",
  sectionId: "teams",
  title: "Current teams & 2026 plans",
  summary: toRichText(
    "2026 includes late model stock car races with Setzer Racing, selected ARCA Racing Series events, and continued progression toward the NASCAR national divisions."
  ),
  cards: [...defaultInfoCards],
};

const defaultPartnersSection: Omit<PartnersSection, "_key"> = {
  _type: "partnersSection",
  sectionId: "partners",
  title: "Sponsorship & partnerships",
  description: toRichText(
    "Brandon partners with brands that want motorsport as a marketing platform — car and suit branding, social promotion, race hospitality, and corporate events. For partnership inquiries, reach out via Instagram or your existing team contact."
  ),
};

export const defaultPageContent: PageContent = {
  title: "Home",
  slug: "/",
  layout: "default",
  headerLinks: buildDefaultHeaderLinks(
    {
      welcome: defaultIntro.sectionId,
      eventCards: "highlights",
      partners: defaultPartnersSection.sectionId,
    },
    INSTAGRAM_URL
  ),
  seo: {},
  sections: [
    { _key: "hero", ...normalizeHero(undefined, undefined, defaultHeroConfig), _type: "heroSection" },
    { _key: "intro", ...defaultIntro },
    {
      _key: "featureCards",
      _type: "featureCardsSection",
      sectionId: "feature-cards",
      cards: [...featureCards],
    },
    { _key: "profile", ...defaultProfile },
    { _key: "infoCards", ...defaultInfoCardsSection },
    {
      _key: "eventCards",
      _type: "eventCardsSection",
      sectionId: "highlights",
      title: "Racing highlights",
      description: toRichText("Dates and venues evolve quickly — confirm tickets and schedules with each track and series."),
      events: [...defaultEventCards],
    },
    {
      _key: "news",
      _type: "newsSection",
      sectionId: "news",
      title: "In the news",
      description: toRichText("Recent coverage from IHRA and Speedway Digest."),
      articles: [...pressArticles],
    },
    { _key: "partners", ...defaultPartnersSection },
    {
      _key: "instagram",
      _type: "instagramSection",
      sectionId: "instagram",
      heading: "Latest from Instagram",
      description: toRichText("Follow @brandon_carr_racing for news, behind-the-scenes, and weekend updates."),
      instagramUrl: INSTAGRAM_URL,
    },
  ],
};

type RawPageSection = {
  _type?: string;
  _key?: string;
  [key: string]: unknown;
};

type RawPageContent = {
  title?: string;
  slug?: string;
  layout?: PageLayout;
  headerLinks?: HeaderLink[];
  sections?: RawPageSection[];
  seo?: PageSeo;
};

/** Legacy flat homePage document shape. */
export type RawLegacyHomePageContent = {
  headerLinks?: HeaderLink[];
  hero?: Partial<HeroConfig>;
  heroSlides?: HeroImage[];
  welcomeTitle?: string;
  welcomeSectionId?: string;
  welcomeDescription?: RichTextContent;
  profileTitle?: string;
  profileSectionId?: string;
  profileDescription?: RichTextContent;
  profileBullets?: string[];
  careerHighlights?: string[];
  infoCardsTitle?: string;
  infoCardsSectionId?: string;
  infoCardsSummary?: RichTextContent;
  infoCards?: InfoCard[];
  teamsTitle?: string;
  teamsSectionId?: string;
  teamsSummary?: RichTextContent;
  teams?: InfoCard[];
  featureCards?: FeatureCard[];
  featureCardsSectionId?: string;
  eventCardsTitle?: string;
  eventCardsSectionId?: string;
  eventCardsDescription?: RichTextContent;
  eventCards?: EventCard[];
  highlightsTitle?: string;
  highlightsSectionId?: string;
  highlightsDescription?: RichTextContent;
  events?: EventCard[];
  newsTitle?: string;
  newsSectionId?: string;
  newsDescription?: RichTextContent;
  pressArticles?: PressArticle[];
  partnersTitle?: string;
  partnersSectionId?: string;
  partnersDescription?: RichTextContent;
  instagramHeading?: string;
  instagramSectionId?: string;
  instagramDescription?: RichTextContent;
  instagramUrl?: string;
  sectionOrder?: string[];
};

function normalizeSection(section: RawPageSection, index: number): PageSection | null {
  const key = sectionKey(index, section._key);
  const type = section._type;

  switch (type) {
    case "heroSection":
      return {
        _type: "heroSection",
        _key: key,
        ...normalizeHero(section as Partial<HeroConfig>, undefined, defaultHeroConfig),
      };
    case "introSection":
      return {
        _type: "introSection",
        _key: key,
        sectionId: String(section.sectionId || defaultIntro.sectionId),
        title: String(section.title || defaultIntro.title),
        description: section.description ? toRichText(section.description as RichTextContent) : defaultIntro.description,
      };
    case "featureCardsSection":
      return {
        _type: "featureCardsSection",
        _key: key,
        sectionId: String(section.sectionId || "feature-cards"),
        cards: normalizeFeatureCards(section.cards as FeatureCard[] | undefined, featureCards),
      };
    case "profileSection":
      return {
        _type: "profileSection",
        _key: key,
        sectionId: String(section.sectionId || defaultProfile.sectionId),
        title: String(section.title || defaultProfile.title),
        description: section.description
          ? toRichText(section.description as RichTextContent)
          : defaultProfile.description,
        bullets: Array.isArray(section.bullets) && section.bullets.length ? (section.bullets as string[]) : defaultProfile.bullets,
      };
    case "infoCardsSection":
      return {
        _type: "infoCardsSection",
        _key: key,
        sectionId: String(section.sectionId || defaultInfoCardsSection.sectionId),
        title: String(section.title || defaultInfoCardsSection.title),
        summary: section.summary ? toRichText(section.summary as RichTextContent) : defaultInfoCardsSection.summary,
        cards: normalizeInfoCards(section.cards as InfoCard[] | undefined, defaultInfoCards),
      };
    case "eventCardsSection":
      return {
        _type: "eventCardsSection",
        _key: key,
        sectionId: String(section.sectionId || "highlights"),
        title: String(section.title || "Racing highlights"),
        description: section.description
          ? toRichText(section.description as RichTextContent)
          : toRichText("Dates and venues evolve quickly — confirm tickets and schedules with each track and series."),
        events: normalizeEventCards(section.events as EventCard[] | undefined, defaultEventCards),
      };
    case "newsSection":
      return {
        _type: "newsSection",
        _key: key,
        sectionId: String(section.sectionId || "news"),
        title: String(section.title || "In the news"),
        description: section.description
          ? toRichText(section.description as RichTextContent)
          : toRichText("Recent coverage from IHRA and Speedway Digest."),
        articles: normalizePressArticles(section.articles as PressArticle[] | undefined, pressArticles),
      };
    case "partnersSection":
      return {
        _type: "partnersSection",
        _key: key,
        sectionId: String(section.sectionId || defaultPartnersSection.sectionId),
        title: String(section.title || defaultPartnersSection.title),
        description: section.description
          ? toRichText(section.description as RichTextContent)
          : defaultPartnersSection.description,
      };
    case "instagramSection":
      return {
        _type: "instagramSection",
        _key: key,
        sectionId: String(section.sectionId || "instagram"),
        heading: String(section.heading || "Latest from Instagram"),
        description: section.description
          ? toRichText(section.description as RichTextContent)
          : toRichText("Follow @brandon_carr_racing for news, behind-the-scenes, and weekend updates."),
        instagramUrl: String(section.instagramUrl || INSTAGRAM_URL),
      };
    default:
      return null;
  }
}

function legacyHomePageToSections(content: RawLegacyHomePageContent): RawPageSection[] {
  const order = content.sectionOrder?.length
    ? content.sectionOrder.map((key) => LEGACY_SECTION_KEYS[key] ?? key)
    : ["hero", "intro", "featureCards", "profile", "infoCards", "eventCards", "news", "partners", "instagram"];

  const profileBullets = content.profileBullets ?? content.careerHighlights;
  const infoCards = content.infoCards ?? content.teams;
  const infoCardsTitle = content.infoCardsTitle ?? content.teamsTitle;
  const infoCardsSectionId = content.infoCardsSectionId ?? content.teamsSectionId;
  const infoCardsSummary = content.infoCardsSummary ?? content.teamsSummary;
  const eventCards = content.eventCards ?? content.events;
  const eventCardsTitle = content.eventCardsTitle ?? content.highlightsTitle;
  const eventCardsSectionId = content.eventCardsSectionId ?? content.highlightsSectionId;
  const eventCardsDescription = content.eventCardsDescription ?? content.highlightsDescription;

  const sectionBuilders: Record<string, RawPageSection | undefined> = {
    hero: {
      _type: "heroSection",
      _key: "hero",
      ...(content.hero ||
        (content.heroSlides?.length ? heroConfigFromSlides(content.heroSlides, defaultHeroConfig) : {})),
    },
    intro: {
      _type: "introSection",
      _key: "intro",
      sectionId: content.welcomeSectionId,
      title: content.welcomeTitle,
      description: content.welcomeDescription,
    },
    featureCards: {
      _type: "featureCardsSection",
      _key: "featureCards",
      sectionId: content.featureCardsSectionId,
      cards: content.featureCards,
    },
    profile: {
      _type: "profileSection",
      _key: "profile",
      sectionId: content.profileSectionId,
      title: content.profileTitle,
      description: content.profileDescription,
      bullets: profileBullets,
    },
    infoCards: {
      _type: "infoCardsSection",
      _key: "infoCards",
      sectionId: infoCardsSectionId,
      title: infoCardsTitle,
      summary: infoCardsSummary,
      cards: infoCards,
    },
    eventCards: {
      _type: "eventCardsSection",
      _key: "eventCards",
      sectionId: eventCardsSectionId,
      title: eventCardsTitle,
      description: eventCardsDescription,
      events: eventCards,
    },
    news: {
      _type: "newsSection",
      _key: "news",
      sectionId: content.newsSectionId,
      title: content.newsTitle,
      description: content.newsDescription,
      articles: content.pressArticles,
    },
    partners: {
      _type: "partnersSection",
      _key: "partners",
      sectionId: content.partnersSectionId,
      title: content.partnersTitle,
      description: content.partnersDescription,
    },
    instagram: {
      _type: "instagramSection",
      _key: "instagram",
      sectionId: content.instagramSectionId,
      heading: content.instagramHeading,
      description: content.instagramDescription,
      instagramUrl: content.instagramUrl,
    },
  };

  return order
    .map((key) => sectionBuilders[LEGACY_SECTION_KEYS[key] ?? key] ?? sectionBuilders[key])
    .filter((section): section is RawPageSection => Boolean(section));
}

export function convertLegacyHomePage(content: RawLegacyHomePageContent): RawPageContent {
  return {
    title: "Home",
    slug: "/",
    layout: "default",
    headerLinks: content.headerLinks,
    sections: legacyHomePageToSections(content),
    seo: {},
  };
}

export function mergePageContent(content?: RawPageContent | null): PageContent {
  if (!content?.sections?.length) {
    return defaultPageContent;
  }

  const slug = normalizeSlug(content.slug);
  const defaults = defaultPageContent;
  const introSection = defaults.sections.find((section) => section._type === "introSection") as IntroSection;
  const eventSection = defaults.sections.find((section) => section._type === "eventCardsSection") as EventCardsSection;
  const partnersSection = defaults.sections.find((section) => section._type === "partnersSection") as PartnersSection;
  const instagramSection = defaults.sections.find((section) => section._type === "instagramSection") as InstagramSection;

  const resolvedAnchors: HeaderLinkAnchors = {
    welcome:
      (content.sections.find((section) => section._type === "introSection")?.sectionId as string | undefined) ||
      introSection.sectionId,
    eventCards:
      (content.sections.find((section) => section._type === "eventCardsSection")?.sectionId as string | undefined) ||
      eventSection.sectionId,
    partners:
      (content.sections.find((section) => section._type === "partnersSection")?.sectionId as string | undefined) ||
      partnersSection.sectionId,
  };
  const resolvedInstagramUrl =
    (content.sections.find((section) => section._type === "instagramSection")?.instagramUrl as string | undefined) ||
    instagramSection.instagramUrl;

  const sections = content.sections
    .map((section, index) => normalizeSection(section, index))
    .filter((section): section is PageSection => Boolean(section));

  return {
    title: content.title?.trim() || defaults.title,
    slug,
    layout: content.layout || "default",
    headerLinks: normalizeHeaderLinks(
      content.headerLinks,
      buildDefaultHeaderLinks(resolvedAnchors, resolvedInstagramUrl)
    ),
    sections: sections.length ? sections : defaults.sections,
    seo: content.seo || {},
  };
}

export function slugFromPathSegments(segments: string[] | undefined): string {
  if (!segments?.length) {
    return "/";
  }
  return segments.join("/");
}

export function pathFromSlug(slug: string): string {
  return slug === "/" ? "/" : `/${slug}`;
}

export function staticParamsFromSlug(slug: string): { slug?: string[] } {
  if (slug === "/") {
    return {};
  }
  return { slug: slug.split("/") };
}
