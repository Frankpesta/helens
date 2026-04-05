"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { LoadingLogoScreen } from "@/components/site/loading-logo-screen";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const ctx = useQuery(api.customerCheckout.getCheckoutContext, {});
  const options = useQuery(api.shipping.listDeliveryOptions, {});
  const saveProfile = useMutation(api.customerCheckout.saveProfile);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [delivery, setDelivery] = useState("standard_worldwide");

  useEffect(() => {
    if (ctx === undefined) return;
    if (ctx.step === "sign-in") router.replace("/checkout/sign-in");
  }, [ctx, router]);

  useEffect(() => {
    const p =
      ctx?.step === "ready" ? ctx.profile
      : ctx?.step === "details" ? ctx.profile
      : null;
    if (!p) return;
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate profile from Convex */
    setFullName(p.fullName);
    setPhone(p.phone);
    setLine1(p.line1);
    setLine2(p.line2 ?? "");
    setCity(p.city);
    setRegion(p.region ?? "");
    setPostalCode(p.postalCode);
    setCountry(p.country);
    setDelivery(p.preferredDeliveryOption);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ctx]);

  const deliveryForForm =
    options && options.length > 0 ?
      options.some((o) => o.id === delivery) ?
        delivery
      : options[0]!.id
    : delivery;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        region: region.trim() || undefined,
        postalCode: postalCode.trim(),
        country: country.trim(),
        preferredDeliveryOption: deliveryForForm,
      });
      toast.success("Details saved");
      if (lines.length === 0) router.push("/account");
      else router.push("/checkout/summary");
    } catch {
      toast.error("Could not save — check delivery option and try again.");
    }
  }

  if (ctx === undefined || options === undefined) {
    return (
      <LoadingLogoScreen
        variant="site"
        size="compact"
        className="min-h-[40vh] pt-24 text-on-surface-variant"
      />
    );
  }

  if (ctx.step === "sign-in") {
    return (
      <LoadingLogoScreen
        variant="site"
        size="compact"
        srText="Redirecting"
        className="min-h-[40vh] pt-24 text-on-surface-variant"
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pt-32">
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
        Delivery details
      </p>
      <h1 className="font-heading mt-4 text-3xl text-on-surface">
        Where should we ship your order?
      </h1>
      <p className="mt-3 font-sans text-sm text-on-surface-variant">
        We ship internationally. Your delivery tier sets the fee shown on the
        next step before you pay.
      </p>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-10 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="line1">Address line 1</Label>
          <Input
            id="line1"
            required
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="line2">Address line 2 (optional)</Label>
          <Input
            id="line2"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-none border-outline-variant/40 bg-surface-container-low"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region / state (optional)</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-none border-outline-variant/40 bg-surface-container-low"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="postal">Postal code</Label>
            <Input
              id="postal"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="rounded-none border-outline-variant/40 bg-surface-container-low"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-none border-outline-variant/40 bg-surface-container-low"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery">Preferred delivery</Label>
          <select
            id="delivery"
            value={deliveryForForm}
            onChange={(e) => setDelivery(e.target.value)}
            className="flex h-11 w-full rounded-none border border-outline-variant/40 bg-surface-container-low px-3 font-sans text-sm text-on-surface"
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label} — +{(o.cents / 100).toFixed(2)} USD est.
              </option>
            ))}
          </select>
          <p className="font-sans text-xs text-on-surface-variant">
            {options.find((o) => o.id === deliveryForForm)?.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button
            type="submit"
            className="rounded-none gold-gradient px-8 font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
          >
            Continue to order summary
          </Button>
          <Button type="button" variant="ghost" asChild className="rounded-none">
            <Link href="/checkout/sign-in">Back</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
