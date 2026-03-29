"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, Suspense } from "react";
import { formatMoney } from "@/lib/format";

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const order = useQuery(
    api.orders.getByCheckoutSession,
    sessionId ? { sessionId } : "skip",
  );
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (order?.status === "paid") clear();
  }, [order?.status, clear]);

  if (!sessionId) {
    return (
      <p className="text-sm text-muted-foreground">
        Missing checkout session.{" "}
        <Link href="/shop" className="text-gold underline">
          Return to shop
        </Link>
      </p>
    );
  }

  if (order === undefined) {
    return <p className="text-sm text-muted-foreground">Confirming order…</p>;
  }

  if (!order || order.status !== "paid") {
    return (
      <p className="text-sm text-muted-foreground">
        We could not confirm payment yet. If you completed checkout, please wait
        a moment or contact support.{" "}
        <Link href="/shop" className="text-gold underline">
          Shop
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-[0.25em] text-gold">
        Thank you
      </p>
      <h1 className="font-heading text-3xl text-foreground">
        Your order is confirmed
      </h1>
      <p className="text-sm text-muted-foreground">
        Confirmation sent to {order.email ?? "your email"}.
        {order.amountTotalCents != null
          ? ` Total ${formatMoney(order.amountTotalCents, order.currency ?? "USD")}.`
          : ""}
      </p>
      <ul className="space-y-2 border border-border/40 bg-card/20 p-4 text-sm">
        {order.lineItems.map((li) => (
          <li key={li.slug} className="flex justify-between gap-4">
            <span>
              {li.name} × {li.quantity}
            </span>
            <span className="text-gold">
              {formatMoney(li.unitAmountCents * li.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <Link href="/shop" className="inline-block text-gold underline">
        Continue shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <SuccessInner />
      </Suspense>
    </div>
  );
}
