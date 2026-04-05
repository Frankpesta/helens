"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type LoadingLogoScreenProps = {
  /** Site token background vs admin shell */
  variant?: "site" | "admin";
  /** Full viewport vs shorter block for inside main content */
  size?: "full" | "compact";
  /**
   * Only the pulsating logo (no min-height or background). Use inside a parent
   * that already provides layout (e.g. fixed overlay).
   */
  logoOnly?: boolean;
  /** Screen reader status text */
  srText?: string;
  className?: string;
};

export function LoadingLogoScreen({
  variant = "site",
  size = "full",
  logoOnly = false,
  srText = "Loading",
  className,
}: LoadingLogoScreenProps) {
  const logo = (
    <>
      <div
        className={cn(
          "loading-logo-pulse relative",
          "h-16 w-[min(85vw,18rem)] sm:h-20 sm:w-[min(85vw,22rem)]",
        )}
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          className="object-contain object-center"
          priority
          sizes="(max-width: 640px) 85vw, 22rem"
        />
      </div>
      <span className="sr-only">{srText}</span>
    </>
  );

  if (logoOnly) {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={srText}
      >
        {logo}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        size === "full" && "min-h-screen w-full",
        size === "compact" && "min-h-[50vh] w-full py-16",
        variant === "site" && "bg-surface text-on-surface-variant",
        variant === "admin" && "bg-background text-muted-foreground",
        className,
      )}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={srText}
    >
      {logo}
    </div>
  );
}
