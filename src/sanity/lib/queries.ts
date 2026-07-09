import { groq } from "next-sanity";

export const globalStylesQuery = groq`
  coalesce(*[_id == "globalStyles"][0], *[_type == "globalStyles"][0]){
    colors,
    typography
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug == $slug][0]{
    title,
    slug,
    layout,
    headerLinks,
    seo,
    sections[]{
      _type,
      _key,
      _type == "heroSection" => {
        displayMode,
        height,
        images[]{
          alt,
          "src": coalesce(imageAsset.asset->url, src)
        },
        heading,
        subtext,
        cta,
        showHeroText,
        textAlign,
        textVerticalAlign,
        textStyle,
        contentWidth,
        overlay,
        carouselIntervalMs,
        showCarouselDots
      },
      _type == "introSection" => {
        sectionId,
        title,
        description
      },
      _type == "featureCardsSection" => {
        sectionId,
        cards[]{
          title,
          description,
          href,
          "image": coalesce(imageAsset.asset->url, image)
        }
      },
      _type == "profileSection" => {
        sectionId,
        title,
        description,
        bullets
      },
      _type == "infoCardsSection" => {
        sectionId,
        title,
        summary,
        cards[]{
          title,
          description
        }
      },
      _type == "eventCardsSection" => {
        sectionId,
        title,
        description,
        events[]{
          title,
          subtitle,
          date,
          note,
          "image": coalesce(imageAsset.asset->url, image)
        }
      },
      _type == "newsSection" => {
        sectionId,
        title,
        description,
        articles[]{
          title,
          source,
          date,
          excerpt,
          href
        }
      },
      _type == "partnersSection" => {
        sectionId,
        title,
        description
      },
      _type == "instagramSection" => {
        sectionId,
        heading,
        description,
        instagramUrl
      }
    }
  }
`;

export const legacyHomePageQuery = groq`
  coalesce(*[_id == "homepage"][0], *[_type == "homePage"][0]){
    hero{
      displayMode,
      height,
      images[]{
        alt,
        "src": coalesce(imageAsset.asset->url, src)
      },
      heading,
      subtext,
      cta,
      showHeroText,
      textAlign,
      textVerticalAlign,
      textStyle,
      contentWidth,
      overlay,
      carouselIntervalMs,
      showCarouselDots
    },
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
    headerLinks,
    sectionOrder
  }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug)]{ slug }
`;
