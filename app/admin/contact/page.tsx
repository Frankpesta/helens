"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Mail } from "lucide-react";
import { useCallback } from "react";
function formatWhen(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminContactPage() {
  const rows = useQuery(api.contact.listForAdmin, { limit: 100 });
  const markRead = useMutation(api.contact.markRead);

  const copyText = useCallback(async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${label}`);
    } catch {
      toast.error("Copy failed");
    }
  }, []);

  async function copyMailto(email: string, name: string) {
    const subject = encodeURIComponent(`Re: Your message to Helen's Beauty Secret`);
    const body = encodeURIComponent(
      `Hi ${name.split(" ")[0] || "there"},\n\n`,
    );
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    await copyText("mailto link", mailto);
  }

  if (!rows) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Contact inbox</h1>
        <p className="text-sm text-muted-foreground">
          Messages from the storefront contact form. Copy the address or a
          ready-to-send mailto link.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((m) => (
            <li
              key={m._id}
              className="rounded-lg border border-border/80 bg-card/40 p-4 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{m.name}</p>
                    {!m.read ?
                      <Badge variant="default" className="bg-gold text-xs text-primary-foreground">
                        New
                      </Badge>
                    : null}
                  </div>
                  <p className="truncate font-mono text-sm text-gold">{m.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatWhen(m.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => void copyText("email", m.email)}
                  >
                    <Copy className="size-3.5" />
                    Copy email
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => void copyMailto(m.email, m.name)}
                  >
                    <Mail className="size-3.5" />
                    Copy reply link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      void markRead({ id: m._id, read: !m.read }).then(() =>
                        toast.message(m.read ? "Marked new" : "Marked read"),
                      )
                    }
                  >
                    {m.read ? "Mark new" : "Mark read"}
                  </Button>
                </div>
              </div>
              <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border/60 bg-muted/30 p-3 font-sans text-sm leading-relaxed text-foreground">
                {m.message}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
