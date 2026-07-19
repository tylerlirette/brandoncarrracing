import { ContentCard } from "@/components/content/ContentCard";
import { RichText } from "@/components/content/RichText";
import type { ColumnComponent, ColumnImageAspectRatio } from "@/lib/columnLayout";
import { columnImageAspectClasses } from "@/lib/columnLayout";
import type { SectionTheme } from "@/lib/section";
import { radiusStyles } from "@/lib/theme";
import Image from "next/image";
import type { ReactNode } from "react";

type ColumnComponentViewProps = {
  component: ColumnComponent;
  theme: SectionTheme;
};

function ImageComponent({
  image,
  imageAlt,
  aspectRatio,
}: {
  image: string;
  imageAlt?: string;
  aspectRatio: ColumnImageAspectRatio;
}) {
  const aspectClass = columnImageAspectClasses[aspectRatio];

  if (aspectRatio === "auto") {
    return (
      <div className={`overflow-hidden ${radiusStyles.element} bg-surface-subtle`}>
        <Image
          src={image}
          alt={imageAlt?.trim() || "Content image"}
          width={1200}
          height={800}
          className="h-auto w-full object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${aspectClass} ${radiusStyles.element} bg-surface-subtle`}>
      <Image
        src={image}
        alt={imageAlt?.trim() || "Content image"}
        fill
        className="object-cover"
        sizes="(max-width:768px) 100vw, 50vw"
      />
    </div>
  );
}

export function ColumnComponentView({ component, theme }: ColumnComponentViewProps): ReactNode {
  switch (component._type) {
    case "columnCard":
      return <ContentCard card={component} />;
    case "columnImage":
      return component.image ? (
        <ImageComponent
          image={component.image}
          imageAlt={component.imageAlt}
          aspectRatio={component.aspectRatio}
        />
      ) : null;
    case "columnRichText":
      return <RichText theme={theme} value={component.text} />;
    default:
      return null;
  }
}
