import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value = 5,
  className,
}: {
  value?: number;
  className?: string;
}) {
  const full = Math.round(value);
  return (
    <div className={cn("flex gap-0.5 text-gold", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4 text-gold",
            i < full ? "fill-current" : "fill-none opacity-35",
          )}
        />
      ))}
    </div>
  );
}
