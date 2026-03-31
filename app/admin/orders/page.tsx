"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined);
  const orders = useQuery(api.orders.listForAdmin, {
    status: filter,
    limit: 80,
  });
  const setStatus = useMutation(api.orders.setAdminStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Stripe Checkout mirrored in Convex. Each status change emails the
          customer when an address is on file.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", undefined],
            ["paid", "paid"],
            ["processing", "processing"],
            ["shipped", "shipped"],
            ["pending", "pending_payment"],
            ["fulfilled", "fulfilled"],
            ["canceled", "canceled"],
          ] as const
        ).map(([label, st]) => (
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
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="max-w-[140px] truncate font-mono text-xs">
                    {o.stripeCheckoutSessionId}
                  </TableCell>
                  <TableCell>{o.email ?? "—"}</TableCell>
                  <TableCell>
                    {o.amountTotalCents != null ?
                      formatMoney(
                        o.amountTotalCents,
                        o.currency ?? "USD",
                      )
                    : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{o.status}</TableCell>
                  <TableCell className="text-right">
                    {o.status === "pending_payment" ?
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          void setStatus({
                            orderId: o._id,
                            status: "canceled",
                          })
                            .then(() => toast.success("Checkout canceled"))
                            .catch((err: Error) =>
                              toast.error(err.message ?? "Update failed"),
                            )
                        }
                      >
                        Cancel abandoned
                      </Button>
                    : (
                      <select
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                        value={o.status}
                        aria-label={`Order status for ${o.stripeCheckoutSessionId}`}
                        onChange={(e) => {
                          const status = e.target.value as AdminStatus;
                          void setStatus({ orderId: o._id, status })
                            .then(() => toast.success(`Status → ${status}`))
                            .catch((err: Error) =>
                              toast.error(err.message ?? "Update failed"),
                            );
                        }}
                      >
                        {ADMIN_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
