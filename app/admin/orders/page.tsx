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

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<
    "pending_payment" | "paid" | "fulfilled" | "canceled" | undefined
  >(undefined);
  const orders = useQuery(api.orders.listForAdmin, {
    status: filter,
    limit: 80,
  });
  const patch = useMutation(api.orders.updateStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Stripe Checkout sessions mirrored in Convex.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", undefined],
            ["paid", "paid"],
            ["pending", "pending_payment"],
            ["fulfilled", "fulfilled"],
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
                  <TableCell>{o.status}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    {o.status === "paid" ?
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          void patch({
                            orderId: o._id,
                            status: "fulfilled",
                          }).then(() => toast.success("Marked fulfilled"))
                        }
                      >
                        Fulfill
                      </Button>
                    : null}
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
