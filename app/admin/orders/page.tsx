"use client";

import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type OrderStatus = Doc<"orders">["status"];
type AdminStatus = Exclude<OrderStatus, "pending_payment">;

const PAGE_SIZE = 25;

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
  try { return JSON.parse(raw) as ShippingSnapshot; } catch { return null; }
}

function formatAddress(snap: ShippingSnapshot | null): string[] {
  const addr = snap?.shipping?.address ?? snap?.customer?.address;
  if (!addr) return [];
  const lines: string[] = [];
  if (addr.line1) lines.push(addr.line1);
  if (addr.line2) lines.push(addr.line2);
  const cityLine = [addr.city, addr.state, addr.postal_code].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  if (addr.country) lines.push(addr.country);
  return lines;
}

function getRecipientName(snap: ShippingSnapshot | null) {
  return snap?.shipping?.name ?? snap?.customer?.name ?? "";
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[status]}`}>
      {status.replace("_", " ")}
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
        type="button" variant="outline" size="sm"
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
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

function ExpandedDetail({ order }: { order: Doc<"orders"> }) {
  const snap = parseSnapshot(order.shippingSnapshot);
  const addrLines = formatAddress(snap);

  return (
    <tr className="bg-muted/30">
      <td colSpan={6} className="px-4 pb-4 pt-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Shipping address */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Shipping address
            </p>
            {addrLines.length > 0 ? (
              <div className="space-y-0.5 text-sm text-foreground">
                {addrLines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No address on record</p>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Items ordered
            </p>
            {order.lineItems.length > 0 ? (
              <ul className="space-y-1 text-sm text-foreground">
                {order.lineItems.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-4">
                    <span>
                      {item.quantity > 1 && (
                        <span className="font-medium">{item.quantity}× </span>
                      )}
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {formatMoney(item.unitAmountCents * item.quantity, "USD")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No items recorded</p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.orders.listForAdminPaginated,
    { status: filter },
    { initialNumItems: PAGE_SIZE },
  );

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
          Stripe Checkout orders · {results.length} loaded · tap a row to see address &amp; items
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
            onClick={() => { setFilter(st); setExpandedId(null); }}
          >
            {label}
          </Button>
        ))}
      </div>

      {status === "LoadingFirstPage" ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders found.</p>
      ) : (
        <div className="rounded-md border border-border overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 w-[100px]">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3 w-[90px]">Total</th>
                <th className="px-4 py-3 w-[110px]">Status</th>
                <th className="px-4 py-3 w-[110px] text-right">Action</th>
                <th className="px-4 py-3 w-[40px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((o) => {
                const snap = parseSnapshot(o.shippingSnapshot);
                const name = getRecipientName(snap);
                const isExpanded = expandedId === o._id;

                return (
                  <>
                    <tr
                      key={o._id}
                      className="hover:bg-muted/20 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : o._id)}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(o._creationTime)}
                      </td>
                      <td className="px-4 py-3">
                        {name && <p className="font-medium text-foreground leading-tight">{name}</p>}
                        <p className="text-xs text-muted-foreground">{o.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {o.amountTotalCents != null
                          ? formatMoney(o.amountTotalCents, o.currency ?? "USD")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <StatusControl order={o} setStatus={setStatus} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {isExpanded
                          ? <ChevronUp className="size-4" />
                          : <ChevronDown className="size-4" />}
                      </td>
                    </tr>
                    {isExpanded && <ExpandedDetail key={`${o._id}-detail`} order={o} />}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {status !== "LoadingFirstPage" && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{results.length} order{results.length !== 1 ? "s" : ""} loaded</span>
          {status === "CanLoadMore" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadMore(PAGE_SIZE)}
            >
              Load next {PAGE_SIZE}
            </Button>
          )}
          {status === "Exhausted" && results.length > PAGE_SIZE && (
            <span className="text-xs">All orders loaded</span>
          )}
        </div>
      )}
    </div>
  );
}
