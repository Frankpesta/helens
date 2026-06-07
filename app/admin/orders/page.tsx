"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

type OrderStatus = Doc<"orders">["status"];
type AdminStatus = Exclude<OrderStatus, "pending_payment">;

const ADMIN_STATUS_OPTIONS: { value: AdminStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "canceled", label: "Canceled" },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "text-yellow-500 bg-yellow-500/10",
  paid:            "text-blue-400 bg-blue-400/10",
  processing:      "text-purple-400 bg-purple-400/10",
  shipped:         "text-cyan-400 bg-cyan-400/10",
  fulfilled:       "text-green-400 bg-green-400/10",
  canceled:        "text-red-400 bg-red-400/10",
};

interface ShippingSnapshot {
  customer?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
  shipping?: {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
}

function parseSnapshot(raw: string | undefined): ShippingSnapshot | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ShippingSnapshot;
  } catch {
    return null;
  }
}

function formatAddress(snap: ShippingSnapshot | null): string[] {
  const addr = snap?.shipping?.address ?? snap?.customer?.address;
  if (!addr) return [];
  const lines: string[] = [];
  if (addr.line1) lines.push(addr.line1);
  if (addr.line2) lines.push(addr.line2);
  const cityLine = [addr.city, addr.state, addr.postal_code]
    .filter(Boolean)
    .join(", ");
  if (cityLine) lines.push(cityLine);
  if (addr.country) lines.push(addr.country);
  return lines;
}

function getRecipientName(snap: ShippingSnapshot | null): string {
  return snap?.shipping?.name ?? snap?.customer?.name ?? "";
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const label = status.replace("_", " ");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[status]}`}
    >
      {label}
    </span>
  );
}

function StatusControl({
  order,
  setStatus,
}: {
  order: Doc<"orders">;
  setStatus: (args: { orderId: Doc<"orders">["_id"]; status: AdminStatus }) => Promise<unknown>;
}) {
  if (order.status === "pending_payment") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10"
        onClick={() =>
          void setStatus({ orderId: order._id, status: "canceled" })
            .then(() => toast.success("Checkout canceled"))
            .catch((err: Error) => toast.error(err.message ?? "Update failed"))
        }
      >
        Cancel
      </Button>
    );
  }
  return (
    <select
      className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
      value={order.status}
      aria-label={`Status for order ${order._id}`}
      onChange={(e) => {
        const status = e.target.value as AdminStatus;
        void setStatus({ orderId: order._id, status })
          .then(() => toast.success(`Status → ${status}`))
          .catch((err: Error) => toast.error(err.message ?? "Update failed"));
      }}
    >
      {ADMIN_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined);
  const orders = useQuery(api.orders.listForAdmin, { status: filter, limit: 80 });
  const setStatus = useMutation(api.orders.setAdminStatus);

  const filterButtons = [
    ["All", undefined],
    ["Paid", "paid"],
    ["Processing", "processing"],
    ["Shipped", "shipped"],
    ["Pending", "pending_payment"],
    ["Fulfilled", "fulfilled"],
    ["Canceled", "canceled"],
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Stripe Checkout orders. Status changes email the customer automatically.
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(([label, st]) => (
          <Button
            key={label}
            type="button"
            size="sm"
            variant={filter === st ? "default" : "outline"}
            className={filter === st ? "bg-gold text-primary-foreground" : ""}
            onClick={() => setFilter(st)}
          >
            {label}
          </Button>
        ))}
      </div>

      {!orders ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders found.</p>
      ) : (
        <>
          {/* ── DESKTOP TABLE (md+) ─────────────────────────────────────── */}
          <div className="hidden md:block rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Shipping address</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => {
                  const snap = parseSnapshot(o.shippingSnapshot);
                  const addrLines = formatAddress(snap);
                  const name = getRecipientName(snap);
                  return (
                    <tr key={o._id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(o._creationTime)}
                      </td>
                      <td className="px-4 py-3">
                        {name && (
                          <p className="font-medium text-foreground">{name}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{o.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {addrLines.length > 0 ? (
                          <div className="space-y-0.5">
                            {addrLines.map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px]">
                        {o.lineItems.length > 0 ? (
                          <ul className="space-y-0.5">
                            {o.lineItems.map((item, i) => (
                              <li key={i}>
                                {item.quantity > 1 && (
                                  <span className="font-medium text-foreground">{item.quantity}× </span>
                                )}
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {o.amountTotalCents != null
                          ? formatMoney(o.amountTotalCents, o.currency ?? "USD")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <StatusControl order={o} setStatus={setStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS (< md) ─────────────────────────────────────── */}
          <div className="flex flex-col gap-4 md:hidden">
            {orders.map((o) => {
              const snap = parseSnapshot(o.shippingSnapshot);
              const addrLines = formatAddress(snap);
              const name = getRecipientName(snap);
              return (
                <div
                  key={o._id}
                  className="rounded-md border border-border bg-card p-4 space-y-3"
                >
                  {/* Header row: date + status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(o._creationTime)}
                    </span>
                    <StatusBadge status={o.status} />
                  </div>

                  {/* Customer */}
                  <div>
                    {name && (
                      <p className="font-medium text-foreground text-sm">{name}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{o.email ?? "—"}</p>
                  </div>

                  {/* Shipping address */}
                  {addrLines.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Ship to
                      </p>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {addrLines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  {o.lineItems.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Items
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {o.lineItems.map((item, i) => (
                          <li key={i}>
                            {item.quantity > 1 && (
                              <span className="font-medium text-foreground">{item.quantity}× </span>
                            )}
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer: total + action */}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-medium text-foreground">
                      {o.amountTotalCents != null
                        ? formatMoney(o.amountTotalCents, o.currency ?? "USD")
                        : "—"}
                    </span>
                    <StatusControl order={o} setStatus={setStatus} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
