"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Copy } from "lucide-react";

function formatWhen(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminNewsletterPage() {
  const rows = useQuery(api.newsletter.listForAdmin, { limit: 300 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Newsletter list</h1>
        <p className="text-sm text-muted-foreground">
          Emails captured from the home page subscribe form. Export to your ESP
          (Klaviyo, Mailchimp, Resend Audiences, etc.) when you are ready to send.
        </p>
      </div>

      {rows && rows.length > 0 ?
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              const text = rows.map((r) => r.email).join("\n");
              void navigator.clipboard.writeText(text).then(
                () => toast.success(`Copied ${rows.length} addresses`),
                () => toast.error("Copy failed"),
              );
            }}
          >
            <Copy className="size-3.5" />
            Copy all emails
          </Button>
        </div>
      : null}

      {!rows ?
        <p className="text-sm text-muted-foreground">Loading…</p>
      : rows.length === 0 ?
        <p className="text-sm text-muted-foreground">No subscribers yet.</p>
      : <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Signed up</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-mono text-sm">{r.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.source ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatWhen(r.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
    </div>
  );
}
