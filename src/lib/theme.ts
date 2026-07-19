/** Shared corner radius — values come from CSS variables set by Global Styles roundedness. */
export const radiusStyles = {
  button: "rounded-[length:var(--radius-button)]",
  card: "rounded-[length:var(--radius-card)]",
  element: "rounded-[length:var(--radius-element)]",
  input: "rounded-[length:var(--radius-input)]",
} as const;

/**
 * Heading “voice” from Global Styles (text-transform, font-style, font-weight).
 * Prefer this over hard-coded uppercase / italic / bold on font-heading text.
 */
export const headingVoice =
  "[text-transform:var(--heading-text-transform)] [font-style:var(--heading-font-style)] [font-weight:var(--heading-font-weight)]";

export const headingStyles = {
  page: `font-heading text-[length:var(--text-heading-page)] ${headingVoice} tracking-tight text-foreground md:text-[length:var(--text-heading-page-md)]`,
  card: `font-heading text-[length:var(--text-heading-card)] ${headingVoice} leading-snug text-brand md:text-[length:var(--text-heading-card-md)]`,
  footer: `font-heading text-[length:var(--text-heading-footer)] ${headingVoice} tracking-wide text-white`,
} as const;

export const textStyles = {
  body: "text-[length:var(--text-body)] leading-relaxed text-muted md:text-[length:var(--text-body-md)]",
  bodyCompact: "text-[length:var(--text-body)] text-muted [&_p+p]:mt-2",
  /** Size + leading only — pair with a color utility or theme token. */
  bodySmallSize: "text-[length:var(--text-body-small)] leading-relaxed",
  bodySmall: "text-[length:var(--text-body-small)] leading-relaxed text-subtle",
  list: "text-[length:var(--text-body)] text-body-emphasis",
  /** Size + weight/tracking only — pair with a color utility when not using text-subtle. */
  metaSize: "text-[length:var(--text-body-small)] font-semibold uppercase tracking-widest",
  meta: "text-[length:var(--text-body-small)] font-semibold uppercase tracking-widest text-subtle",
} as const;

export const surfaceStyles = {
  card: `${radiusStyles.card} border border-border bg-background p-6`,
} as const;

const heroHeadingBase = `font-heading text-[length:var(--text-hero-heading)] ${headingVoice} md:text-[length:var(--text-hero-heading-md)]`;
const heroHeadingMinimalBase = `font-heading text-[length:var(--text-hero-heading-minimal)] ${headingVoice} md:text-[length:var(--text-hero-heading-minimal-md)]`;
const heroSubtextBase =
  "text-[length:var(--text-body)] leading-relaxed md:text-[length:var(--text-body-md)]";
const heroCtaBase =
  "text-[length:var(--text-body)] font-semibold uppercase tracking-wide";

/** Hero overlay typography — sizes follow Global Styles type scale; voice follows Global Styles. */
export const heroStyles = {
  heading: {
    default: `${heroHeadingBase} tracking-tight text-white drop-shadow-md`,
    minimal: `${heroHeadingMinimalBase} tracking-wide text-white/95`,
    boxed: `${heroHeadingBase} tracking-tight text-white`,
    "brand-accent": `${heroHeadingBase} tracking-tight text-brand drop-shadow-md`,
  },
  subtext: {
    default: `mt-3 max-w-2xl ${heroSubtextBase} text-white/90 drop-shadow-sm [&_a]:text-white [&_a]:underline`,
    minimal: `mt-2 max-w-xl ${heroSubtextBase} text-white/80`,
    boxed: `mt-3 max-w-2xl ${heroSubtextBase} text-white/90`,
    "brand-accent": `mt-3 max-w-2xl ${heroSubtextBase} text-white/90`,
  },
  cta: `${heroCtaBase} inline-flex items-center justify-center ${radiusStyles.button} bg-brand px-6 py-3 text-white shadow-md transition hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`,
} as const;
