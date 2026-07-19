import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  coalesce(*[_id == "siteSettings"][0], *[_type == "siteSettings"][0]){
    name,
    description,
    openGraphDescription,
    copyrightEntity,
    newsletterBlurb,
    instagramUrl,
    instagramWidgetIframeSrc,
    logoHeader{
      alt,
      "asset": asset->{
        "url": url + "?w=480&auto=format&q=80"
      }
    },
    logoFooter{
      alt,
      "asset": asset->{
        "url": url + "?w=480&auto=format&q=80"
      }
    },
    defaultOgImage{
      alt,
      "url": asset->url
    }
  }
`;

export const globalStylesQuery = groq`
  coalesce(*[_id == "globalStyles"][0], *[_type == "globalStyles"][0]){
    colors,
    typography,
    roundedness
  }
`;

export const siteHeaderQuery = groq`
  coalesce(*[_id == "siteHeader"][0], *[_type == "siteHeader"][0]){
    height,
    backgroundColor,
    sticky,
    navTheme,
    navAlignment,
    logo{
      alt,
      "asset": asset->{
        "url": url + "?w=480&auto=format&q=80"
      }
    },
    navItems[]{
      _type,
      _type == "navLink" => {
        label,
        icon,
        href,
        openInNewTab
      },
      _type == "navDropdown" => {
        label,
        items[]{
          label,
          href,
          openInNewTab
        }
      }
    },
    cta{
      enabled,
      label,
      href,
      openInNewTab
    }
  }
`;

export const siteFooterQuery = groq`
  coalesce(*[_id == "siteFooter"][0], *[_type == "siteFooter"][0]){
    height,
    theme,
    backgroundColor,
    brandColumn{
      text,
      logo{
        alt,
        "asset": asset->{
          "url": url + "?w=480&auto=format&q=80"
        }
      }
    },
    middleColumn{
      heading,
      items[]{
        _type,
        _type == "footerLink" => {
          label,
          icon,
          href,
          openInNewTab
        },
        _type == "footerText" => {
          text
        }
      }
    },
    rightColumn{
      layout,
      heading,
      newsletterTextAbove,
      newsletterTextBelow,
      items[]{
        _type,
        _type == "footerLink" => {
          label,
          icon,
          href,
          openInNewTab
        },
        _type == "footerText" => {
          text
        }
      }
    }
  }
`;

const heroSectionFields = groq`
  displayMode,
  height,
  images[]{
    alt,
    "src": coalesce(imageAsset.asset->url + "?w=1920&auto=format&fit=max&q=80", src)
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
`;

const instagramSectionFields = groq`
  sectionId,
  heading,
  description,
  instagramUrl,
  widgetIframeSrc
`;

const columnCardFields = groq`
  title,
  description,
  subtitle,
  date,
  note,
  source,
  excerpt,
  href,
  openInNewTab,
  cardType,
  style,
  variant,
  clickMode,
  shadow,
  alignment,
  aspectRatio,
  textSize,
  imageAlt,
  bodyBackgroundColor,
  cta{
    label,
    href,
    style,
    openInNewTab
  },
  "image": coalesce(imageAsset.asset->url + "?w=1200&auto=format&fit=max&q=80", image)
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug == $slug][0]{
    title,
    slug,
    layout,
    seo{
      title,
      description,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt
    },
    sections[]{
      _type,
      _key,
      _type == "contentSection" => {
        sectionId,
        heading,
        subheading,
        textAlign,
        theme,
        backgroundColor,
        backgroundImage{
          alt,
          "src": coalesce(imageAsset.asset->url + "?w=1920&auto=format&fit=max&q=80", src)
        },
        overlay,
        spacing,
        border,
        outro,
        layouts[]{
          _type,
          _key,
          variant,
          gridColumns,
          gridRows,
          columns[]{
            _key,
            verticalAlign,
            component[]{
              _type,
              _key,
              _type in ["columnCard", "columnFeatureCard", "columnInfoCard", "columnEventCard", "columnPressCard"] => {
                ${columnCardFields}
              },
              _type == "columnImage" => {
                imageAlt,
                aspectRatio,
                "image": coalesce(imageAsset.asset->url + "?w=1400&auto=format&fit=max&q=80", image)
              },
              _type == "columnRichText" => {
                text
              }
            }
          }
        }
      },
      _type == "heroSection" => {
        ${heroSectionFields}
      },
      _type == "instagramSection" => {
        ${instagramSectionFields}
      }
    }
  }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug)]{ slug, _updatedAt }
`;
