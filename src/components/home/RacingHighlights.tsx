import Image from "next/image";
import { upcomingEvents, type UpcomingEvent } from "@/lib/site";

type RacingHighlightsProps = {
  events?: UpcomingEvent[];
};

export function RacingHighlights({ events = upcomingEvents }: RacingHighlightsProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <article
          key={event.title}
          className="flex flex-col overflow-hidden rounded-sm bg-white shadow ring-1 ring-black/5"
        >
          <div className="relative h-28 bg-zinc-100">
            <Image
              src={event.image}
              alt=""
              fill
              className="object-contain p-4"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className="inline-flex w-fit bg-zinc-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              {event.date}
            </p>
            <h3 className="font-heading text-lg font-bold uppercase italic leading-snug text-brand md:text-xl">
              {event.title}
            </h3>
            <p className="text-sm font-semibold text-zinc-700">{event.subtitle}</p>
            <p className="mt-auto text-xs leading-relaxed text-zinc-500">{event.note}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
