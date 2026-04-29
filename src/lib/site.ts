export const INSTAGRAM_URL = "https://www.instagram.com/brandon_carr_racing/";

export type RichTextContent = string | Array<Record<string, unknown>>;

export type FeatureCard = {
  title: string;
  description: RichTextContent;
  href: string;
  image: string;
};

export type PressArticle = {
  title: string;
  source: string;
  date: string;
  excerpt: string;
  href: string;
};

export type UpcomingEvent = {
  title: string;
  subtitle: string;
  date: string;
  image: string;
  note: string;
};

export type TeamCard = {
  title: string;
  description: RichTextContent;
};

export type HeroSlide = {
  src: string;
  alt: string;
};

export const heroSlides = [
  { src: "/images/carousel-1.webp", alt: "Brandon Carr racing late models on track" },
  { src: "/images/carousel-2.webp", alt: "Race car on track under lights" },
  { src: "/images/carousel-3.webp", alt: "Short track racing action" },
  { src: "/images/carousel-4.webp", alt: "Stock car field at speed" },
] satisfies HeroSlide[];

export const pressArticles = [
  {
    title: "Dudley, Carr make history with IHRA Stock Car victories",
    source: "IHRA",
    date: "March 2026",
    excerpt:
      "Brandon Carr became one of the first-ever winners in the IHRA Stock Car Series, taking the 100-lap Pro Late Model feature at Pulaski County Motorsports Park.",
    href: "https://ihra.com/news/dudley-carr-make-history-with-ihra-stock-car-victories",
  },
  {
    title: "Brandon Carr taking karting experience to Xtreme Outlaw Midgets rookie season",
    source: "Speedway Digest",
    date: "2025",
    excerpt:
      "The British karting champion moved from UK pavement to US dirt ovals with Keith Kunz/Curb-Agajanian Motorsports, chasing Rookie of the Year with the Xtreme Outlaw Midget Series.",
    href: "https://speedwaydigest.com/index.php/news/racing-news/413469-brandon-carr-taking-karting-experience-to-xtreme-outlaw-midgets-rookie-season/",
  },
] satisfies PressArticle[];

export const careerHighlights = [
  "British Karting Champion",
  "British Kartmasters Champion",
  "POWRi Midget feature winner",
  "IHRA Stock Car Series winner — 2026 season opener (Pro Late Model)",
  "Late Model Stock Car winner — Setzer Racing",
  "Multiple Midget A-Main starts with Keith Kunz Motorsports",
  "National-level competition in karting, midgets, and late models",
] as string[];

export const upcomingEvents = [
  {
    title: "IHRA Stock Car Series",
    subtitle: "Cordele Speedway — South Georgia",
    date: "April 18, 2026",
    image: "/images/tri-country.webp",
    note: "Next series stop; see IHRA for tickets and updates.",
  },
  {
    title: "Late Model Stock Cars",
    subtitle: "Setzer Racing & Development",
    date: "2026 schedule",
    image: "/images/south-boston.webp",
    note: "Southeast short tracks — follow announcements on social.",
  },
  {
    title: "Selected ARCA Racing Series",
    subtitle: "NASCAR development ladder",
    date: "Dates TBA",
    image: "/images/orange-county.webp",
    note: "Part of the progression toward national NASCAR divisions.",
  },
] satisfies UpcomingEvent[];

export const featureCards = [
  {
    title: "About",
    description: "Learn more about Brandon Carr",
    href: "#about",
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
] satisfies FeatureCard[];

export const teamCards = [
  {
    title: "Keith Kunz Motorsports",
    description: "National midget competition — A-Mains and feature events across the US.",
  },
  {
    title: "Setzer Racing & Development",
    description: "Late model stock car races on Southeast short tracks, including the IHRA Stock Car Series.",
  },
] satisfies TeamCard[];
