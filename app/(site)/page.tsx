"use client";

import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GoldButton } from "@/components/site/gold-button";
import { formatMoney } from "@/lib/format";
import { StarRating } from "@/components/site/star-rating";
import { useCartStore } from "@/lib/cart-store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  CredentialsStrip,
  FormulationPillarsGrid,
  RoutineBand,
} from "@/components/site/expert-blocks";
import { SkinCareFaqSection } from "@/components/site/skin-care-faq";
import { HeroBackgroundCarousel } from "@/components/site/hero-background-carousel";
import {
  homeHero,
  homeNewsletter,
  homeTestimonials,
  homeValues,
} from "@/lib/home-page-static";
import { cartAddClickFeedback } from "@/lib/click-feedback";

export default function HomePage() {
  const router = useRouter();
  const settings = useQuery(api.siteSettings.getMain);
  const products = useQuery(api.products.listActive);
  const featured = useQuery(
    api.products.getByIds,
    settings?.featuredProductIds?.length ?
      { ids: settings.featuredProductIds }
    : "skip",
  );
  const add = useCartStore((s) => s.add);
  const pulseBag = useCartStore((s) => s.pulseBag);
  const subscribeNewsletter = useMutation(api.newsletter.subscribe);
  const [ti, setTi] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSending, setNewsletterSending] = useState(false);

  const t = homeTestimonials[ti % homeTestimonials.length];

  if (!settings || !products) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center pt-24 text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  const rowTop =
    featured && featured.length > 0 ? featured : products.slice(0, 2);
  const rest = products.filter((p) => !rowTop.some((x) => x._id === p._id));
  const rowBottom = rest.slice(0, 3);

  const large = rowTop[0];
  const side = rowTop[1];

  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      <section className="relative flex min-h-dvh items-center overflow-hidden pt-20 sm:pt-24">
        <HeroBackgroundCarousel />
        <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-surface via-surface/55 to-transparent" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl">
            <span className="mb-4 block font-sans text-xs font-medium uppercase tracking-[0.2em] text-gold sm:mb-6 sm:text-sm">
              {homeHero.eyebrow}
            </span>
            <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface text-shadow-hero sm:text-5xl sm:leading-none md:text-7xl md:leading-none">
              {homeHero.titleLine1}
              <br />
              <span className="font-normal italic text-gold">
                {homeHero.titleLine2Gold}
              </span>
            </h1>
            <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-on-surface-variant sm:mt-8 sm:text-lg md:text-xl">
              {homeHero.description}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 md:gap-8">
              <GoldButton
                type="button"
                size="lg"
                onClick={() => router.push("/shop")}
              >
                {homeHero.ctaShop}
              </GoldButton>
              <Link
                href="/about"
                className="group flex items-center gap-3 font-sans text-base font-semibold uppercase tracking-[0.2em] text-gold"
              >
                {homeHero.ctaStory}
                <span className="h-px w-12 bg-gold transition-all group-hover:w-16" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CredentialsStrip />

      <section className="bg-surface py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:mb-20 md:flex-row md:items-end md:gap-8">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl font-bold text-on-surface sm:text-4xl md:text-5xl">
                Featured products
              </h2>
              <p className="mt-3 font-sans text-base text-on-surface-variant sm:mt-4 sm:text-lg">
                Concentrated, certified-organic-forward formulas for cleanse,
                treat, moisturize, and protect—chosen for daily regimens that
                respect barrier health.
              </p>
            </div>
            <span className="hidden font-heading text-base italic text-gold md:block">
              Est. 2024
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-8">
            {large ?
              <div className="flex flex-col items-center gap-6 bg-surface-container p-6 sm:gap-8 sm:p-8 md:col-span-7 md:flex-row md:p-12">
                <Link
                  href={`/product/${large.slug}`}
                  className="relative aspect-4/5 w-full overflow-hidden md:w-1/2"
                >
                  <Image
                    src={large.heroImagePath ?? "/products/placeholder.svg"}
                    alt={large.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 35vw, 100vw"
                  />
                </Link>
                <div className="w-full md:w-1/2">
                  <span className="mb-4 block font-sans text-sm uppercase tracking-[0.2em] text-gold">
                    Best seller
                  </span>
                  <h3 className="font-heading text-2xl text-on-surface sm:text-3xl">
                    <Link
                      href={`/product/${large.slug}`}
                      className="hover:text-gold"
                    >
                      {large.name}
                    </Link>
                  </h3>
                  <p className="mt-3 font-sans text-base leading-relaxed text-on-surface-variant">
                    {large.description.replace(/\*\*/g, "").slice(0, 160)}
                    …
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-6">
                    <span className="font-heading text-xl text-on-surface">
                      {formatMoney(large.priceCents)}
                    </span>
                    <button
                      type="button"
                      className="origin-center font-sans text-sm font-bold uppercase tracking-[0.2em] text-gold hover:underline"
                      onClick={(e) => {
                        add(large._id as Id<"products">, 1);
                        pulseBag();
                        cartAddClickFeedback(e.currentTarget);
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            : null}

            {side ?
              <div className="flex flex-col justify-between bg-surface-container-low p-6 sm:p-8 md:col-span-5">
                <div className="relative mb-8 aspect-square overflow-hidden">
                  <Link href={`/product/${side.slug}`}>
                    <Image
                      src={side.heroImagePath ?? "/products/placeholder.svg"}
                      alt={side.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                  </Link>
                </div>
                <div>
                  <span className="mb-2 block font-sans text-sm uppercase tracking-[0.2em] text-gold">
                    Staff pick
                  </span>
                  <h3 className="font-heading text-2xl text-on-surface">
                    <Link
                      href={`/product/${side.slug}`}
                      className="hover:text-gold"
                    >
                      {side.name}
                    </Link>
                  </h3>
                  <p className="mb-6 mt-2 font-sans text-base text-on-surface-variant">
                    {side.tagline}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg">
                      {formatMoney(side.priceCents)}
                    </span>
                    <button
                      type="button"
                      className="origin-center font-sans text-sm font-bold uppercase tracking-[0.2em] text-gold hover:underline"
                      onClick={(e) => {
                        add(side._id as Id<"products">, 1);
                        pulseBag();
                        cartAddClickFeedback(e.currentTarget);
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            : null}

            {rowBottom.map((p, i) => (
              <div
                key={p._id}
                className={cn(
                  "flex flex-col justify-between p-6 sm:p-8 md:col-span-4",
                  i % 2 === 0 ?
                    "bg-surface-container-low"
                  : "bg-surface-container",
                )}
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="relative mb-8 aspect-square overflow-hidden"
                >
                  <Image
                    src={p.heroImagePath ?? "/products/placeholder.svg"}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    sizes="(min-width: 768px) 30vw, 100vw"
                  />
                </Link>
                <div>
                  <h3 className="font-heading text-2xl text-on-surface">
                    <Link href={`/product/${p.slug}`} className="hover:text-gold">
                      {p.name}
                    </Link>
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-heading text-lg">
                      {formatMoney(p.priceCents)}
                    </span>
                    <button
                      type="button"
                      className="origin-center font-sans text-sm font-bold uppercase tracking-[0.2em] text-gold hover:underline"
                      onClick={(e) => {
                        add(p._id as Id<"products">, 1);
                        pulseBag();
                        cartAddClickFeedback(e.currentTarget);
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FormulationPillarsGrid />

      <RoutineBand />

      <section
        id="standards"
        className="relative overflow-hidden bg-surface-container-lowest py-16 sm:py-20 md:py-32"
      >
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 opacity-20 md:block">
          <Image
            src="/products/face-cream.png"
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 items-center gap-12 sm:gap-16 md:grid-cols-2 md:gap-20">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl font-bold leading-tight text-on-surface sm:text-4xl md:text-6xl md:leading-tight">
                Our standard for
                <br />
                <span className="font-normal italic text-gold">
                  {homeValues.title}
                </span>
              </h2>
              <p className="mt-4 max-w-lg font-sans text-base text-on-surface-variant sm:text-lg">
                {homeValues.subtitle}
              </p>
              <div className="mt-12 space-y-10">
                {homeValues.items.map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <span className="font-heading text-2xl text-gold pt-1">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="font-heading text-xl text-on-surface">
                        {item.title}
                      </h4>
                      <p className="mt-2 font-sans leading-relaxed text-on-surface-variant">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex flex-wrap gap-3">
                {[
                  "No parabens",
                  "Verified suppliers",
                  "Stability tested",
                ].map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-gold/25 bg-surface-container-low px-5 py-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant sm:text-sm"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-4 text-center sm:px-6 md:px-12">
          <div className="mx-auto max-w-4xl">
            <StarRating className="mx-auto mb-8 justify-center gap-0.5 text-gold" />
            <blockquote className="font-heading text-xl italic leading-relaxed text-on-surface sm:text-2xl md:text-4xl md:leading-snug">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="font-sans text-base font-semibold uppercase tracking-[0.2em] text-gold">
                {t.author}
              </p>
              <p className="font-sans text-sm text-on-surface-variant">
                {t.title}
              </p>
            </div>
            <div className="mt-12 flex justify-center gap-3">
              <button
                type="button"
                className="flex size-12 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:border-gold hover:bg-gold hover:text-primary-foreground"
                aria-label="Previous testimonial"
                onClick={() =>
                  setTi(
                    (i) =>
                      (i - 1 + homeTestimonials.length) % homeTestimonials.length,
                  )
                }
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                className="flex size-12 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:border-gold hover:bg-gold hover:text-primary-foreground"
                aria-label="Next testimonial"
                onClick={() =>
                  setTi((i) => (i + 1) % homeTestimonials.length)
                }
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SkinCareFaqSection />

      <section className="border-t border-outline-variant/15 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col items-center justify-between gap-8 bg-surface-container-high p-6 sm:gap-10 sm:p-10 md:flex-row md:p-16">
            <div className="max-w-md text-center md:text-left">
              <h3 className="font-heading text-xl text-on-surface sm:text-2xl md:text-3xl">
                {homeNewsletter.heading}
              </h3>
              <p className="mt-3 font-sans text-on-surface-variant">
                {homeNewsletter.supporting}
              </p>
            </div>
            <form
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setNewsletterSending(true);
                void subscribeNewsletter({
                  email: newsletterEmail,
                  source: "home",
                })
                  .then((r) => {
                    if (r.alreadySubscribed) {
                      toast.message("You’re already on the list", {
                        description: "We’ll keep the tips coming.",
                      });
                    } else {
                      toast.success("You’re subscribed", {
                        description: "Watch your inbox for skin care tips.",
                      });
                      setNewsletterEmail("");
                    }
                  })
                  .catch((err: Error) =>
                    toast.error(err.message ?? "Could not subscribe"),
                  )
                  .finally(() => setNewsletterSending(false));
              }}
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={homeNewsletter.placeholder}
                autoComplete="email"
                className="h-12 w-full border-0 bg-surface-container-lowest px-5 font-sans text-base text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-gold md:w-72"
              />
              <GoldButton
                type="submit"
                disabled={newsletterSending}
                className="h-12 min-h-12 w-full sm:w-auto disabled:opacity-60"
              >
                {newsletterSending ? "Sending…" : "Subscribe"}
              </GoldButton>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
