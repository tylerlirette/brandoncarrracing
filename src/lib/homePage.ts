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
  type TeamCard,
  type UpcomingEvent,
} from "@/lib/site";

const defaultSectionOrder = ["hero", "intro", "featureCards", "profile", "teams", "highlights", "news", "partners", "instagram"] as const;

export type HomePageContent = {
  heroSlides: HeroSlide[];
  welcomeTitle: string;
  welcomeDescription: string;
  profileTitle: string;
  profileDescription: string;
  careerHighlights: string[];
  teamsTitle: string;
  teamsSummary: string;
  teams: TeamCard[];
  featureCards: FeatureCard[];
  highlightsTitle: string;
  highlightsDescription: string;
  events: UpcomingEvent[];
  newsTitle: string;
  newsDescription: string;
  pressArticles: PressArticle[];
  partnersTitle: string;
  partnersDescription: string;
  instagramHeading: string;
  instagramDescription: string;
  instagramUrl: string;
  sectionOrder: string[];
};

export const defaultHomePageContent: HomePageContent = {
  heroSlides: [...heroSlides],
  welcomeTitle: "Welcome to Brandon Carr Racing",
  welcomeDescription:
    "Eighteen-year-old British racer climbing the US ladder — from karting championships to dirt midgets and asphalt late models, with eyes on ARCA and NASCAR national series.",
  profileTitle: "Profile",
  profileDescription:
    "Brandon competes in midgets with Keith Kunz Motorsports and late model stock cars with Setzer Racing & Development. A karting and Kartmasters champion with midget and late model wins, he is focused on ARCA and the NASCAR development ladder — Trucks, Xfinity, and Cup as long-term goals.",
  careerHighlights: [...careerHighlights],
  teamsTitle: "Current teams & 2026 plans",
  teamsSummary:
    "2026 includes late model stock car races with Setzer Racing, selected ARCA Racing Series events, and continued progression toward the NASCAR national divisions.",
  teams: [...teamCards],
  featureCards: [...featureCards],
  highlightsTitle: "Racing highlights",
  highlightsDescription: "Dates and venues evolve quickly — confirm tickets and schedules with each track and series.",
  events: [...upcomingEvents],
  newsTitle: "In the news",
  newsDescription: "Recent coverage from IHRA and Speedway Digest.",
  pressArticles: [...pressArticles],
  partnersTitle: "Sponsorship & partnerships",
  partnersDescription:
    "Brandon partners with brands that want motorsport as a marketing platform — car and suit branding, social promotion, race hospitality, and corporate events. For partnership inquiries, reach out via Instagram or your existing team contact.",
  instagramHeading: "Latest from Instagram",
  instagramDescription: "Follow @brandon_carr_racing for news, behind-the-scenes, and weekend updates.",
  instagramUrl: INSTAGRAM_URL,
  sectionOrder: [...defaultSectionOrder],
};

export function mergeHomePageContent(content?: Partial<HomePageContent> | null): HomePageContent {
  if (!content) {
    return defaultHomePageContent;
  }

  return {
    ...defaultHomePageContent,
    ...content,
    heroSlides: content.heroSlides?.length ? content.heroSlides : defaultHomePageContent.heroSlides,
    careerHighlights: content.careerHighlights?.length ? content.careerHighlights : defaultHomePageContent.careerHighlights,
    teams: content.teams?.length ? content.teams : defaultHomePageContent.teams,
    featureCards: content.featureCards?.length ? content.featureCards : defaultHomePageContent.featureCards,
    events: content.events?.length ? content.events : defaultHomePageContent.events,
    pressArticles: content.pressArticles?.length ? content.pressArticles : defaultHomePageContent.pressArticles,
    sectionOrder: content.sectionOrder?.length ? content.sectionOrder : defaultHomePageContent.sectionOrder,
    instagramUrl: content.instagramUrl || defaultHomePageContent.instagramUrl,
  };
}
