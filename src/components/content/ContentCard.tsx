import { RichText } from "@/components/content/RichText";
import type { ContentCard as ContentCardData, ContentCardCta } from "@/lib/contentCard";
import {
  cardLinkRel,
  cardLinkTarget,
  contentCardAlignClasses,
  contentCardAspectClasses,
  contentCardCtaButtonClass,
  contentCardCtaLinkClass,
  contentCardShadowClasses,
  contentCardTextSizeClasses,
} from "@/lib/contentCard";
import { headingStyles, headingVoice, radiusStyles, surfaceStyles, textStyles } from "@/lib/theme";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ContentCardProps = {
  card: ContentCardData;
};

function CardCta({
  cta,
  textSize,
  className,
  openInNewTab,
  inverted,
}: {
  cta: ContentCardCta;
  textSize: ContentCardData["textSize"];
  className?: string;
  openInNewTab?: boolean;
  /** Light surface + brand text (feature overlay). */
  inverted?: boolean;
}) {
  const ctaClassName = inverted
    ? `inline-flex w-fit items-center ${radiusStyles.button} bg-background px-4 py-2 text-brand transition ${contentCardTextSizeClasses[textSize].overlayCta}`
    : cta.style === "button"
      ? contentCardCtaButtonClass(textSize)
      : contentCardCtaLinkClass(textSize);
  const newTab = openInNewTab ?? cta.openInNewTab;

  return (
    <Link
      href={cta.href}
      target={cardLinkTarget(newTab, cta.href)}
      rel={cardLinkRel(newTab, cta.href)}
      className={`${ctaClassName} ${className || ""}`}
    >
      {cta.label}
    </Link>
  );
}

