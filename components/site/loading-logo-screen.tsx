"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type LoadingLogoScreenProps = {
  /** Site token background vs admin shell */
  variant?: "site" | "admin";
  /** Full viewport vs shorter block for inside main content */
  size?: "full" | "compact";
  className?: string;
};

export function LoadingLogoScreen({
  variant = "site",
  size = "full",
  className,
}: LoadingLogoScreenProps) {
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
    >
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
      <span className="sr-only">Loading</span>
    </div>
  );
}
