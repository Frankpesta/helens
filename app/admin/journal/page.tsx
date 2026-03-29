"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminJournalPage() {
  const posts = useQuery(api.journal.listAdmin, {});
  const create = useMutation(api.journal.create);
  const remove = useMutation(api.journal.remove);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    id: Id<"journalPosts">;
    title: string;
  } | null>(null);
  const [draft, setDraft] = useState({
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    heroPublicPath: "",
    published: false,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Journal</h1>
          <p className="text-sm text-muted-foreground">
            Editorial posts for the storefront.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setOpen((v) => !v)}>
          {open ? "Close composer" : "New post"}
        </Button>
      </div>

      {open ? (
        <form
          className="grid max-w-xl gap-3 space-y-2 rounded-lg border border-border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void create({
              slug: draft.slug,
              title: draft.title,
              excerpt: draft.excerpt,
              body: draft.body,
              heroPublicPath: draft.heroPublicPath || undefined,
              published: draft.published,
            })
              .then(() => {
                toast.success("Post created");
                setOpen(false);
                setDraft({
                  slug: "",
                  title: "",
                  excerpt: "",
                  body: "",
                  heroPublicPath: "",
                  published: false,
                });
              })
              .catch(() => toast.error("Failed"));
          }}
        >
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={draft.slug}
              onChange={(e) =>
                setDraft((d) => ({ ...d, slug: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Input
              value={draft.excerpt}
              onChange={(e) =>
                setDraft((d) => ({ ...d, excerpt: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Body (markdown-ish)</Label>
            <Textarea
              rows={6}
              value={draft.body}
              onChange={(e) =>
                setDraft((d) => ({ ...d, body: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Hero path</Label>
            <Input
              value={draft.heroPublicPath}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  heroPublicPath: e.target.value,
                }))
              }
              placeholder="/products/serum-1.svg"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) =>
                setDraft((d) => ({ ...d, published: e.target.checked }))
              }
            />
            Published
          </label>
          <Button type="submit" className="bg-gold text-primary-foreground w-fit">
            Publish draft
          </Button>
        </form>
      ) : null}

      {!posts ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                  <TableCell>{p.published ? "yes" : "no"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link
                      href={`/journal/${p.slug}`}
                      className="text-xs text-gold hover:underline"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() =>
                        setPendingDelete({ id: p._id, title: p.title })
                      }
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={pendingDelete != null}
        onOpenChange={(v) => {
          if (!v) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete journal post?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete ?
                <>
                  This will permanently remove &ldquo;{pendingDelete.title}
                  &rdquo; from the database. This cannot be undone.
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
                void remove({ id }).then(() => toast.message("Deleted"));
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
