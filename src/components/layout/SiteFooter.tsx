import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import type {
  FooterBrandColumn,
  FooterColumnItem,
  FooterLinksColumn,
  FooterRightColumn,
  FooterTheme,
  FooterThemeClasses,
  SiteFooterConfig,
} from "@/lib/footer";
import {
  footerHeightClasses,
  footerThemeClasses,
  isExternalHref,
} from "@/lib/footer";
import { textStyles } from "@/lib/theme";
import { NewsletterForm } from "./NewsletterForm";

type SiteFooterProps = {
  config: SiteFooterConfig;
};

function linkTarget(openInNewTab: boolean | undefined, href: string): string | undefined {
  return openInNewTab || isExternalHref(href) ? "_blank" : undefined;
}

function linkRel(openInNewTab: boolean | undefined, href: string): string | undefined {
  return openInNewTab || isExternalHref(href) ? "noopener noreferrer" : undefined;
}

function FooterColumnHeading({ heading, theme }: { heading?: string; theme: FooterThemeClasses }) {
  if (!heading) {
    return null;
  }

  return <h2 className={theme.heading}>{heading}</h2>;
}

function FooterColumnItems({
  items,
  theme,
  className,
}: {
  items: FooterColumnItem[];
  theme: FooterThemeClasses;
  className?: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-3 ${className || ""}`}>
      {items.map((item, index) => {
        if (item._type === "footerText") {
          return (
            <p
              key={`text-${index}`}
              className={`whitespace-pre-line ${textStyles.bodySmallSize} ${theme.bodyText}`}
            >
              {item.text}
            </p>
          );
        }

        const key = item.href + (item.label || item.icon || String(index));

        return (
          <Link
            key={key}
            href={item.href}
            target={linkTarget(item.openInNewTab, item.href)}
            rel={linkRel(item.openInNewTab, item.href)}
            aria-label={item.label || item.icon || "Footer link"}
            className={`inline-flex items-center gap-2 transition ${theme.link}`}
          >
            {item.icon ? (
              <>
                {item.label ? <span className={textStyles.bodySmallSize}>{item.label}</span> : null}
                {!item.label ? <span className="sr-only">{item.icon}</span> : null}
                <Icon icon={item.icon} className="h-6 w-6 shrink-0" aria-hidden suppressHydrationWarning />
              </>
            ) : (
              <span className={textStyles.bodySmallSize}>{item.label}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function FooterBrandColumn({ column, theme }: { column: FooterBrandColumn; theme: FooterThemeClasses }) {
  return (
    <div>
      {column.logo ? (
        <Image
          src={column.logo.src}
          alt={column.logo.alt}
          width={200}
          height={48}
          className="h-10 max-w-[200px] object-contain object-left"
          style={{ width: "auto" }}
        />
      ) : null}
      {column.text ? (
        <p className={`mt-4 whitespace-pre-line ${textStyles.bodySmallSize} ${theme.bodyText}`}>{column.text}</p>
      ) : null}
    </div>
  );
}

function FooterLinksColumnBlock({
  column,
  theme,
}: {
  column: FooterLinksColumn;
  theme: FooterThemeClasses;
}) {
  const hasHeading = Boolean(column.heading);
  const hasItems = column.items.length > 0;

  if (!hasHeading && !hasItems) {
    return null;
  }

  return (
    <div>
      <FooterColumnHeading heading={column.heading} theme={theme} />
      <FooterColumnItems items={column.items} theme={theme} className={hasHeading ? "mt-3" : undefined} />
    </div>
  );
}

function FooterRightColumnBlock({
  column,
  theme,
  footerTheme,
}: {
  column: FooterRightColumn;
  theme: FooterThemeClasses;
  footerTheme: FooterTheme;
}) {
  if (column.layout === "links") {
    return <FooterLinksColumnBlock column={column} theme={theme} />;
  }

  const hasHeading = Boolean(column.heading);
  const hasAbove = Boolean(column.newsletterTextAbove);
  const hasBelow = Boolean(column.newsletterTextBelow);

  if (!hasHeading && !hasAbove && !hasBelow) {
    return (
      <div>
        <NewsletterForm theme={footerTheme} />
      </div>
    );
  }

  return (
    <div>
      <FooterColumnHeading heading={column.heading} theme={theme} />
      {column.newsletterTextAbove ? (
        <p className={`${hasHeading ? "mt-2" : ""} ${textStyles.bodySmallSize} ${theme.bodyText}`}>
          {column.newsletterTextAbove}
        </p>
      ) : null}
      <div className={hasHeading || hasAbove ? "mt-3" : undefined}>
        <NewsletterForm theme={footerTheme} />
      </div>
      {column.newsletterTextBelow ? (
        <p className={`mt-3 whitespace-pre-line ${textStyles.bodySmallSize} ${theme.bodyText}`}>
          {column.newsletterTextBelow}
        </p>
      ) : null}
    </div>
  );
}

export function SiteFooter({ config }: SiteFooterProps) {
  const theme = footerThemeClasses[config.theme];
  const heightClasses = footerHeightClasses[config.height];
  const footerStyle = config.backgroundColor ? { backgroundColor: config.backgroundColor } : undefined;

  return (
    <footer
      className={`mt-auto ${theme.text} ${config.backgroundColor ? "" : theme.footer}`}
      style={footerStyle}
    >
      <div
        className={`mx-auto grid max-w-6xl px-4 md:grid-cols-3 ${heightClasses.padding} ${heightClasses.gap}`}
      >
        <FooterBrandColumn column={config.brandColumn} theme={theme} />
        <FooterLinksColumnBlock column={config.middleColumn} theme={theme} />
        <FooterRightColumnBlock column={config.rightColumn} theme={theme} footerTheme={config.theme} />
      </div>
    </footer>
  );
}
