"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { animate } from "animejs";

type Slide = {
  alt: string;
  url: string;
  kind?: "before" | "after";
};

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BeforeAfterCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = paneRef.current;
    if (!el || reduceMotion) return;
    void animate(el, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 480,
      ease: "out(3)",
    });
  }, [i, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return;
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [reduceMotion, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[i]!;
  const label =
    slide.kind === "before" ? "Before"
    : slide.kind === "after" ? "After"
    : null;

  return (
    <div className="relative overflow-hidden border border-outline-variant/25 bg-surface-container-lowest">
      <div
        ref={paneRef}
        className="relative aspect-[4/3] w-full md:aspect-[5/4]"
      >
        <Image
          src={slide.url}
          alt={slide.alt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
        {label ? (
          <span className="absolute left-4 top-4 border border-gold/50 bg-surface/85 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
            {label}
          </span>
        ) : null}
      </div>
      {slides.length > 1 ? (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 rounded-none border border-outline-variant/30 bg-surface/80 text-gold hover:bg-surface"
              aria-label="Previous slide"
              onClick={() =>
                setI((n) => (n - 1 + slides.length) % slides.length)
              }
            >
              <ChevronLeft className="size-5" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 rounded-none border border-outline-variant/30 bg-surface/80 text-gold hover:bg-surface"
              aria-label="Next slide"
              onClick={() => setI((n) => (n + 1) % slides.length)}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
          <div className="flex justify-center gap-1.5 py-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === i
                    ? "w-8 bg-gold"
                    : "w-2 bg-outline-variant/50 hover:bg-gold/50",
                )}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
