import { RichText } from "@/components/content/RichText";
import { defaultInfoCards, type InfoCard } from "@/lib/site";
import { surfaceStyles, textStyles } from "@/lib/theme";

type InfoCardsProps = {
  items?: InfoCard[];
};

export function InfoCards({ items = defaultInfoCards }: InfoCardsProps) {
  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className={surfaceStyles.card}>
          <h3 className="font-heading text-lg font-bold uppercase italic text-brand">{item.title}</h3>
          <RichText className={`mt-2 ${textStyles.bodyCompact}`} value={item.description} />
        </div>
      ))}
    </div>
  );
}
