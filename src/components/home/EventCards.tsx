import Image from "next/image";
import { defaultEventCards, type EventCard } from "@/lib/site";
import { headingStyles, textStyles } from "@/lib/theme";

type EventCardsProps = {
  items?: EventCard[];
};

export function EventCards({ items = defaultEventCards }: EventCardsProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="flex flex-col overflow-hidden rounded-sm bg-background shadow ring-1 ring-black/5"
        >
          <div className="relative h-28 bg-surface-subtle">
            <Image
              src={item.image}
              alt=""
              fill
              className="object-contain p-4"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className={`inline-flex w-fit bg-badge px-2 py-1 ${textStyles.meta} text-white`}>{item.date}</p>
            <h3 className={headingStyles.card}>{item.title}</h3>
            <p className="text-sm font-semibold text-body-emphasis">{item.subtitle}</p>
            <p className={`mt-auto ${textStyles.bodySmall}`}>{item.note}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
