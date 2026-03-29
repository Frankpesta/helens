"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function FloatImage({
  src,
  alt,
  className,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const loop = animate(el, {
      y: [0, -10, 0],
      duration: 5200,
      ease: "inOut(2)",
      loop: true,
    });
    return () => {
      loop.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <Image
        src={src}
        alt={alt}
        width={720}
        height={900}
        className="h-auto w-full object-contain drop-shadow-2xl"
        priority={priority}
      />
    </div>
  );
}
