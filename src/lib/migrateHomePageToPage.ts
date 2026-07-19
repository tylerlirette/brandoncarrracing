import { heroConfigFromSlides, defaultHeroConfig } from "@/lib/hero";

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
  sections: SanityKeyed[];
  seo: {
    title?: string;
    description?: string;
  };
};

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

function withKey<T extends SanityKeyed>(value: T, key: string): T {
  return { ...value, _key: value._key || key };
}

function mapArrayWithKeys<T extends SanityKeyed>(items: T[] | undefined, prefix: string): T[] | undefined {
  if (!items?.length) {
    return undefined;
  }

  return items.map((item, index) => withKey(item, item._key || `${prefix}-${index}`));
}

function emptySectionShell(sectionId: string, extras: SanityKeyed = {}): SanityKeyed {
  return {
    _type: "contentSection",
    sectionId,
    textAlign: "center",
    theme: "light",
    spacing: "default",
    border: { position: "none", width: "thin" },
    overlay: { type: "none" },
    ...extras,
  };
}

function richTextColumn(key: string, text: unknown): SanityKeyed {
  return {
    _key: key,
    verticalAlign: "top",
    component: [
      {
        _type: "columnRichText",
        _key: `${key}-component`,
        text,
      },
    ],
  };
}

function cardColumn(key: string, card: SanityKeyed, cardType: string, style: string): SanityKeyed {
  return {
    _key: key,
    verticalAlign: "top",
    component: [
      {
        _type: "columnCard",
        _key: `${key}-component`,
        cardType,
        style,
        clickMode: card.href ? "card" : "none",
        shadow: "medium",
        alignment: "left",
        aspectRatio: "landscape",
        textSize: "medium",
        ...card,
      },
    ],
  };
}

function layout(
  key: string,
  variant: "singleColumn" | "twoColumn" | "threeColumn",
  columns: SanityKeyed[]
): SanityKeyed {
  return {
    _type: "columnLayout",
    _key: key,
    variant,
    gridColumns: 4,
    gridRows: 1,
    columns,
  };
}

function heroFromLegacy(legacy: RawLegacyHomePageDocument): SanityKeyed | undefined {
  if (legacy.hero) {
    const images = mapArrayWithKeys(legacy.hero.images as SanityKeyed[] | undefined, "hero-image");
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

/**
 * Converts a flat legacy homePage document into the reusable page model:
 * heroSection | contentSection (column layouts) | instagramSection.
 */
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
      emptySectionShell(legacy.welcomeSectionId || "about", {
        heading: legacy.welcomeTitle,
        layouts: legacy.welcomeDescription
          ? [layout("intro-layout", "singleColumn", [richTextColumn("intro-col", legacy.welcomeDescription)])]
          : [],
      }),
      "intro"
    ),
    featureCards: withKey(
      emptySectionShell(legacy.featureCardsSectionId || "feature-cards", {
        layouts: legacy.featureCards?.length
          ? [
              layout(
                "feature-layout",
                legacy.featureCards.length >= 3 ? "threeColumn" : "twoColumn",
                legacy.featureCards.map((card, index) =>
                  cardColumn(`feature-${index}`, withKey(card, `feature-card-${index}`), "feature", "overlay")
                )
              ),
            ]
          : [],
      }),
      "featureCards"
    ),
    profile: withKey(
      emptySectionShell(legacy.profileSectionId || "profile", {
        heading: legacy.profileTitle,
        textAlign: "left",
        layouts: [
          layout("profile-layout", "twoColumn", [
            richTextColumn("profile-copy", legacy.profileDescription),
            richTextColumn(
              "profile-bullets",
              (profileBullets || []).map((bullet) => ({
                _type: "block",
                style: "normal",
                listItem: "bullet",
                level: 1,
                markDefs: [],
                children: [{ _type: "span", text: bullet, marks: [] }],
              }))
            ),
          ]),
        ],
      }),
      "profile"
    ),
    infoCards: withKey(
      emptySectionShell(infoCardsSectionId || "teams", {
        heading: infoCardsTitle,
        outro: infoCardsSummary,
        layouts: infoCards?.length
          ? [
              layout(
                "info-layout",
                "threeColumn",
                infoCards.map((card, index) =>
                  cardColumn(`info-${index}`, withKey(card, `info-card-${index}`), "info", "panel")
                )
              ),
            ]
          : [],
      }),
      "infoCards"
    ),
    eventCards: withKey(
      emptySectionShell(eventCardsSectionId || "highlights", {
        heading: eventCardsTitle,
        subheading: eventCardsDescription,
        layouts: eventCards?.length
          ? [
              layout(
                "events-layout",
                "threeColumn",
                eventCards.map((card, index) =>
                  cardColumn(`event-${index}`, withKey(card, `event-card-${index}`), "event", "stacked")
                )
              ),
            ]
          : [],
      }),
      "eventCards"
    ),
    news: withKey(
      emptySectionShell(legacy.newsSectionId || "news", {
        heading: legacy.newsTitle,
        subheading: legacy.newsDescription,
        layouts: legacy.pressArticles?.length
          ? [
              layout(
                "news-layout",
                legacy.pressArticles.length >= 2 ? "twoColumn" : "singleColumn",
                legacy.pressArticles.map((article, index) => {
                  const href = typeof article.href === "string" ? article.href : undefined;
                  return cardColumn(
                    `press-${index}`,
                    withKey(
                      {
                        ...article,
                        href,
                        openInNewTab: true,
                        clickMode: "cta",
                        cta: href
                          ? { label: "Read article", href, style: "link", openInNewTab: true }
                          : undefined,
                      },
                      `press-article-${index}`
                    ),
                    "press",
                    "article"
                  );
                })
              ),
            ]
          : [],
      }),
      "news"
    ),
    partners: withKey(
      emptySectionShell(legacy.partnersSectionId || "partners", {
        heading: legacy.partnersTitle,
        layouts: legacy.partnersDescription
          ? [
              layout("partners-layout", "singleColumn", [
                richTextColumn("partners-copy", legacy.partnersDescription),
              ]),
            ]
          : [],
      }),
      "partners"
    ),
    instagram: withKey(
      {
        _type: "instagramSection",
        sectionId: legacy.instagramSectionId || "instagram",
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
    sections,
    seo: {},
  };
}
