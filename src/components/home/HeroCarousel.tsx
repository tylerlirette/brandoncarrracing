"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const slides = [
  { src: "/images/carousel-1.webp", alt: "Brandon Carr racing late models on track" },
  { src: "/images/carousel-2.webp", alt: "Race car on track under lights" },
  { src: "/images/carousel-3.webp", alt: "Short track racing action" },
  { src: "/images/carousel-4.webp", alt: "Stock car field at speed" },
] as const;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(next, 6500);
    return () => window.clearInterval(id);
  }, [next]);

  return (
    <div className="relative aspect-[21/9] min-h-[220px] w-full max-h-[min(70vh,720px)] overflow-hidden bg-black md:aspect-[3/1]">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        aria-hidden
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full border border-white/70 transition ${
              i === index ? "bg-brand scale-110" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
