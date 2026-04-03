"use client";

import { use } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import Image from "next/image";
import {
  parseBeforeAfterText,
  parseIngredientsText,
} from "@/lib/admin-product-parsers";
import {
  emptyStoryFields,
  ProductStorySections,
  storyFieldsToConvexExtras,
  type AdminProductStoryFields,
} from "@/components/admin/product-story-sections";

export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: Id<"products"> }>;
}) {
  const { id } = use(params);
  const list = useQuery(api.products.listAllForAdminIncludingInactive, {});
  const product = list?.find((p) => p._id === id);
  const gallery = useQuery(api.products.getGallery, { productId: id });
  const imagesRows = useQuery(api.products.imagesByProduct, { productId: id });
  const update = useMutation(api.products.update);
  const genUrl = useMutation(api.products.generateUploadUrl);
  const addImg = useMutation(api.products.addProductImage);
  const removeImg = useMutation(api.products.removeProductImage);

  const nextSort = useMemo(() => {
    if (!imagesRows?.length) return 0;
    return Math.max(...imagesRows.map((r) => r.sortOrder)) + 1;
  }, [imagesRows]);

  const [story, setStory] = useState<AdminProductStoryFields>(emptyStoryFields);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    longDescription: "",
    priceCents: 0,
    isActive: true,
    trackInventory: true,
    inventoryCount: 0,
    stripePriceId: "",
    heroImagePath: "",
    ingredientsText: "",
    howToUse: "",
    beforeAfterText: "",
  });

  useEffect(() => {
    if (!product) return;
    /* sync server product into form when navigating between SKUs */
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from Convex query
    setForm({
      name: product.name,
      slug: product.slug,
      tagline: product.tagline,
      description: product.description,
      longDescription: product.longDescription ?? "",
      priceCents: product.priceCents,
      isActive: product.isActive,
      trackInventory: product.trackInventory,
      inventoryCount: product.inventoryCount ?? 0,
      stripePriceId: product.stripePriceId ?? "",
      heroImagePath: product.heroImagePath ?? "",
      ingredientsText: (product.ingredients ?? []).join("\n"),
      howToUse: product.howToUse ?? "",
      beforeAfterText: (product.beforeAfterSlides ?? [])
        .map((s) => {
          const k = s.kind ?? "before";
          const p = s.publicPath ?? "";
          return `${k}|${p}|${s.alt}`;
        })
        .join("\n"),
    });
    setStory({
      features: product.features.map((f) => ({ ...f })),
      ritualSteps: product.ritualSteps.map((s) => ({ ...s })),
      ratingAverage:
        product.ratingAverage != null && product.ratingAverage > 0 ?
          String(product.ratingAverage)
        : "",
      ratingCount:
        product.ratingCount != null && product.ratingCount > 0 ?
          String(product.ratingCount)
        : "",
      testimonialQuote: product.testimonialQuote ?? "",
      testimonialAuthor: product.testimonialAuthor ?? "",
      testimonialTitle: product.testimonialTitle ?? "",
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
    });
  }, [product]);

  if (list && !product) {
    return (
      <p className="text-sm text-destructive">
        Product not found.{" "}
        <Link href="/admin/products" className="text-gold underline">
          Back
        </Link>
      </p>
    );
  }

  if (!product) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/admin/products" className="text-xs text-gold hover:underline">
          ← Products
        </Link>
        <h1 className="mt-2 font-heading text-2xl">Edit {product.name}</h1>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const storyExtras = storyFieldsToConvexExtras(story, "update");
          void update({
            id,
            name: form.name,
            slug: form.slug,
            tagline: form.tagline,
            description: form.description,
            longDescription: form.longDescription || undefined,
            priceCents: Number(form.priceCents),
            isActive: form.isActive,
            trackInventory: form.trackInventory,
            inventoryCount:
              form.trackInventory ?
                Math.max(0, Number(form.inventoryCount) || 0)
              : undefined,
            stripePriceId: form.stripePriceId || undefined,
            heroImagePath: form.heroImagePath || undefined,
            ingredients: parseIngredientsText(form.ingredientsText),
            howToUse: form.howToUse.trim() || undefined,
            beforeAfterSlides: parseBeforeAfterText(form.beforeAfterText),
            ...storyExtras,
          })
            .then(() => toast.success("Saved"))
            .catch(() => toast.error("Save failed"));
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) =>
              setForm((f) => ({ ...f, tagline: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="long">Long description</Label>
          <Textarea
            id="long"
            rows={4}
            value={form.longDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, longDescription: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients (one per line, INCI)</Label>
          <Textarea
            id="ingredients"
            rows={5}
            placeholder={"Aloe Barbadensis Leaf Juice\nNiacinamide"}
            value={form.ingredientsText}
            onChange={(e) =>
              setForm((f) => ({ ...f, ingredientsText: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="howToUse">How to use</Label>
          <Textarea
            id="howToUse"
            rows={4}
            placeholder="Use **bold** for emphasis."
            value={form.howToUse}
            onChange={(e) =>
              setForm((f) => ({ ...f, howToUse: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beforeAfter">
            Before / after carousel (one slide per line)
          </Label>
          <Textarea
            id="beforeAfter"
            rows={3}
            placeholder={[
              "before|/products/serum-1.svg|Week 1",
              "after|/products/cream-1.svg|Week 6",
            ].join("\n")}
            value={form.beforeAfterText}
            onChange={(e) =>
              setForm((f) => ({ ...f, beforeAfterText: e.target.value }))
            }
          />
          <p className="text-[11px] text-muted-foreground">
            Format: <code className="text-gold">before|/path.svg|Alt text</code>{" "}
            or <code className="text-gold">after|...</code>
          </p>
        </div>

        <ProductStorySections value={story} onChange={setStory} />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (cents)</Label>
            <Input
              id="price"
              type="number"
              value={form.priceCents}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  priceCents: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv">Inventory (when tracking)</Label>
            <Input
              id="inv"
              type="number"
              min={0}
              disabled={!form.trackInventory}
              value={form.inventoryCount}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  inventoryCount: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stripe">Stripe price ID (optional)</Label>
          <Input
            id="stripe"
            value={form.stripePriceId}
            onChange={(e) =>
              setForm((f) => ({ ...f, stripePriceId: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero">Hero public path (e.g. /products/serum-1.svg)</Label>
          <Input
            id="hero"
            value={form.heroImagePath}
            onChange={(e) =>
              setForm((f) => ({ ...f, heroImagePath: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="trackInv"
              type="checkbox"
              checked={form.trackInventory}
              onChange={(e) =>
                setForm((f) => ({ ...f, trackInventory: e.target.checked }))
              }
            />
            <Label htmlFor="trackInv">Track inventory</Label>
          </div>
        </div>
        <Button type="submit" className="bg-gold text-primary-foreground">
          Save changes
        </Button>
      </form>

      <div className="rounded-md border border-border p-4">
        <p className="text-sm font-medium">Gallery</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery?.map((g) => (
            <div
              key={g.url}
              className="relative aspect-square overflow-hidden rounded border border-border"
            >
              <Image src={g.url} alt={g.alt} fill className="object-cover" sizes="120px" />
            </div>
          ))}
        </div>
        <Input
          type="file"
          accept="image/*"
          className="mt-3"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            void (async () => {
              try {
                const postUrl = await genUrl({});
                const res = await fetch(postUrl, {
                  method: "POST",
                  headers: { "Content-Type": file.type },
                  body: file,
                });
                const raw = await res.text();
                let storageId: Id<"_storage">;
                try {
                  storageId = (JSON.parse(raw) as { storageId: Id<"_storage"> }).storageId;
                } catch {
                  storageId = raw.trim() as Id<"_storage">;
                }
                await addImg({
                  productId: id,
                  storageId,
                  alt: file.name,
                  sortOrder: nextSort,
                });
                toast.success("Image uploaded");
              } catch {
                toast.error("Upload failed");
              }
            })();
          }}
        />
      </div>

      {imagesRows && imagesRows.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Remove stored images</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {imagesRows.map((img) => (
              <li key={img._id} className="flex justify-between gap-2">
                <span>{img.alt}</span>
                <button
                  type="button"
                  className="text-destructive hover:underline"
                  onClick={() =>
                    void removeImg({ imageId: img._id }).then(() =>
                      toast.message("Image removed"),
                    )
                  }
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
