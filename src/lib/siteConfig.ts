/**
 * Code-level fallbacks for site identity.
 *
 * Prefer editing **Site Settings** in Sanity for day-to-day branding.
 * Keep this file for clone defaults when Studio is empty or offline, and for
 * `NEXT_PUBLIC_SITE_URL` (canonical origin is env-driven, not CMS).
 */
export const siteConfig = {
  name: "Brandon Carr Racing",
  /** Canonical site origin for metadata / Open Graph. Override with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  description:
    "Official home of Brandon Carr — British karting champion, IHRA stock car winner, Keith Kunz midget driver, and Setzer Racing late model competitor on the ARCA / NASCAR development ladder.",
  openGraphDescription:
    "British racer Brandon Carr: midgets with Keith Kunz Motorsports, late models with Setzer Racing, and selected ARCA events.",
  logos: {
    header: "/brandon-carr-racing-logo.svg",
    footer: "/brandon-carr-racing-logo-white.svg",
    headerAlt: "Brandon Carr Racing",
    footerAlt: "Brandon Carr Racing",
  },
  social: {
    instagram: "https://www.instagram.com/brandon_carr_racing/",
  },
  footer: {
    copyrightEntity: "Brandon Carr Racing",
    newsletterBlurb: "Sign up for schedule updates, partner news, and appearances.",
  },
  instagramWidget: {
    defaultIframeSrc:
      "https://lightwidget.com/widgets/18d6e7d7623b550f9276c538012a0565.html",
  },
} as const;
