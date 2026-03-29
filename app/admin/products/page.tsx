"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminProductsPage() {
  const products = useQuery(api.products.listAllForAdminIncludingInactive, {});
  const removeProduct = useMutation(api.products.remove);
  const [pendingDelete, setPendingDelete] = useState<{
    id: Id<"products">;
    name: string;
  } | null>(null);

  if (!products) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Create SKUs, then edit copy, ingredients, how to use, and media.
          </p>
        </div>
        <Button className="w-full shrink-0 bg-gold text-primary-foreground sm:w-auto" asChild>
          <Link href="/admin/products/new">New product</Link>
        </Button>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.slug}</TableCell>
                <TableCell>{formatMoney(p.priceCents)}</TableCell>
                <TableCell>
                  <Badge variant={p.isActive ? "default" : "secondary"}>
                    {p.isActive ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${p._id}`}>Edit</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setPendingDelete({ id: p._id, name: p.name })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete ?
                <>
                  This will permanently delete &ldquo;{pendingDelete.name}
                  &rdquo;, remove gallery files from storage, and drop it from
                  featured picks. This cannot be undone.
                </>
              : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              className="bg-destructive text-white hover:bg-destructive/90 dark:text-white"
              onClick={() => {
                if (!pendingDelete) return;
                const id = pendingDelete.id;
                setPendingDelete(null);
                void removeProduct({ id })
                  .then(() => toast.success("Product deleted"))
                  .catch((err: Error) =>
                    toast.error(err.message ?? "Delete failed"),
                  );
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
