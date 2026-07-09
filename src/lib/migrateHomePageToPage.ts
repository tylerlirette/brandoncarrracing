import { heroConfigFromSlides, defaultHeroConfig } from "@/lib/hero";

const LEGACY_SECTION_KEYS: Record<string, string> = {
  highlights: "eventCards",
  teams: "infoCards",
};

const DEFAULT_SECTION_ORDER = [
  "hero",
  "intro",
  "featureCards",
  "profile",
  "infoCards",
  "eventCards",
  "news",
  "partners",
  "instagram",
];

type SanityKeyed = {
  _key?: string;
  _type?: string;
  [key: string]: unknown;
};

export type RawLegacyHomePageDocument = {
  _id?: string;
  _type?: string;
  headerLinks?: SanityKeyed[];
  hero?: SanityKeyed;
  heroSlides?: SanityKeyed[];
  welcomeTitle?: string;
  welcomeSectionId?: string;
  welcomeDescription?: unknown;
  profileTitle?: string;
  profileSectionId?: string;
  profileDescription?: unknown;
  profileBullets?: string[];
  careerHighlights?: string[];
  infoCardsTitle?: string;
  infoCardsSectionId?: string;
  infoCardsSummary?: unknown;
  infoCards?: SanityKeyed[];
  teamsTitle?: string;
  teamsSectionId?: string;
  teamsSummary?: unknown;
  teams?: SanityKeyed[];
  featureCards?: SanityKeyed[];
  featureCardsSectionId?: string;
  eventCardsTitle?: string;
  eventCardsSectionId?: string;
  eventCardsDescription?: unknown;
  eventCards?: SanityKeyed[];
  highlightsTitle?: string;
  highlightsSectionId?: string;
  highlightsDescription?: unknown;
  events?: SanityKeyed[];
  newsTitle?: string;
  newsSectionId?: string;
  newsDescription?: unknown;
  pressArticles?: SanityKeyed[];
  partnersTitle?: string;
  partnersSectionId?: string;
  partnersDescription?: unknown;
  instagramHeading?: string;
  instagramSectionId?: string;
  instagramDescription?: unknown;
  instagramUrl?: string;
  sectionOrder?: string[];
};

export type SanityPageDocument = {
  _id: string;
  _type: "page";
  title: string;
  slug: string;
  layout: "default" | "narrow" | "fullWidth";
  headerLinks?: SanityKeyed[];
  sections: SanityKeyed[];
  seo: {
    title?: string;
    description?: string;
  };
};

function withKey<T extends SanityKeyed>(value: T, key: string): T {
  return { ...value, _key: value._key || key };
}

function mapArrayWithKeys<T extends SanityKeyed>(items: T[] | undefined, prefix: string): T[] | undefined {
  if (!items?.length) {
    return undefined;
  }

  return items.map((item, index) => withKey(item, item._key || `${prefix}-${index}`));
}

function heroFromLegacy(legacy: RawLegacyHomePageDocument): SanityKeyed | undefined {
  if (legacy.hero) {
    const images = mapArrayWithKeys(
      legacy.hero.images as SanityKeyed[] | undefined,
      "hero-image"
    );
    return {
      ...legacy.hero,
      ...(images ? { images } : {}),
    };
  }

  if (!legacy.heroSlides?.length) {
    return undefined;
  }

  const defaults = heroConfigFromSlides(
    legacy.heroSlides.map((slide) => ({
      alt: String(slide.alt || ""),
      src: String(slide.src || ""),
    })),
    defaultHeroConfig
  );

  return {
    displayMode: defaults.displayMode,
    height: defaults.height,
    images: mapArrayWithKeys(legacy.heroSlides, "hero-image"),
    showHeroText: defaults.showHeroText,
    heading: defaults.heading,
    subtext: defaults.subtext,
    cta: defaults.cta,
    textAlign: defaults.textAlign,
    textVerticalAlign: defaults.textVerticalAlign,
    textStyle: defaults.textStyle,
    contentWidth: defaults.contentWidth,
    overlay: defaults.overlay,
    carouselIntervalMs: defaults.carouselIntervalMs,
    showCarouselDots: defaults.showCarouselDots,
  };
}

