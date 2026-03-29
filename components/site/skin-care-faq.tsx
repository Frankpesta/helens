"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { skinCareFaq } from "@/lib/expert-skin-care-copy";
import { cn } from "@/lib/utils";

export function SkinCareFaqSection({ className }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className={cn("bg-surface-container-low py-16 sm:py-20 md:py-28", className)}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
            Questions we expect
          </p>
          <h2 className="mt-4 font-heading text-3xl text-on-surface sm:text-4xl">
            Straight answers on organic skin care
          </h2>
          <p className="mt-3 font-sans text-base text-on-surface-variant sm:text-lg">
            If you are navigating actives, prescriptions, or pregnancy,
            clinical guidance always wins—use this as context, not a substitute.
          </p>
        </div>
        <ul className="mx-auto mt-12 max-w-3xl divide-y divide-outline-variant/20 border border-outline-variant/20 bg-surface-container">
          {skinCareFaq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-container-high/40 sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                  onClick={() => setOpen((v) => (v === i ? null : i))}
                >
                  <span className="flex-1 font-heading text-lg text-on-surface sm:text-xl">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 size-5 shrink-0 text-gold transition-transform",
                      isOpen && "rotate-180",
                    )}
                    strokeWidth={1.5}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-outline-variant/15 px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                    <p className="font-sans text-base leading-relaxed text-on-surface-variant">
                      {item.a}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
