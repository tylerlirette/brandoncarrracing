"use client";

import { RichText } from "@/components/content/RichText";
import {
  defaultHeroConfig,
  getHeroOverlayPresentation,
  heroContentWidthClasses,
  heroHeightClasses,
  normalizeHeroConfig,
  type HeroConfig,
} from "@/lib/hero";
import { isExternalHref } from "@/lib/href";
import { heroStyles, radiusStyles } from "@/lib/theme";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type HeroProps = {
  config?: Partial<HeroConfig>;
};

const textAlignClasses = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

function HeroContent({ config }: { config: HeroConfig }) {
  if (!config.showHeroText) {
    return null;
  }

  const hasHeading = Boolean(config.heading);
  const hasSubtext = Boolean(config.subtext);
  const hasCta = Boolean(config.cta);

  if (!hasHeading && !hasSubtext && !hasCta) {
    return null;
  }

  const styleClasses = {
    default: "",
    minimal: "",
    boxed: `${radiusStyles.card} bg-black/50 p-6 backdrop-blur-sm md:p-8`,
    "brand-accent": "",
  }[config.textStyle];

  const headingClasses = heroStyles.heading[config.textStyle];
  const subtextClasses = heroStyles.subtext[config.textStyle];

  return (
    <div className={`flex w-full flex-col ${textAlignClasses[config.textAlign]} ${styleClasses}`}>
      {hasHeading ? <h1 className={headingClasses}>{config.heading}</h1> : null}
      {hasSubtext ? <RichText className={subtextClasses} value={config.subtext} /> : null}
      {hasCta && config.cta ? (
        <div className={`mt-6 ${config.textAlign === "center" ? "mx-auto" : ""}`}>
          <HeroCtaButton cta={config.cta} />
        </div>
      ) : null}
    </div>
  );
}

function HeroCtaButton({ cta }: { cta: NonNullable<HeroConfig["cta"]> }) {
  const className = heroStyles.cta;
  const external = isExternalHref(cta.href) || cta.openInNewTab;

  if (external) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

function HeroMedia({
  images,
  displayMode,
  activeIndex,
}: {
  images: HeroConfig["images"];
  displayMode: HeroConfig["displayMode"];
  activeIndex: number;
}) {
  if (displayMode === "static") {
    const image = images[0];
    if (!image) {
      return null;
    }

    return (
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  return (
    <>
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}
    </>
  );
}

function HeroCarouselDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Show slide ${index + 1}`}
          onClick={() => onSelect(index)}
          className={`h-2.5 w-2.5 rounded-full border border-white/70 transition cursor-pointer ${
            index === activeIndex ? "scale-110 bg-brand" : "bg-white/40 hover:bg-white/70"
          }`}
        />
      ))}
    </div>
  );
}

export function Hero({ config: configInput }: HeroProps) {
  const config = normalizeHeroConfig(configInput, defaultHeroConfig);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((current) => {
      const length = config.images.length || 1;
      return (current + 1) % length;
    });
  }, [config.images.length]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (
      reduceMotion ||
      paused ||
      config.displayMode !== "carousel" ||
      config.images.length <= 1
    ) {
      return;
    }

    const id = window.setInterval(next, config.carouselIntervalMs);
    return () => window.clearInterval(id);
  }, [
    config.carouselIntervalMs,
    config.displayMode,
    config.images.length,
    next,
    paused,
    reduceMotion,
  ]);

  const slideIndex = config.images.length ? activeIndex % config.images.length : 0;

  if (!config.images.length) {
    return null;
  }

  const overlay = getHeroOverlayPresentation(config.overlay);
  const showDots = config.displayMode === "carousel" && config.showCarouselDots && config.images.length > 1;
  const isVerticallyCentered = config.showHeroText && config.textVerticalAlign === "center";

  const contentPaddingClasses = !config.showHeroText
    ? ""
    : isVerticallyCentered
      ? "py-10 md:py-14"
      : showDots
        ? "pb-14 md:pb-16"
        : "pb-10 md:pb-14";

  return (
    <section
      className={`relative w-full overflow-hidden bg-black ${heroHeightClasses[config.height]}`}
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="absolute inset-0">
        <HeroMedia images={config.images} displayMode={config.displayMode} activeIndex={slideIndex} />
      </div>

      {config.overlay.type !== "none" ? (
        <div
          className={`pointer-events-none absolute inset-0 z-10 ${overlay.className}`}
          style={overlay.style}
          aria-hidden
        />
      ) : null}

      {config.showHeroText ? (
        <div
          className={`absolute inset-0 z-20 flex flex-col px-4 md:px-8 ${contentPaddingClasses} ${
            isVerticallyCentered ? "justify-center" : "justify-end"
          }`}
        >
          <div className={heroContentWidthClasses[config.contentWidth]}>
            <HeroContent config={config} />
          </div>
        </div>
      ) : null}

      {showDots ? (
        <HeroCarouselDots count={config.images.length} activeIndex={slideIndex} onSelect={setActiveIndex} />
      ) : null}
    </section>
  );
}
