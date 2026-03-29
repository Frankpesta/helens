"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger } from "animejs";
import type { JSAnimation } from "animejs";

type AnimateSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimateSection({
  children,
  className,
  delay = 0,
}: AnimateSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<JSAnimation | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nodes = root.querySelectorAll("[data-animate-child]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((n) => {
      const el = n as HTMLElement;
      if (reduced) {
        el.style.opacity = "1";
        el.style.transform = "none";
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
      }
    });
    if (!nodes.length || reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        animRef.current = animate(nodes, {
          opacity: [0, 1],
          y: [24, 0],
          duration: 800,
          delay: stagger(90, { start: delay }),
          ease: "out(2)",
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      animRef.current?.revert();
      animRef.current = null;
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