function CardImage({
  card,
  className,
  imageClassName,
  objectContain,
}: {
  card: ContentCardData;
  className?: string;
  imageClassName?: string;
  objectContain?: boolean;
}) {
  if (!card.image) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${contentCardAspectClasses[card.aspectRatio]} ${className || ""}`}>
      <Image
        src={card.image}
        alt={card.imageAlt || card.title}
        fill
        className={`${objectContain ? "object-contain p-4" : "object-cover"} ${imageClassName || ""}`}
        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
      />
    </div>
  );
}

function CardTitle({ card, className }: { card: ContentCardData; className?: string }) {
  const textSize = contentCardTextSizeClasses[card.textSize];
  return <h3 className={`${textSize.title} ${className || ""}`}>{card.title}</h3>;
}

function withCardLink(card: ContentCardData, className: string, children: ReactNode): ReactNode {
  if (card.clickMode === "card" && card.href) {
    return (
      <Link
        href={card.href}
        target={cardLinkTarget(card.openInNewTab, card.href)}
        rel={cardLinkRel(card.openInNewTab, card.href)}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

function CtaSlot({ card, className }: { card: ContentCardData; className?: string }) {
  if (card.clickMode === "cta" && card.cta) {
    return <CardCta cta={card.cta} textSize={card.textSize} openInNewTab={card.openInNewTab} className={className} />;
  }
  return null;
}

/* ─── Feature Card styles ─── */

function FeatureOverlayCard({ card }: { card: ContentCardData }) {
  const align = contentCardAlignClasses[card.alignment];
  const shadow = contentCardShadowClasses[card.shadow];
  const textSize = contentCardTextSizeClasses[card.textSize];
  const hoverCtaLabel = card.cta?.label || (card.clickMode === "card" ? "Learn more" : undefined);
  /** Hide non-essential reveal only on hover-capable desktop; keep visible for touch / keyboard focus. */
  const hoverRevealClass =
    "opacity-100 transition duration-300 [@media(hover:hover)_and_(min-width:768px)]:opacity-0 [@media(hover:hover)_and_(min-width:768px)]:group-hover:opacity-100 group-focus-within:opacity-100";

  const inner = (
    <>
      {card.image ? (
        <Image
          src={card.image}
          alt={card.imageAlt || card.title}
          fill
          className="object-cover transition duration-500 scale-105 [@media(hover:hover)]:md:scale-100 [@media(hover:hover)]:md:group-hover:scale-105 group-focus-within:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
      ) : null}
      <div className="absolute inset-0 bg-brand/85 transition duration-300 [@media(hover:hover)_and_(min-width:768px)]:bg-black/25 [@media(hover:hover)_and_(min-width:768px)]:group-hover:bg-brand/85 group-focus-within:bg-brand/85" />
      <div
        className={`relative z-10 flex h-full min-h-[280px] flex-col justify-end p-6 text-white md:min-h-[320px] ${align}`}
      >
        <CardTitle card={card} />
        {card.description ? (
          <RichText
            className={`mt-2 max-w-xs text-white/90 [&_p+p]:mt-2 ${textSize.descriptionOverlay}`}
            value={card.description}
          />
        ) : null}
        {card.clickMode === "cta" && card.cta ? (
          <CardCta
            cta={card.cta}
            textSize={card.textSize}
            openInNewTab={card.openInNewTab}
            inverted
            className={`mt-4 ${hoverRevealClass}`}
          />
        ) : hoverCtaLabel ? (
          <span
            className={`mt-4 inline-flex w-fit items-center ${radiusStyles.button} bg-background px-4 py-2 text-brand ${hoverRevealClass} ${textSize.overlayCta}`}
          >
            {hoverCtaLabel}
          </span>
        ) : null}
      </div>
    </>
  );

  return withCardLink(
    card,
    `group relative isolate flex min-h-[280px] overflow-hidden ${radiusStyles.card} ${shadow} transition hover:shadow-lg focus-within:shadow-lg md:min-h-[320px]`,
    inner
  );
}

function FeatureStackedCard({ card, filled }: { card: ContentCardData; filled: boolean }) {
  const align = contentCardAlignClasses[card.alignment];
  const shadow = contentCardShadowClasses[card.shadow];
  const textSize = contentCardTextSizeClasses[card.textSize];
  const bodyStyle = filled && card.bodyBackgroundColor ? { backgroundColor: card.bodyBackgroundColor } : undefined;
  const bodyClassName = filled
    ? `flex flex-col gap-3 p-6 ${align} ${card.bodyBackgroundColor ? "" : "bg-surface-muted"}`
    : `flex flex-col gap-3 pt-4 ${align}`;

  const inner = (
    <>
      <CardImage card={card} />
      <div className={bodyClassName} style={bodyStyle}>
        <CardTitle card={card} className="text-brand" />
        {card.description ? (
          <RichText className={`${textSize.description} text-muted [&_p+p]:mt-2`} value={card.description} />
        ) : null}
        <CtaSlot card={card} className="mt-1" />
      </div>
    </>
  );

  return withCardLink(card, `flex h-full flex-col overflow-hidden ${radiusStyles.card} ${shadow}`, inner);
}

function FeatureCardView({ card }: { card: ContentCardData }) {
  switch (card.style) {
    case "filled":
      return <FeatureStackedCard card={card} filled />;
    case "minimal":
      return <FeatureStackedCard card={card} filled={false} />;
    case "overlay":
    default:
      return <FeatureOverlayCard card={card} />;
  }
}

/* ─── Info Card styles ─── */

function InfoCardView({ card }: { card: ContentCardData }) {
  const align = contentCardAlignClasses[card.alignment];
  const shadow = contentCardShadowClasses[card.shadow];
  const interactive = card.clickMode === "card";

  const body = (
    <>
      <h3 className={`font-heading text-lg ${headingVoice} text-brand`}>{card.title}</h3>
      {card.description ? (
        <RichText className={`mt-2 ${textStyles.bodyCompact}`} value={card.description} />
      ) : null}
      <CtaSlot card={card} className="mt-auto pt-4" />
    </>
  );

  if (card.style === "accent") {
    return withCardLink(
      card,
      `flex h-full flex-col border-l-4 border-brand py-1 pl-5 ${align} ${interactive ? "transition hover:border-brand-secondary" : ""}`,
      body
    );
  }

  if (card.style === "muted") {
    return withCardLink(
      card,
      `flex h-full flex-col ${radiusStyles.card} bg-surface-muted p-6 ${align} ${interactive ? "transition hover:bg-surface-subtle" : ""}`,
      body
    );
  }

  return withCardLink(
    card,
    `flex h-full flex-col ${surfaceStyles.card} ${shadow} ${align} ${interactive ? "transition hover:border-brand/40 hover:shadow-md" : ""}`,
    body
  );
}

/* ─── Event Card styles ─── */

function EventCardView({ card }: { card: ContentCardData }) {
  const shadow = contentCardShadowClasses[card.shadow === "none" ? "medium" : card.shadow];
  const interactive = card.clickMode === "card";
  const hoverClass = interactive ? "transition hover:shadow-md" : "";

  const dateBadge = card.date ? (
    <p className={`inline-flex w-fit ${radiusStyles.element} bg-badge px-2 py-1 ${textStyles.metaSize} text-white`}>
      {card.date}
    </p>
  ) : null;

  const textBlock = (
    <>
      {dateBadge}
      <h3 className={headingStyles.card}>{card.title}</h3>
      {card.subtitle ? <p className="text-sm font-semibold text-body-emphasis">{card.subtitle}</p> : null}
      {card.note ? <p className={`mt-auto ${textStyles.bodySmall}`}>{card.note}</p> : null}
      <CtaSlot card={card} className="mt-3" />
    </>
  );

  if (card.style === "horizontal") {
    return withCardLink(
      card,
      `flex h-full flex-col overflow-hidden sm:flex-row ${radiusStyles.card} bg-background ${shadow} ${hoverClass}`,
      <>
        <div className="relative h-36 shrink-0 bg-surface-subtle sm:h-auto sm:w-36 md:w-44">
          {card.image ? (
            <Image
              src={card.image}
              alt={card.imageAlt || card.title}
              fill
              className="object-contain p-4"
              sizes="(max-width:640px) 100vw, 176px"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">{textBlock}</div>
      </>
    );
  }

  if (card.style === "featured") {
    return withCardLink(
      card,
      `flex h-full flex-col overflow-hidden ${radiusStyles.card} bg-background ${shadow} ${hoverClass}`,
      <>
        <div className="relative aspect-[16/10] bg-surface-subtle">
          {card.image ? (
            <Image
              src={card.image}
              alt={card.imageAlt || card.title}
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          ) : null}
          {card.date ? (
            <p
              className={`absolute bottom-3 left-3 inline-flex ${radiusStyles.element} bg-brand px-2.5 py-1 ${textStyles.metaSize} text-white`}
            >
              {card.date}
            </p>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className={headingStyles.card}>{card.title}</h3>
          {card.subtitle ? <p className="text-sm font-semibold text-body-emphasis">{card.subtitle}</p> : null}
          {card.note ? <p className={`mt-auto ${textStyles.bodySmall}`}>{card.note}</p> : null}
          <CtaSlot card={card} className="mt-3" />
        </div>
      </>
    );
  }

  return withCardLink(
    card,
    `flex h-full flex-col overflow-hidden ${radiusStyles.card} bg-background ${shadow} ${hoverClass}`,
    <>
      <div className="relative h-28 bg-surface-subtle">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.imageAlt || card.title}
            fill
            className="object-contain p-4"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">{textBlock}</div>
    </>
  );
}

/* ─── Press Card styles ─── */

function PressCardView({ card }: { card: ContentCardData }) {
  const shadow = contentCardShadowClasses[card.shadow];
  const interactive = card.clickMode === "card";
  const meta = [card.source, card.date].filter(Boolean).join(" · ");
  const hoverClass = interactive ? "transition hover:border-brand/40 hover:shadow-md" : "";

  const cta =
    card.clickMode === "cta" && card.cta ? (
      <CardCta
        cta={{ ...card.cta, style: card.cta.style || "link" }}
        textSize="medium"
        openInNewTab={card.openInNewTab}
        className="mt-5"
      />
    ) : card.clickMode === "card" && card.cta ? (
      <span className="mt-5 inline-flex w-fit text-sm font-bold uppercase tracking-wide text-brand">
        {card.cta.label}
      </span>
    ) : null;

  if (card.style === "featured") {
    return withCardLink(
      card,
      `flex h-full flex-col border-x border-b border-border border-t-4 border-t-brand ${radiusStyles.card} bg-background p-6 ${shadow} ${hoverClass}`,
      <>
        {meta ? <p className={textStyles.meta}>{meta}</p> : null}
        <h3 className={`mt-2 font-heading text-2xl ${headingVoice} leading-snug text-foreground md:text-3xl`}>
          {card.title}
        </h3>
        {card.excerpt ? <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{card.excerpt}</p> : null}
        {cta}
      </>
    );
  }

  if (card.style === "compact") {
    return withCardLink(
      card,
      `flex h-full flex-col gap-2 ${radiusStyles.card} border border-border bg-background p-4 ${shadow} ${hoverClass}`,
      <>
        {meta ? <p className={textStyles.meta}>{meta}</p> : null}
        <h3 className={`font-heading text-lg ${headingVoice} leading-snug text-foreground`}>{card.title}</h3>
        {cta}
      </>
    );
  }

  return withCardLink(
    card,
    `flex h-full flex-col ${surfaceStyles.card} ${shadow} ${hoverClass}`,
    <>
      {meta ? <p className={textStyles.meta}>{meta}</p> : null}
      <h3 className={`mt-2 font-heading text-xl ${headingVoice} leading-snug text-foreground md:text-2xl`}>
        {card.title}
      </h3>
      {card.excerpt ? <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{card.excerpt}</p> : null}
      {cta}
    </>
  );
}

export function ContentCard({ card }: ContentCardProps) {
  switch (card.cardType) {
    case "info":
      return <InfoCardView card={card} />;
    case "event":
      return <EventCardView card={card} />;
    case "press":
      return <PressCardView card={card} />;
    case "feature":
    default:
      return <FeatureCardView card={card} />;
  }
}
