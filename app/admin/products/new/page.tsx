"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  parseBeforeAfterText,
  parseIngredientsText,
  slugify,
} from "@/lib/admin-product-parsers";

export default function AdminNewProductPage() {
  const router = useRouter();
  const products = useQuery(api.products.listAllForAdminIncludingInactive, {});
  const createProduct = useMutation(api.products.create);

  const nextSortOrder = useMemo(() => {
    if (!products?.length) return 1;
    return Math.max(...products.map((p) => p.sortOrder)) + 1;
  }, [products]);

  const [slugTouched, setSlugTouched] = useState(false);
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

  if (!products) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <Link href="/admin/products" className="text-xs text-gold hover:underline">
          ← Products
        </Link>
        <h1 className="mt-2 font-heading text-2xl">New product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Core listing fields, ingredients, how to use, and optional before/after
          slides (public paths). Upload gallery images after saving.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const name = form.name.trim();
          const slug = (form.slug.trim() || slugify(name)).trim();
          if (!name || !slug) {
            toast.error("Name and slug are required");
            return;
          }
          const slides = parseBeforeAfterText(form.beforeAfterText);
          void createProduct({
            name,
            slug,
            tagline: form.tagline.trim(),
            description: form.description.trim(),
            longDescription: form.longDescription.trim() || undefined,
            priceCents: Math.max(0, Number(form.priceCents) || 0),
            currency: "USD",
            stripePriceId: form.stripePriceId.trim() || undefined,
            isActive: form.isActive,
            sortOrder: nextSortOrder,
            trackInventory: form.trackInventory,
            inventoryCount:
              form.trackInventory ? Math.max(0, Number(form.inventoryCount) || 0) : undefined,
            features: [],
            ritualSteps: [],
            heroImagePath: form.heroImagePath.trim() || undefined,
            ingredients: parseIngredientsText(form.ingredientsText),
            howToUse: form.howToUse.trim() || undefined,
            beforeAfterSlides: slides.length ? slides : undefined,
          })
            .then((id) => {
              toast.success("Product created");
              router.push(`/admin/products/${id}`);
            })
            .catch((err: Error) =>
              toast.error(err.message ?? "Could not create product"),
            );
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: slugTouched ? f.slug : slugify(name),
              }));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={form.slug}
            placeholder="auto from name"
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
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
          <Label htmlFor="description">Short description</Label>
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
          <Label htmlFor="long">Long description (optional)</Label>
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
          <Label htmlFor="howToUse">How to use (optional)</Label>
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
            Before / after carousel (optional, one slide per line)
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
            Format:{" "}
            <code className="text-gold">before|/path/to/image|Alt text</code> or{" "}
            <code className="text-gold">after|...</code>. Add uploads on the edit
            screen after creation.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (cents)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={form.priceCents || ""}
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
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="bg-gold text-primary-foreground">
            Create product
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
