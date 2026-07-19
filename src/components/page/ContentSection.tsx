import { RichText } from "@/components/content/RichText";
import { ColumnLayoutView } from "@/components/page/ColumnLayout";
import { getHeroOverlayPresentation } from "@/lib/hero";
import type { ContentSection as ContentSectionType } from "@/lib/page";
import { hasRichText } from "@/lib/richText";
import {
  sectionBackgroundClasses,
  sectionBorderStyle,
  sectionSpacingClasses,
  sectionTextAlignClasses,
  sectionThemeClasses,
} from "@/lib/section";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type ContentSectionProps = {
  section: ContentSectionType;
};

export function ContentSection({ section }: ContentSectionProps): ReactNode {
  const themeClasses = sectionThemeClasses[section.theme];
  const alignClass = sectionTextAlignClasses[section.textAlign];
  const hasBackgroundImage = Boolean(section.backgroundImage?.src);
  const hasCustomBackground = Boolean(section.backgroundColor);
  const overlay = getHeroOverlayPresentation(section.overlay);
  const showOverlay = section.overlay.type !== "none";
  const showHeader = Boolean(section.heading?.trim() || hasRichText(section.subheading));
  const showOutro = hasRichText(section.outro);
  const spacingClass = sectionSpacingClasses[section.spacing];
  const needsMediaLayer = hasBackgroundImage || showOverlay;

  const sectionStyle: CSSProperties = {
    ...(hasCustomBackground ? { backgroundColor: section.backgroundColor } : {}),
    ...sectionBorderStyle(section.border, section.theme),
  };

  const sectionClassName = [
    "relative",
    themeClasses.section,
    !hasBackgroundImage && !hasCustomBackground ? sectionBackgroundClasses[section.theme] : "",
    spacingClass,
  ]
    .filter(Boolean)
    .join(" ");

  const textMaxWidthClass = section.textAlign === "center" ? "mx-auto max-w-3xl" : "max-w-3xl";

  return (
    <section
      id={section.sectionId}
      className={sectionClassName}
      style={Object.keys(sectionStyle).length ? sectionStyle : undefined}
    >
      {hasBackgroundImage && section.backgroundImage ? (
        <div className="absolute inset-0 overflow-hidden" aria-hidden={!section.backgroundImage.alt}>
          <Image
            src={section.backgroundImage.src}
            alt={section.backgroundImage.alt || ""}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      {showOverlay ? (
        <div
          className={`pointer-events-none absolute inset-0 z-[1] ${overlay.className}`}
          style={overlay.style}
          aria-hidden
        />
      ) : null}

      <div className={needsMediaLayer ? "relative z-[2]" : undefined}>
        {showHeader ? (
          <div className={`mx-auto mb-10 max-w-6xl px-4 ${alignClass}`}>
            {section.heading?.trim() ? (
              <h2 className={themeClasses.heading}>{section.heading}</h2>
            ) : null}
            {hasRichText(section.subheading) ? (
              <RichText
                className={`${section.heading?.trim() ? "mt-3" : ""} ${textMaxWidthClass}`}
                theme={section.theme}
                value={section.subheading}
              />
            ) : null}
          </div>
        ) : null}

        {section.layouts.map((layout, index) => (
          <div key={layout._key} className={`mx-auto max-w-6xl px-4 ${index > 0 ? "mt-10" : ""}`}>
            <ColumnLayoutView layout={layout} theme={section.theme} />
          </div>
        ))}

        {showOutro ? (
          <div className={`mx-auto mt-10 max-w-6xl px-4 ${alignClass}`}>
            <RichText className={textMaxWidthClass} theme={section.theme} value={section.outro} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
