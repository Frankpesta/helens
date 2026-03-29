"use client";

import { use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import { RichDescription } from "@/components/site/rich-description";
import { StarRating } from "@/components/site/star-rating";
import { AddToBagButton } from "@/components/site/add-to-bag-button";
import { BeforeAfterCarousel } from "@/components/site/before-after-carousel";
import type { Id } from "@/convex/_generated/dataModel";
import Script from "next/script";
import { Sparkles, Droplets, Shield } from "lucide-react";
import { ProductExpertDisclaimerBand } from "@/components/site/expert-blocks";

const featureIcons = [Sparkles, Droplets, Shield];

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = useQuery(api.products.getBySlug, { slug });
  const gallery = useQuery(
    api.products.getGallery,
    product ? { productId: product._id } : "skip",
  );
  const beforeAfter = useQuery(
    api.products.getBeforeAfterGallery,
    product ? { productId: product._id } : "skip",
  );

  const jsonLd = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description.replace(/\*\*/g, ""),
      image: product.heroImagePath
        ? `${typeof window !== "undefined" ? window.location.origin : ""}${product.heroImagePath}`
        : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: product.currency,
        price: (product.priceCents / 100).toFixed(2),
        availability: "https://schema.org/InStock",
      },
    };
  }, [product]);

  if (product === undefined) {
    return (
      <div className="py-32 text-center text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-heading text-gold">Product not found</p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-sm text-gold underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const mainSrc =
    gallery?.[0]?.url ??
    product.heroImagePath ??
    "/products/placeholder.svg";

  const reviewLine =
    product.ratingAverage && product.ratingCount ?
      `${product.ratingAverage.toFixed(1)} | ${product.ratingCount} reviews`
    : "Highly rated";

  return (
    <>
      {jsonLd ? (
        <Script
          id="product-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <div className="min-h-screen bg-surface text-on-surface">
        <section className="relative flex flex-col pt-24 md:min-h-screen md:flex-row">
          {/* Sticky gallery */}
          <div className="order-2 w-full md:sticky md:top-0 md:order-1 md:h-screen md:w-3/5">
            <div className="relative h-[min(70vh,560px)] w-full overflow-hidden bg-surface-container-lowest md:h-screen">
              <Image
                src={mainSrc}
                alt={product.name}
                fill
                priority
                className="object-cover opacity-95 transition-transform duration-[2000ms] hover:scale-100 md:scale-105"
                sizes="(min-width:768px) 60vw, 100vw"
              />
            </div>
            {gallery && gallery.length > 1 ? (
              <div className="hidden grid-cols-4 gap-1 p-2 md:grid">
                {gallery.slice(1, 5).map((g) => (
                  <div
                    key={g.url}
                    className="relative aspect-square overflow-hidden"
                  >
                    <Image
                      src={g.url}
                      alt={g.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Copy column */}
          <div className="order-1 flex w-full flex-col justify-center px-6 py-12 md:order-2 md:w-2/5 md:px-14 md:py-24">
            <span className="mb-6 block font-sans text-xs uppercase tracking-[0.2em] text-gold/90">
              {product.tagline}
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-on-surface md:text-5xl">
              {product.name}
            </h1>
            <p className="font-heading mt-4 text-2xl text-gold">
              {formatMoney(product.priceCents)}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {product.ratingAverage ? (
                <StarRating value={product.ratingAverage} />
              ) : (
                <StarRating value={5} />
              )}
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                {reviewLine}
              </span>
            </div>
            <div className="mt-8 space-y-5 font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
              <RichDescription text={product.description} className="[&_strong]:text-gold [&_strong]:italic" />
              {product.longDescription ? (
                <p>{product.longDescription}</p>
              ) : null}
            </div>
            <div className="mt-10 space-y-4">
              <AddToBagButton
                productId={product._id as Id<"products">}
                quantity={1}
                className="w-full"
              />
              <div className="bg-surface-container-low p-4 text-center">
                <p className="font-sans text-xs italic tracking-wide text-gold">
                  Complimentary samples may be included on qualifying orders.
                </p>
              </div>
              <Link
                href="/shop"
                className="block text-center font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant underline-offset-4 hover:text-gold hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </section>

        {(product.ingredients && product.ingredients.length > 0) ||
        product.howToUse ||
        (beforeAfter && beforeAfter.length > 0) ? (
          <section className="border-t border-outline-variant/15 bg-surface-container-lowest px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="font-heading text-2xl text-on-surface md:text-3xl">
                  Ingredients
                </h2>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <ul className="mt-6 list-none space-y-2.5 font-sans text-sm leading-relaxed text-on-surface-variant">
                    {product.ingredients.map((ing) => (
                      <li
                        key={ing}
                        className="border-l-2 border-gold/40 pl-4 text-on-surface-variant"
                      >
                        {ing}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 font-sans text-sm text-on-surface-variant">
                    Full ingredient lists appear below each SKU; our care team
                    can answer formulation questions on request.
                  </p>
                )}
              </div>
              <div>
                <h2 className="font-heading text-2xl text-on-surface md:text-3xl">
                  How to use
                </h2>
                {product.howToUse ? (
                  <div className="mt-6 font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
                    <RichDescription
                      text={product.howToUse}
                      className="[&_strong]:text-gold [&_strong]:italic"
                    />
                  </div>
                ) : (
                  <p className="mt-6 font-sans text-sm text-on-surface-variant">
                    Refer to the step-by-step regimen below for best results.
                  </p>
                )}
              </div>
            </div>
            {beforeAfter && beforeAfter.length > 0 ? (
              <div className="mx-auto mt-16 max-w-3xl">
                <h2 className="font-heading text-center text-2xl text-on-surface md:text-3xl">
                  Before &amp; after
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-center font-sans text-xs text-on-surface-variant">
                  Individual outcomes vary. Images are illustrative; consistent
                  sunscreen and a full regimen support visible improvement.
                </p>
                <div className="mt-10">
                  <BeforeAfterCarousel
                    key={beforeAfter.map((s) => s.url).join("|")}
                    slides={beforeAfter}
                  />
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* Molecular innovation */}
        <section className="border-t border-outline-variant/15 bg-surface-container-low px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 max-w-2xl">
              <h2 className="font-heading text-3xl text-on-surface md:text-4xl">
                Formula highlights
              </h2>
              <p className="mt-3 font-sans text-on-surface-variant">
                What sets this product apart in performance, texture, and skin
                compatibility.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-px bg-outline-variant/25 md:grid-cols-3">
              {product.features.map((f, i) => {
                const Icon = featureIcons[i % featureIcons.length];
                return (
                  <div
                    key={f.title}
                    className="bg-surface-container p-10 transition-colors hover:bg-surface-container-high md:p-12"
                  >
                    <div className="mb-8 flex size-12 items-center justify-center border-2 border-gold">
                      <Icon className="size-5 text-gold" strokeWidth={1.25} />
                    </div>
                    <h3 className="font-heading text-xl text-on-surface">
                      {f.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-loose text-on-surface-variant">
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ritual */}
        <section className="px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden md:col-span-7">
              <Image
                src={product.heroImagePath ?? "/products/placeholder.svg"}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width:768px) 55vw, 100vw"
              />
            </div>
            <div className="md:col-span-5 md:pl-4">
              <span className="mb-6 block font-sans text-xs uppercase tracking-[0.2em] text-gold/90">
                Regimen
              </span>
              <h2 className="font-heading text-3xl text-on-surface md:text-4xl">
                Step by step
              </h2>
              <div className="mt-10 space-y-10">
                {product.ritualSteps.map((step) => (
                  <div key={step.step} className="flex gap-6">
                    <span className="font-heading text-2xl text-gold/40">
                      {step.step}
                    </span>
                    <div>
                      <h4 className="font-heading text-lg text-on-surface">
                        {step.title}
                      </h4>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-on-surface-variant">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {product.testimonialQuote ? (
          <section className="relative overflow-hidden bg-surface-container-lowest px-6 py-24 md:py-32">
            <div className="pointer-events-none absolute left-1/2 top-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[150px]" />
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <blockquote className="font-heading text-2xl italic leading-snug text-on-surface md:text-4xl md:leading-snug">
                &ldquo;{product.testimonialQuote}&rdquo;
              </blockquote>
              <div className="mt-10 flex flex-col items-center gap-1">
                <cite className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-on-surface not-italic">
                  {product.testimonialAuthor}
                </cite>
                {product.testimonialTitle ? (
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold/70">
                    {product.testimonialTitle}
                  </span>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <ProductExpertDisclaimerBand />
      </div>
    </>
  );
}
