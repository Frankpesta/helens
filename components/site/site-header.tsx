"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ShoppingBag,
  UserRound,
  Search,
  Minus,
  Plus,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore, cartItemCount } from "@/lib/cart-store";
import {
  primaryActionClickFeedback,
  subtleClickFeedback,
} from "@/lib/click-feedback";
import { formatMoney } from "@/lib/format";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useMemo, type MouseEvent } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { animate } from "animejs";
import { productMatchesSearchQuery } from "@/lib/shop-search";

const nav = [
  {
    href: "/shop",
    label: "Shop",
    match: (p: string) =>
      p === "/" || p.startsWith("/shop") || p.startsWith("/product"),
  },
  { href: "/#standards", label: "Standards", match: () => false },
  { href: "/about", label: "Philosophy", match: (p: string) => p.startsWith("/about") },
  { href: "/journal", label: "Journal", match: (p: string) => p.startsWith("/journal") },
  {
    href: "/account",
    label: "Account",
    match: (p: string) => p.startsWith("/account") || p.startsWith("/sign-in"),
  },
];

export function SiteHeader({ brandName }: { brandName: string }) {
  const pathname = usePathname() ?? "";
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const count = cartItemCount(lines);
  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = useQuery(
    api.products.getForCheckout,
    ids.length ? { ids } : "skip",
  );
  const catalog = useQuery(api.products.listActive, {});
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const bagPulseAt = useCartStore((s) => s.bagPulseAt);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const byId = new Map(products?.map((p) => [p._id, p]) ?? []);

  useEffect(() => {
    if (!bagPulseAt || !badgeRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void animate(badgeRef.current, {
      scale: [1, 1.22, 1],
      duration: 480,
      ease: "out(3)",
    });
  }, [bagPulseAt]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile nav when route changes
    setMobileNavOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const searchMatches = useMemo(() => {
    if (!catalog || !searchText.trim()) return [];
    return catalog.filter((p) => productMatchesSearchQuery(p, searchText));
  }, [catalog, searchText]);

  function submitHeaderSearch() {
    const q = searchText.trim();
    setSearchOpen(false);
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
    else router.push("/shop");
  }

  function onCheckout(e: MouseEvent<HTMLButtonElement>) {
    if (lines.length === 0) return;
    primaryActionClickFeedback(e.currentTarget);
    setCartOpen(false);
    router.push("/checkout");
  }

  let subtotal = 0;
  for (const l of lines) {
    const p = byId.get(l.productId);
    if (p) subtotal += p.priceCents * l.quantity;
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b border-outline-variant/20 bg-surface/70 backdrop-blur-xl bg-linear-to-b from-black/25 to-transparent">
      <div className="flex w-full max-w-none items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-10 md:py-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2 md:flex-initial md:gap-0">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-gold hover:bg-transparent hover:opacity-80 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[min(100vw-2rem,20rem)] flex-col border-outline-variant/30 bg-surface-container px-0 pt-2 pb-2"
            >
              <SheetHeader className="px-6 pb-2 pt-4">
                <SheetTitle className="font-heading text-xl text-gold">Menu</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-0 px-6 pb-6"
                aria-label="Primary"
              >
                {nav.map((item) => {
                  const active = item.match(pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        "block border-b border-outline-variant/15 py-4 pr-1 font-heading text-base uppercase tracking-[0.2em] transition-colors last:border-b-0",
                        active ? "text-gold" : "text-on-surface hover:text-gold",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            className={cn(
              "relative inline-flex h-9 shrink-0 items-center overflow-visible",
              "min-w-48 sm:min-w-56 md:min-w-64 lg:min-w-72",
            )}
            aria-label={`${brandName} — home`}
          >
            <Image
              src="/logo.png"
              alt=""
              width={480}
              height={120}
              priority
              className={cn(
                "absolute left-0 top-1/2 w-auto max-w-[min(85vw,22rem)] -translate-y-1/2 object-contain object-left",
                "h-14 sm:h-16 md:h-19 lg:h-21",
                "sm:max-w-96 md:max-w-xl lg:max-w-2xl",
              )}
            />
          </Link>
        </div>
        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-heading text-base uppercase tracking-[0.2em] transition-colors duration-300",
                  active
                    ? "border-b border-gold pb-1 text-gold"
                    : "text-on-surface hover:text-gold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-5">
          <Sheet
            open={searchOpen}
            onOpenChange={(open) => {
              setSearchOpen(open);
              if (!open) setSearchText("");
            }}
          >
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 text-gold hover:bg-transparent hover:opacity-80"
                aria-label="Search products"
              >
                <Search className="size-5" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              showCloseButton
              className="flex max-h-[min(85dvh,560px)] flex-col gap-0 border-outline-variant/30 bg-surface-container px-4 pb-4 pt-2 sm:px-6"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Search products</SheetTitle>
              </SheetHeader>
              <form
                className="flex gap-2 pt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitHeaderSearch();
                }}
              >
                <Search
                  className="mt-2.5 size-5 shrink-0 text-gold opacity-80"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by name, concern, or ingredient…"
                  className="h-11 flex-1 border-outline-variant/40 bg-surface-container-high/60 text-base text-on-surface placeholder:text-on-surface-variant md:text-base"
                  aria-label="Search products"
                  autoComplete="off"
                  autoFocus
                />
                <Button
                  type="submit"
                  className="h-11 shrink-0 bg-gold text-primary-foreground hover:bg-gold/90"
                >
                  Go
                </Button>
              </form>
              <div className="mt-3 min-h-0 flex-1">
                {catalog === undefined ? (
                  <p className="py-6 text-sm text-on-surface-variant">
                    Loading catalog…
                  </p>
                ) : searchText.trim() === "" ? (
                  <p className="py-6 text-sm text-on-surface-variant">
                    Type to filter products. Press Go to open the shop with
                    your search.
                  </p>
                ) : searchMatches.length === 0 ? (
                  <p className="py-6 text-sm text-on-surface-variant">
                    No products match &ldquo;{searchText.trim()}&rdquo;. Try
                    another word or browse{" "}
                    <Link
                      href="/shop"
                      className="text-gold underline"
                      onClick={() => setSearchOpen(false)}
                    >
                      all products
                    </Link>
                    .
                  </p>
                ) : (
                  <ScrollArea className="h-[min(50vh,320px)] pr-3">
                    <ul className="space-y-1 pb-2">
                      {searchMatches.slice(0, 10).map((p) => (
                        <li key={p._id}>
                          <Link
                            href={`/product/${p.slug}`}
                            className="flex flex-col rounded-md border border-transparent px-3 py-3 transition-colors hover:border-outline-variant/30 hover:bg-surface-container-high/50"
                            onClick={() => setSearchOpen(false)}
                          >
                            <span className="font-heading text-base text-on-surface">
                              {p.name}
                            </span>
                            <span className="mt-0.5 line-clamp-1 text-sm text-on-surface-variant">
                              {p.tagline}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </div>
              {searchText.trim() !== "" && searchMatches.length > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full border-outline-variant/40"
                  onClick={() => submitHeaderSearch()}
                >
                  View all {searchMatches.length} match
                  {searchMatches.length === 1 ? "" : "es"} on shop
                </Button>
              ) : null}
            </SheetContent>
          </Sheet>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 text-gold hover:bg-transparent hover:opacity-80"
            aria-label="My account"
            asChild
          >
            <Link href="/account">
              <UserRound className="size-5" strokeWidth={1.5} />
            </Link>
          </Button>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative size-9 text-gold hover:bg-transparent hover:opacity-80"
                aria-label="Cart"
              >
                <ShoppingBag className="size-5" strokeWidth={1.5} />
                {count > 0 ? (
                  <span
                    ref={badgeRef}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-semibold text-primary-foreground"
                  >
                    {count}
                  </span>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent className="border-outline-variant/30 bg-surface-container">
              <SheetHeader>
                <SheetTitle className="font-heading text-xl text-gold sm:text-2xl">
                  Your bag
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="mt-6 h-[calc(100vh-220px)] pr-2">
                {lines.length === 0 ? (
                  <p className="px-1 text-base text-on-surface-variant">
                    Your bag is empty.
                  </p>
                ) : (
                  <ul className="space-y-4 pr-2">
                    {lines.map((l) => {
                      const p = byId.get(l.productId);
                      const id = l.productId as Id<"products">;
                      if (!p) {
                        return (
                          <li
                            key={l.productId}
                            className="rounded-lg border border-outline-variant/20 bg-surface-container-low/40 px-4 py-4 text-base opacity-60 md:px-5 md:py-5"
                          >
                            Loading…
                          </li>
                        );
                      }
                      return (
                        <li
                          key={l.productId}
                          className="rounded-lg border border-outline-variant/25 bg-surface-container-low/50 p-4 md:p-5"
                        >
                          <div className="flex justify-between gap-3">
                            <Link
                              href={`/product/${p.slug}`}
                              className="font-heading text-base font-medium leading-snug text-on-surface hover:text-gold md:text-lg"
                              onClick={() => setCartOpen(false)}
                            >
                              {p.name}
                            </Link>
                            <button
                              type="button"
                              className="origin-center shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-gold sm:text-sm"
                              onClick={(e) => {
                                subtleClickFeedback(e.currentTarget);
                                remove(id);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                          <p className="mt-2 font-sans text-sm text-on-surface-variant">
                            {formatMoney(p.priceCents)} each
                          </p>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="inline-flex items-stretch overflow-hidden rounded-md border border-outline-variant/40 bg-surface-container">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-none border-r border-outline-variant/30 text-on-surface hover:bg-surface-container-high hover:text-gold"
                                aria-label="Decrease quantity"
                                onClick={(e) => {
                                  subtleClickFeedback(e.currentTarget);
                                  setQty(id, l.quantity - 1);
                                }}
                              >
                                <Minus className="size-4" strokeWidth={2} />
                              </Button>
                              <span className="flex min-w-10 items-center justify-center px-2 font-sans text-base font-semibold tabular-nums text-on-surface">
                                {l.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-none border-l border-outline-variant/30 text-on-surface hover:bg-surface-container-high hover:text-gold"
                                aria-label="Increase quantity"
                                onClick={(e) => {
                                  subtleClickFeedback(e.currentTarget);
                                  setQty(id, l.quantity + 1);
                                }}
                              >
                                <Plus className="size-4" strokeWidth={2} />
                              </Button>
                            </div>
                            <span className="font-heading text-base text-gold md:text-lg">
                              {formatMoney(p.priceCents * l.quantity)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </ScrollArea>
              <div className="absolute bottom-6 left-4 right-4 space-y-3">
                <Separator className="bg-outline-variant/30" />
                <div className="flex justify-between text-base">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-heading text-gold">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <Button
                  type="button"
                  className="origin-center w-full gold-gradient font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
                  disabled={lines.length === 0}
                  onClick={onCheckout}
                >
                  Checkout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
