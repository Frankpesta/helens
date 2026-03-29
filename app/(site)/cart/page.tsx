"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import {
  primaryActionClickFeedback,
  subtleClickFeedback,
} from "@/lib/click-feedback";
import type { Id } from "@/convex/_generated/dataModel";

export default function CartPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = useQuery(
    api.products.getForCheckout,
    ids.length ? { ids } : "skip",
  );
  const byId = new Map(products?.map((p) => [p._id, p]) ?? []);
  let subtotal = 0;
  for (const l of lines) {
    const p = byId.get(l.productId);
    if (p) subtotal += p.priceCents * l.quantity;
  }

  function onCheckout(e: MouseEvent<HTMLButtonElement>) {
    if (lines.length === 0) return;
    primaryActionClickFeedback(e.currentTarget);
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl text-gold">Cart</h1>
      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Your cart is empty.{" "}
          <Link href="/shop" className="text-gold underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <ul className="mt-8 space-y-6 border-y border-border/50 py-8">
          {lines.map((l) => {
            const p = byId.get(l.productId);
            if (!p) return null;
            return (
              <li
                key={l.productId}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="font-medium hover:text-gold"
                >
                  {p.name}
                </Link>
                <div className="flex items-center gap-4 text-sm">
                  <input
                    type="number"
                    min={1}
                    className="w-14 border border-input bg-background px-2 py-1 text-center"
                    value={l.quantity}
                    onChange={(e) =>
                      setQty(
                        l.productId as Id<"products">,
                        Number(e.target.value) || 1,
                      )
                    }
                  />
                  <span className="text-gold w-24 text-right">
                    {formatMoney(p.priceCents * l.quantity)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {lines.length > 0 ? (
        <div className="mt-8 space-y-6">
          <p className="font-sans text-xs leading-relaxed text-muted-foreground">
            New formulas should be patch-tested for 24–48 hours. Product pages
            list full ingredients and usage guidance.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm">
            Subtotal{" "}
            <span className="text-gold">{formatMoney(subtotal)}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              className="origin-center"
              onClick={(e) => {
                subtleClickFeedback(e.currentTarget);
                clear();
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              className="origin-center bg-gold text-primary-foreground hover:bg-gold/90"
              onClick={onCheckout}
            >
              Checkout
            </Button>
          </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
