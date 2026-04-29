import { groq } from "next-sanity";

export const homePageQuery = groq`
  coalesce(*[_id == "homepage"][0], *[_type == "homePage"][0]){
    heroSlides[]{
      alt,
      "src": coalesce(imageAsset.asset->url, src)
    },
    welcomeTitle,
    welcomeSectionId,
    welcomeDescription,
    profileTitle,
    profileSectionId,
    profileDescription,
    careerHighlights,
    teamsTitle,
    teamsSectionId,
    teamsSummary,
    teams,
    featureCards[]{
      title,
      description,
      href,
      "image": coalesce(imageAsset.asset->url, image)
    },
    featureCardsSectionId,
    highlightsTitle,
    highlightsSectionId,
    highlightsDescription,
    events[]{
      title,
      subtitle,
      date,
      note,
      "image": coalesce(imageAsset.asset->url, image)
    },
    newsTitle,
    newsSectionId,
    newsDescription,
    pressArticles,
    partnersTitle,
    partnersSectionId,
    partnersDescription,
    instagramHeading,
    instagramSectionId,
    instagramDescription,
    instagramUrl,
    sectionOrder
  }
`;
