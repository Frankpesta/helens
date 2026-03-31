"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Package,
  CreditCard,
  ChevronRight,
  LogOut,
  ClipboardList,
} from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

function statusCopy(status: Doc<"orders">["status"]): {
  label: string;
  detail: string;
} {
  switch (status) {
    case "pending_payment":
      return {
        label: "Checkout incomplete",
        detail: "No payment was completed for this session.",
      };
    case "paid":
      return {
        label: "Paid",
        detail:
          "Payment received. We’ll email you when the status changes.",
      };
    case "processing":
      return {
        label: "Processing",
        detail: "We’re packing your certified organic formulas.",
      };
    case "shipped":
      return {
        label: "Shipped",
        detail: "Your parcel is on the way — check your inbox for details.",
      };
    case "fulfilled":
      return {
        label: "Fulfilled",
        detail: "Your order has been completed.",
      };
    case "canceled":
      return {
        label: "Canceled",
        detail: "This order was canceled.",
      };
    default:
      return { label: status, detail: "" };
  }
}

function formatOrderWhen(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AccountPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const orders = useQuery(
    api.customerOrders.listMine,
    isAuthenticated ? {} : "skip",
  );
  const summary = useQuery(
    api.customerOrders.mySpendingSummary,
    isAuthenticated ? {} : "skip",
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24 text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pt-32">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
          Account
        </p>
        <h1 className="font-heading mt-4 text-3xl text-on-surface">
          Your dashboard
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant">
          Sign in to view orders, payment totals, and status updates from
          Helen&apos;s Beauty Secret.
        </p>
        <Button
          asChild
          className="mt-8 rounded-none gold-gradient font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
        >
          <Link href="/sign-in?next=/account">Sign in</Link>
        </Button>
        <p className="mt-6 font-sans text-sm text-on-surface-variant">
          New here?{" "}
          <Link
            href="/sign-in?next=/account"
            className="text-gold underline-offset-4 hover:underline"
          >
            Create an account
          </Link>{" "}
          on the same page.
        </p>
      </div>
    );
  }

  if (orders === undefined || summary === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24 text-sm text-on-surface-variant">
        Loading your orders…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 md:pt-32">
      <div className="flex flex-col gap-6 border-b border-outline-variant/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
            Account
          </p>
          <h1 className="font-heading mt-3 text-3xl text-on-surface md:text-4xl">
            Your dashboard
          </h1>
          <p className="mt-2 font-sans text-sm text-on-surface-variant">
            Orders and spending tied to this sign-in.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-none border-outline-variant/40 text-on-surface hover:bg-surface-container"
          onClick={() => void signOut()}
        >
          <LogOut className="mr-2 size-4" strokeWidth={1.5} />
          Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="border border-outline-variant/25 bg-surface-container-low/40 p-5">
          <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            <CreditCard className="size-3.5 text-gold" strokeWidth={1.5} />
            Total spent
          </div>
          <p className="mt-3 font-heading text-2xl tabular-nums text-gold md:text-3xl">
            {formatMoney(summary.totalSpentCents)}
          </p>
          <p className="mt-1 font-sans text-xs text-on-surface-variant">
            Successful checkouts (excludes canceled / unpaid)
          </p>
        </div>
        <div className="border border-outline-variant/25 bg-surface-container-low/40 p-5">
          <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            <Package className="size-3.5 text-gold" strokeWidth={1.5} />
            Purchases
          </div>
          <p className="mt-3 font-heading text-2xl tabular-nums text-on-surface md:text-3xl">
            {summary.completedPurchaseCount}
          </p>
          <p className="mt-1 font-sans text-xs text-on-surface-variant">
            Orders with successful payment
          </p>
        </div>
        <div className="border border-outline-variant/25 bg-surface-container-low/40 p-5">
          <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            <ClipboardList className="size-3.5 text-gold" strokeWidth={1.5} />
            All records
          </div>
          <p className="mt-3 font-heading text-2xl tabular-nums text-on-surface md:text-3xl">
            {summary.allOrdersCount}
          </p>
          <p className="mt-1 font-sans text-xs text-on-surface-variant">
            Including abandoned checkouts
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-xl text-on-surface">Orders</h2>
        <p className="mt-1 font-sans text-xs text-on-surface-variant">
          Status updates appear here as your order moves from processing to
          fulfillment.
        </p>

        {orders.length === 0 ? (
          <div className="mt-8 border border-dashed border-outline-variant/35 bg-surface-container-low/20 p-10 text-center">
            <p className="font-sans text-sm text-on-surface-variant">
              No orders yet on this account.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 rounded-none border-gold/50 text-gold hover:bg-surface-container"
            >
              <Link href="/shop">Shop the collection</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((o) => {
              const { label, detail } = statusCopy(o.status);
              const total =
                o.amountTotalCents != null ?
                  formatMoney(o.amountTotalCents, o.currency ?? "USD")
                : "—";
              return (
                <li
                  key={o._id}
                  className="border border-outline-variant/20 bg-surface-container-low/30 p-5 md:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-6">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold">
                          {label}
                        </span>
                        <span className="font-sans text-xs text-on-surface-variant">
                          · {formatOrderWhen(o._creationTime)}
                        </span>
                      </div>
                      <p className="font-sans text-xs leading-relaxed text-on-surface-variant">
                        {detail}
                      </p>
                      {o.lineItems.length > 0 ? (
                        <ul className="mt-3 space-y-1 font-sans text-sm text-on-surface">
                          {o.lineItems.map((li) => (
                            <li key={`${o._id}-${li.slug}`}>
                              {li.name}{" "}
                              <span className="text-on-surface-variant">
                                ×{li.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="mt-2 font-mono text-[10px] text-on-surface-variant/80">
                        Ref: {o.stripeCheckoutSessionId.slice(0, 24)}…
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                      <p className="font-heading text-lg tabular-nums text-gold">
                        {total}
                      </p>
                      {o.updatedAt !== o._creationTime ? (
                        <p className="font-sans text-[10px] text-on-surface-variant">
                          Updated {formatOrderWhen(o.updatedAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-12 font-sans text-xs text-on-surface-variant">
        Update your saved delivery address anytime.{" "}
        <Link
          href="/checkout/details"
          className="inline-flex items-center gap-0.5 text-gold underline-offset-4 hover:underline"
        >
          Edit delivery details
          <ChevronRight className="size-3" />
        </Link>
      </p>
    </div>
  );
}
