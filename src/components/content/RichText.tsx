import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { isExternalHref, sanitizeHref } from "@/lib/href";
import type { SectionTheme } from "@/lib/section";
import { sectionThemeClasses } from "@/lib/section";
import { headingStyles, headingVoice, textStyles } from "@/lib/theme";
import Link from "next/link";
import type { ReactNode } from "react";

type RichTextValue = unknown;

type RichTextProps = {
  value?: RichTextValue;
  className?: string;
  /** When set, headings and body use section light/dark colors (profile-style). */
  theme?: SectionTheme;
};

function buildComponents(theme?: SectionTheme): PortableTextComponents {
  const headingClass = theme ? sectionThemeClasses[theme].heading : headingStyles.page;
  const bodyClass = theme ? sectionThemeClasses[theme].subheading : textStyles.body;
  const listClass =
    theme === "dark"
      ? "text-[length:var(--text-body)] text-inverse"
      : textStyles.list;
  // Without a theme, paragraphs inherit color/size from the wrapper className (hero, cards, etc.).
  const paragraphClass = theme
    ? `${bodyClass} [&:not(:first-child)]:mt-3`
    : "[&:not(:first-child)]:mt-3";

  return {
    block: {
      normal: ({ children }) => <p className={paragraphClass}>{children}</p>,
      h1: ({ children }) => (
        <h1 className={`${headingClass} mb-4 [&:not(:first-child)]:mt-8`}>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className={`${headingClass} mb-4 [&:not(:first-child)]:mt-8`}>{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className={`${headingStyles.card} mb-3 [&:not(:first-child)]:mt-6`}>{children}</h3>
      ),
      h4: ({ children }) => (
        <h4
          className={`font-heading text-[length:var(--text-heading-card)] ${headingVoice} tracking-wide ${
            theme === "dark" ? "text-white" : "text-foreground"
          } mb-2 md:text-[length:var(--text-heading-card-md)] [&:not(:first-child)]:mt-5`}
        >
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={`border-l-4 border-brand pl-4 ${theme ? bodyClass : ""} [&:not(:first-child)]:mt-4`}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`grid gap-3 ${listClass} [&:not(:first-child)]:mt-4`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`grid list-decimal gap-3 pl-5 ${listClass} [&:not(:first-child)]:mt-4`}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
          <span>{children}</span>
        </li>
      ),
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className={theme === "dark" ? "font-semibold text-white" : "font-semibold text-body-emphasis"}>
          {children}
        </strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
      "strike-through": ({ children }) => <span className="line-through">{children}</span>,
      code: ({ children }) => (
        <code className="rounded bg-surface-subtle px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
      ),
      link: ({ children, value }) => {
        const href = sanitizeHref(typeof value?.href === "string" ? value.href : undefined);
        if (!href) {
          return <span>{children}</span>;
        }

        if (isExternalHref(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
          return (
            <a
              href={href}
              target={isExternalHref(href) ? "_blank" : undefined}
              rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              {children}
            </a>
          );
        }

        return (
          <Link href={href} className="font-semibold text-brand underline-offset-2 hover:underline">
            {children}
          </Link>
        );
      },
    },
  };
}

export function RichText({ value, className, theme }: RichTextProps): ReactNode {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const textClass = theme ? sectionThemeClasses[theme].subheading : undefined;
    return <p className={[textClass, className].filter(Boolean).join(" ")}>{value}</p>;
  }

  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={buildComponents(theme)} />
    </div>
  );
}
