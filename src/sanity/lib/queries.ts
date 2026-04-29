import { groq } from "next-sanity";

export const homePageQuery = groq`
  coalesce(*[_id == "homepage"][0], *[_type == "homePage"][0]){
    welcomeTitle,
    welcomeDescription,
    profileTitle,
    profileDescription,
    careerHighlights,
    teamsTitle,
    teamsSummary,
    teams,
    featureCards,
    heroSlides,
    highlightsTitle,
    highlightsDescription,
    events,
    newsTitle,
    newsDescription,
    pressArticles,
    partnersTitle,
    partnersDescription,
    instagramHeading,
    instagramDescription,
    instagramUrl,
    sectionOrder
  }
`;