export function legacyHomePageDocumentToPageDocument(
  legacy: RawLegacyHomePageDocument,
  options?: { pageId?: string; title?: string }
): SanityPageDocument {
  const order = legacy.sectionOrder?.length
    ? legacy.sectionOrder.map((key) => LEGACY_SECTION_KEYS[key] ?? key)
    : DEFAULT_SECTION_ORDER;

  const profileBullets = legacy.profileBullets ?? legacy.careerHighlights;
  const infoCards = legacy.infoCards ?? legacy.teams;
  const infoCardsTitle = legacy.infoCardsTitle ?? legacy.teamsTitle;
  const infoCardsSectionId = legacy.infoCardsSectionId ?? legacy.teamsSectionId;
  const infoCardsSummary = legacy.infoCardsSummary ?? legacy.teamsSummary;
  const eventCards = legacy.eventCards ?? legacy.events;
  const eventCardsTitle = legacy.eventCardsTitle ?? legacy.highlightsTitle;
  const eventCardsSectionId = legacy.eventCardsSectionId ?? legacy.highlightsSectionId;
  const eventCardsDescription = legacy.eventCardsDescription ?? legacy.highlightsDescription;

  const hero = heroFromLegacy(legacy);

  const sectionBuilders: Record<string, SanityKeyed | undefined> = {
    hero: hero ? withKey({ _type: "heroSection", ...hero }, "hero") : undefined,
    intro: withKey(
      {
        _type: "introSection",
        sectionId: legacy.welcomeSectionId,
        title: legacy.welcomeTitle,
        description: legacy.welcomeDescription,
      },
      "intro"
    ),
    featureCards: withKey(
      {
        _type: "featureCardsSection",
        sectionId: legacy.featureCardsSectionId,
        cards: mapArrayWithKeys(legacy.featureCards, "feature-card"),
      },
      "featureCards"
    ),
    profile: withKey(
      {
        _type: "profileSection",
        sectionId: legacy.profileSectionId,
        title: legacy.profileTitle,
        description: legacy.profileDescription,
        bullets: profileBullets,
      },
      "profile"
    ),
    infoCards: withKey(
      {
        _type: "infoCardsSection",
        sectionId: infoCardsSectionId,
        title: infoCardsTitle,
        summary: infoCardsSummary,
        cards: mapArrayWithKeys(infoCards, "info-card"),
      },
      "infoCards"
    ),
    eventCards: withKey(
      {
        _type: "eventCardsSection",
        sectionId: eventCardsSectionId,
        title: eventCardsTitle,
        description: eventCardsDescription,
        events: mapArrayWithKeys(eventCards, "event-card"),
      },
      "eventCards"
    ),
    news: withKey(
      {
        _type: "newsSection",
        sectionId: legacy.newsSectionId,
        title: legacy.newsTitle,
        description: legacy.newsDescription,
        articles: mapArrayWithKeys(legacy.pressArticles, "press-article"),
      },
      "news"
    ),
    partners: withKey(
      {
        _type: "partnersSection",
        sectionId: legacy.partnersSectionId,
        title: legacy.partnersTitle,
        description: legacy.partnersDescription,
      },
      "partners"
    ),
    instagram: withKey(
      {
        _type: "instagramSection",
        sectionId: legacy.instagramSectionId,
        heading: legacy.instagramHeading,
        description: legacy.instagramDescription,
        instagramUrl: legacy.instagramUrl,
      },
      "instagram"
    ),
  };

  const sections = order
    .map((key) => sectionBuilders[LEGACY_SECTION_KEYS[key] ?? key] ?? sectionBuilders[key])
    .filter((section): section is SanityKeyed => Boolean(section));

  return {
    _id: options?.pageId || "page-home",
    _type: "page",
    title: options?.title || legacy.welcomeTitle?.trim() || "Home",
    slug: "/",
    layout: "default",
    headerLinks: mapArrayWithKeys(legacy.headerLinks, "header-link"),
    sections,
    seo: {},
  };
}
