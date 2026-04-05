"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { LoadingLogoScreen } from "@/components/site/loading-logo-screen";

export default function CheckoutEntryPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const ctx = useQuery(api.customerCheckout.getCheckoutContext, {});

  useEffect(() => {
    if (lines.length === 0) {
      router.replace("/shop");
    }
  }, [lines.length, router]);

  useEffect(() => {
    if (lines.length === 0) return;
    if (ctx === undefined) return;
    if (ctx.step === "sign-in") router.replace("/checkout/sign-in");
    else if (ctx.step === "details") router.replace("/checkout/details");
    else router.replace("/checkout/summary");
  }, [ctx, lines.length, router]);

  return (
    <LoadingLogoScreen
      variant="site"
      size="compact"
      srText="Preparing checkout"
      className="min-h-[50vh] pt-24 text-on-surface-variant"
    />
  );
}
