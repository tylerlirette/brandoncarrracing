/** Shared typography class strings — sizes come from CSS variables set by Global Styles. */

export const headingStyles = {
  page: "font-heading text-[length:var(--text-heading-page)] font-bold uppercase italic tracking-tight text-foreground md:text-[length:var(--text-heading-page-md)]",
  card: "font-heading text-[length:var(--text-heading-card)] font-bold uppercase italic leading-snug text-brand md:text-[length:var(--text-heading-card-md)]",
  footer: "font-heading text-[length:var(--text-heading-footer)] font-bold uppercase italic tracking-wide text-white",
} as const;

export const textStyles = {
  body: "text-[length:var(--text-body)] leading-relaxed text-muted md:text-[length:var(--text-body-md)]",
  bodyCompact: "text-[length:var(--text-body)] text-muted [&_p+p]:mt-2",
  bodySmall: "text-[length:var(--text-body-small)] leading-relaxed text-subtle",
  list: "text-[length:var(--text-body)] text-body-emphasis",
  meta: "text-[length:var(--text-body-small)] font-semibold uppercase tracking-widest text-subtle",
} as const;

export const surfaceStyles = {
  pageSection: "border-y border-border bg-surface-muted py-14 md:py-20",
  borderedSection: "border-t border-border bg-surface-muted py-14 md:py-20",
  card: "rounded-sm border border-border bg-background p-6 shadow-sm",
  elevatedCard: "rounded-sm bg-background shadow ring-1 ring-black/5",
} as const;

const heroHeadingBase =
  "font-heading text-[length:var(--text-hero-heading)] md:text-[length:var(--text-hero-heading-md)]";
const heroHeadingMinimalBase =
  "font-heading text-[length:var(--text-hero-heading-minimal)] md:text-[length:var(--text-hero-heading-minimal-md)]";
const heroSubtextBase =
  "text-[length:var(--text-body)] leading-relaxed md:text-[length:var(--text-body-md)]";
const heroCtaBase =
  "text-[length:var(--text-body)] font-semibold uppercase tracking-wide";

/** Hero overlay typography — sizes follow Global Styles type scale. */
export const heroStyles = {
  heading: {
    default: `${heroHeadingBase} font-bold uppercase italic tracking-tight text-white drop-shadow-md`,
    minimal: `${heroHeadingMinimalBase} font-semibold uppercase tracking-wide text-white/95`,
    boxed: `${heroHeadingBase} font-bold uppercase italic tracking-tight text-white`,
    "brand-accent": `${heroHeadingBase} font-bold uppercase italic tracking-tight text-brand drop-shadow-md`,
  },
  subtext: {
    default: `mt-3 max-w-2xl ${heroSubtextBase} text-white/90 drop-shadow-sm [&_a]:text-white [&_a]:underline`,
    minimal: `mt-2 max-w-xl ${heroSubtextBase} text-white/80`,
    boxed: `mt-3 max-w-2xl ${heroSubtextBase} text-white/90`,
    "brand-accent": `mt-3 max-w-2xl ${heroSubtextBase} text-white/90`,
  },
  cta: `${heroCtaBase} inline-flex items-center justify-center rounded-sm bg-brand px-6 py-3 text-white shadow-md transition hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`,
} as const;
