import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    title: "About",
    description: "Learn more about Brandon Carr",
    href: "#profile",
    image: "/images/about.webp",
  },
  {
    title: "Teams & series",
    description: "Keith Kunz midgets & Setzer late models",
    href: "#teams",
    image: "/images/series.webp",
  },
  {
    title: "Partners",
    description: "Sponsorship and hospitality opportunities",
    href: "#partners",
    image: "/images/shop.webp",
  },
] as const;

export function FeatureCards() {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group relative isolate flex min-h-[280px] overflow-hidden rounded-sm shadow-md ring-1 ring-black/5 transition hover:shadow-lg md:min-h-[320px]"
        >
          <Image
            src={card.image}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/25 transition duration-300 group-hover:bg-brand/85" />
          <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
            <h3 className="font-heading text-3xl font-bold uppercase italic tracking-tight md:text-4xl">
              {card.title}
            </h3>
            <p className="mt-2 max-w-xs text-sm font-medium italic text-white/90 opacity-0 transition duration-300 group-hover:opacity-100">
              {card.description}
            </p>
            <span className="mt-4 inline-flex w-fit items-center bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand opacity-0 transition duration-300 group-hover:opacity-100">
              Learn more
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
