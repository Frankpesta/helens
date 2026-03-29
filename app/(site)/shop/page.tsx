"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import { AnimateSection } from "@/lib/motion/animate-section";
import { StarRating } from "@/components/site/star-rating";
import {
  ShopBottomNotes,
  ShopGuidanceBlock,
  ShopTrustRow,
} from "@/components/site/expert-blocks";
import { useCartStore } from "@/lib/cart-store";
import { cartAddClickFeedback } from "@/lib/click-feedback";
import { productMatchesSearchQuery } from "@/lib/shop-search";
import type { Id } from "@/convex/_generated/dataModel";
import { X } from "lucide-react";

function ShopPageInner() {
  const searchParams = useSearchParams();
  const qRaw = searchParams.get("q");
  const q = typeof qRaw === "string" ? qRaw.trim() : "";

  const products = useQuery(api.products.listActive);
  const add = useCartStore((s) => s.add);
  const pulseBag = useCartStore((s) => s.pulseBag);

  const filtered = useMemo(() => {
    if (!products) return undefined;
    if (!q) return products;
    return products.filter((p) => productMatchesSearchQuery(p, q));
  }, [products, q]);

  if (!products || filtered === undefined) {
    return (
      <div className="py-32 pt-28 text-center text-base text-on-surface-variant">
        Loading catalog…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl bg-surface px-4 pb-16 pt-28 sm:px-6">
      <AnimateSection className="mb-12 max-w-xl">
        <p
          data-animate-child
          className="text-sm uppercase tracking-[0.3em] text-gold sm:text-base"
        >
          Shop
        </p>
        <h1
          data-animate-child
          className="mt-2 font-heading text-4xl text-on-surface"
        >
          Shop skin care
        </h1>
        <p
          data-animate-child
          className="mt-3 text-base text-on-surface-variant sm:text-lg"
        >
          Certified-organic botanicals, disciplined formulation, and inventory
          you can trust for professional and at-home routines.
        </p>
      </AnimateSection>

      {q ? (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-md border border-outline-variant/25 bg-surface-container-low/60 px-4 py-3 text-on-surface">
          <span className="text-sm text-on-surface-variant">
            Results for{" "}
            <span className="font-medium text-on-surface">&ldquo;{q}&rdquo;</span>
            {" — "}
            <span className="text-gold">{filtered.length}</span> product
            {filtered.length === 1 ? "" : "s"}
          </span>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 rounded-md border border-outline-variant/40 px-3 py-1.5 font-sans text-xs uppercase tracking-wider text-on-surface-variant transition-colors hover:border-gold hover:text-gold"
          >
            <X className="size-3.5" strokeWidth={2} aria-hidden />
            Clear search
          </Link>
        </div>
      ) : null}

      <ShopTrustRow />
      <ShopGuidanceBlock />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-base text-on-surface-variant">
          No products match your search.{" "}
          <Link href="/shop" className="text-gold underline">
            View all products
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p._id}
              className="group border border-outline-variant/25 bg-surface-container"
            >
              <Link href={`/product/${p.slug}`} className="block">
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={p.heroImagePath ?? "/products/placeholder.svg"}
                    alt={p.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width:1024px) 32vw, 90vw"
                  />
                </div>
              </Link>
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gold sm:text-sm">
                  {p.tagline}
                </p>
                <Link href={`/product/${p.slug}`}>
                  <h2 className="font-heading text-xl hover:text-gold">
                    {p.name}
                  </h2>
                </Link>
                {p.ratingAverage ? (
                  <StarRating value={p.ratingAverage} />
                ) : null}
                <p className="line-clamp-2 text-base text-on-surface-variant">
                  {p.description.replace(/\*\*/g, "")}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-gold">{formatMoney(p.priceCents)}</span>
                  <button
                    type="button"
                    className="origin-center text-sm font-medium uppercase tracking-[0.15em] text-gold hover:underline"
                    onClick={(e) => {
                      add(p._id as Id<"products">, 1);
                      pulseBag();
                      cartAddClickFeedback(e.currentTarget);
                    }}
                  >
                    Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ShopBottomNotes />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="py-32 pt-28 text-center text-base text-on-surface-variant">
          Loading shop…
        </div>
      }
    >
      <ShopPageInner />
    </Suspense>
  );
}
