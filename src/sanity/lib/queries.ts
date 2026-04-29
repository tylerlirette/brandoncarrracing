import { groq } from "next-sanity";

export const homePageQuery = groq`
  coalesce(*[_id == "homepage"][0], *[_type == "homePage"][0]){
    heroSlides[]{
      alt,
      "src": coalesce(imageAsset.asset->url, src)
    },
    welcomeTitle,
    welcomeDescription,
    profileTitle,
    profileDescription,
    careerHighlights,
    teamsTitle,
    teamsSummary,
    teams,
    featureCards[]{
      title,
      description,
      href,
      "image": coalesce(imageAsset.asset->url, image)
    },
    highlightsTitle,
    highlightsDescription,
    events[]{
      title,
      subtitle,
      date,
      note,
      "image": coalesce(imageAsset.asset->url, image)
    },
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
