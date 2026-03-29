"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

const goldBtn = cva(
  "relative inline-flex origin-center items-center justify-center overflow-hidden font-semibold uppercase tracking-[0.2em] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:pointer-events-none disabled:opacity-50 rounded-none text-primary-foreground",
  {
    variants: {
      size: {
        default: "min-h-12 px-8 py-4 text-sm",
        lg: "min-h-14 px-10 py-5 text-sm md:text-base",
        sm: "min-h-10 px-6 py-3 text-xs sm:text-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export const GoldButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof goldBtn>
>(function GoldButton(
  { className, size, children, onClick, disabled, type = "button", ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLButtonElement>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef && "current" in forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
      }
    },
    [forwardedRef],
  );

  useEffect(() => {
    const btn = innerRef.current;
    if (!btn || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const onEnter = () => {
      void animate(btn, { scale: [1, 1.02], duration: 220, ease: "out(2)" });
    };
    const onLeave = () => {
      void animate(btn, { scale: [1.02, 1], duration: 260, ease: "out(3)" });
    };
    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <button
      ref={setRefs}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        goldBtn({ size }),
        "gold-gradient hover:opacity-90 active:scale-[0.98]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

GoldButton.displayName = "GoldButton";
