"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { animate } from "animejs";
import { toast } from "sonner";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function CheckoutSummaryPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const ctx = useQuery(api.customerCheckout.getCheckoutContext, {});
  const options = useQuery(api.shipping.listDeliveryOptions, {});
  const updateDelivery = useMutation(
    api.customerCheckout.updateDeliveryPreference,
  );
  const checkout = useAction(api.checkout.createCheckoutSession);

  const [deliveryOverride, setDeliveryOverride] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const payWrapRef = useRef<HTMLDivElement>(null);

  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = useQuery(
    api.products.getForCheckout,
    ids.length ? { ids } : "skip",
  );
  const linePreviews = useQuery(
    api.products.getCheckoutLinePreviews,
    lines.length ? { productIds: lines.map((l) => l.productId) } : "skip",
  );
  const byId = new Map(products?.map((p) => [p._id, p]) ?? []);

  useEffect(() => {
    if (lines.length === 0) router.replace("/shop");
  }, [lines.length, router]);

  useEffect(() => {
    if (ctx === undefined) return;
    if (ctx.step === "sign-in") router.replace("/checkout/sign-in");
    if (ctx.step === "details") router.replace("/checkout/details");
  }, [ctx, router]);

  const deliveryOption =
    ctx?.step === "ready" ?
      (deliveryOverride ?? ctx.profile.preferredDeliveryOption)
    : null;

  let subtotal = 0;
  for (const l of lines) {
    const p = byId.get(l.productId);
    if (p) subtotal += p.priceCents * l.quantity;
  }

  const feeCents =
    deliveryOption ?
      (options?.find((o) => o.id === deliveryOption)?.cents ?? 0)
    : 0;
  const total = subtotal + feeCents;

  async function onDeliveryChange(id: string) {
    setDeliveryOverride(id);
    try {
      await updateDelivery({ preferredDeliveryOption: id });
    } catch {
      /* ignore — summary still uses local selection for pay */
    }
  }

  async function onPay() {
    if (lines.length === 0 || !deliveryOption) return;
    const btn = payWrapRef.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (btn && !reduce) {
      void animate(btn, {
        scale: [1, 0.98, 1],
        duration: 420,
        ease: "out(3)",
      });
    }
    setLoading(true);
    const origin = window.location.origin;
    try {
      const { url } = await checkout({
        items: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        })),
        deliveryOption,
        successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/checkout/cancel`,
      });
      window.location.href = url;
    } catch (e) {
      setLoading(false);
      const msg = e instanceof Error ? e.message : "Checkout failed.";
      toast.error(msg);
    }
  }

  if (
    ctx === undefined ||
    options === undefined ||
    ctx.step !== "ready" ||
    deliveryOption === null
  ) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center pt-24 text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32 pt-28 md:px-10 md:pt-32">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
        <div className="lg:col-span-7">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
            Order summary
          </p>
          <h1 className="font-heading mt-4 text-3xl text-on-surface md:text-4xl">
            Review your order
          </h1>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-on-surface-variant">
            Confirm products and delivery below. You will complete payment on a
            secure Stripe checkout page.
          </p>

          <div className="mt-10 border border-outline-variant/20 bg-surface-container-low/30">
            <div className="divide-y divide-outline-variant/15">
              {lines.map((l, index) => {
                const p = byId.get(l.productId);
                if (!p) return null;
                const preview = linePreviews?.[index];
                const imageUrl =
                  preview?.imageUrl ??
                  p.heroImagePath ??
                  "/products/placeholder.svg";
                const imageAlt = preview?.imageAlt ?? p.name;
                const lineTotal = p.priceCents * l.quantity;

                return (
                  <div
                    key={`${l.productId}-${index}`}
                    className="flex gap-4 p-4 md:gap-5 md:p-6"
                  >
                    <Link
                      href={`/product/${p.slug}`}
                      className="group relative h-28 w-24 shrink-0 overflow-hidden bg-surface-container-low md:h-32 md:w-28"
                      aria-label={`View ${p.name}`}
                    >
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="120px"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="min-w-0 space-y-1.5">
                        <Link
                          href={`/product/${p.slug}`}
                          className="font-heading text-base leading-snug text-on-surface transition-colors hover:text-gold md:text-lg"
                        >
                          {p.name}
                        </Link>
                        <p className="line-clamp-2 font-sans text-xs leading-relaxed text-on-surface-variant md:text-sm">
                          {p.tagline}
                        </p>
                        <p className="font-sans text-xs tabular-nums text-on-surface-variant">
                          {formatMoney(p.priceCents)}{" "}
                          <span className="text-on-surface-variant/70">
                            each
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <span className="inline-flex min-w-[2.5rem] items-center justify-center border border-outline-variant/35 bg-surface/60 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                          {l.quantity}
                        </span>
                        <p className="font-heading text-lg tabular-nums text-gold md:text-xl">
                          {formatMoney(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-heading text-xl text-on-surface">
              Delivery speed
            </h2>
            <p className="mt-1 font-sans text-xs text-on-surface-variant">
              International service levels — fee is added as its own line in
              checkout.
            </p>
            <ul className="mt-5 space-y-2.5">
              {options.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => void onDeliveryChange(o.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-none border px-4 py-3.5 text-left transition-colors",
                      deliveryOption === o.id ?
                        "border-gold/60 bg-surface-container-high shadow-[inset_0_0_0_1px_rgba(212,175,55,0.12)]"
                      : "border-outline-variant/25 bg-surface-container-low/20 hover:border-outline-variant/45",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1 size-2.5 shrink-0 rounded-full border-2",
                        deliveryOption === o.id ?
                          "border-gold bg-gold"
                        : "border-outline-variant/60 bg-transparent",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-sans text-sm font-medium text-on-surface">
                          {o.label}
                        </span>
                        <span className="font-sans text-sm tabular-nums text-gold">
                          +{formatMoney(o.cents)}
                        </span>
                      </span>
                      <span className="mt-1 block font-sans text-xs leading-relaxed text-on-surface-variant">
                        {o.description}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="mt-12 lg:col-span-5 lg:mt-0">
          <div className="sticky top-28 border border-outline-variant/25 bg-surface-container-low/50 p-6 md:p-8">
            <h2 className="font-heading text-lg text-on-surface">
              Summary
            </h2>
            <div className="mt-6 space-y-3 font-sans text-sm">
              <div className="flex justify-between gap-4 text-on-surface-variant">
                <span>Subtotal</span>
                <span className="tabular-nums text-on-surface">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-on-surface-variant">
                <span>Shipping</span>
                <span className="tabular-nums text-on-surface">
                  {formatMoney(feeCents)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-outline-variant/20 pt-4 font-heading text-lg text-on-surface">
                <span>Total</span>
                <span className="tabular-nums text-gold">{formatMoney(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-none border border-outline-variant/15 bg-surface/40 p-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold/90">
                Ship to
              </p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-on-surface-variant">
                {ctx.profile.fullName}
                <br />
                {ctx.profile.line1}
                {ctx.profile.line2 ? `, ${ctx.profile.line2}` : ""}
                <br />
                {ctx.profile.city}
                {ctx.profile.region ? `, ${ctx.profile.region}` : ""}{" "}
                {ctx.profile.postalCode}
                <br />
                {ctx.profile.country}
              </p>
              <Link
                href="/checkout/details"
                className="mt-3 inline-flex items-center gap-1 font-sans text-xs text-gold underline-offset-4 hover:underline"
              >
                Edit address
                <ChevronRight className="size-3" strokeWidth={2} />
              </Link>
            </div>

            <div className="mt-6 flex items-start gap-2.5 text-on-surface-variant">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-gold/80"
                strokeWidth={1.25}
              />
              <p className="font-sans text-xs leading-relaxed">
                Encrypted checkout powered by Stripe. We never store your full
                card number.
              </p>
            </div>

            <div ref={payWrapRef} className="mt-8">
              <Button
                type="button"
                disabled={loading}
                className="h-12 w-full rounded-none gold-gradient font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
                onClick={() => void onPay()}
              >
                {loading ? "Redirecting to Stripe…" : "Proceed to payment"}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
