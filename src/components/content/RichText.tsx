import { PortableText, type PortableTextComponents } from "@portabletext/react";

type RichTextValue = unknown;

type RichTextProps = {
  value?: RichTextValue;
  className?: string;
};

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-semibold text-brand underline-offset-2 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value, className }: RichTextProps) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return <p className={className}>{value}</p>;
  }

  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
