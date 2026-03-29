"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  HERO_BACKGROUND_CAROUSEL_IMAGES,
  HERO_CAROUSEL_INTERVAL_MS,
} from "@/lib/hero-carousel-images";

export function HeroBackgroundCarousel({
  className,
}: {
  className?: string;
}) {
  const slides = HERO_BACKGROUND_CAROUSEL_IMAGES;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, HERO_CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className={cn("absolute inset-0 z-0", className)}
      aria-hidden
    >
      {slides.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1400 ease-in-out",
            i === active ? "z-10 opacity-100" : "z-0 opacity-0",
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            className={cn(
              "object-cover brightness-50",
              i === active && "hero-ken-burns",
            )}
            sizes="100vw"
            priority={i === 0}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
