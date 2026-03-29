"use client";

import { GoldButton } from "@/components/site/gold-button";
import { cartAddClickFeedback } from "@/lib/click-feedback";
import { useCartStore } from "@/lib/cart-store";
import type { Id } from "@/convex/_generated/dataModel";

type Props = {
  productId: Id<"products">;
  quantity?: number;
  className?: string;
  size?: "default" | "sm" | "lg" | null;
};

export function AddToBagButton({
  productId,
  quantity = 1,
  className,
  size = "lg",
}: Props) {
  const add = useCartStore((s) => s.add);
  const pulseBag = useCartStore((s) => s.pulseBag);

  return (
    <GoldButton
      type="button"
      size={size}
      className={className}
      onClick={(e) => {
        add(productId, quantity);
        pulseBag();
        cartAddClickFeedback(e.currentTarget);
      }}
    >
      Add to bag
    </GoldButton>
  );
}
