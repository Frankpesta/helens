"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const settings = useQuery(api.siteSettings.getMain);
  const update = useMutation(api.siteSettings.updateMain);
  const products = useQuery(api.products.listActive, {});

  const [form, setForm] = useState({
    brandName: "",
    heroEyebrow: "",
    heroTitleLine1: "",
    heroTitleLine2Gold: "",
    heroDescription: "",
    heroCtaShop: "",
    heroCtaStory: "",
    newsletterHeading: "",
    newsletterPlaceholder: "",
    footerTagline: "",
    featuredSlugs: "",
    valuesTitle: "",
    valuesSubtitle: "",
  });

  useEffect(() => {
    if (!settings) return;
    const featured = products?.filter((p) =>
      settings.featuredProductIds.includes(p._id),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from Convex
    setForm({
      brandName: settings.brandName,
      heroEyebrow: settings.heroEyebrow,
      heroTitleLine1: settings.heroTitleLine1,
      heroTitleLine2Gold: settings.heroTitleLine2Gold,
      heroDescription: settings.heroDescription,
      heroCtaShop: settings.heroCtaShop,
      heroCtaStory: settings.heroCtaStory,
      newsletterHeading: settings.newsletterHeading,
      newsletterPlaceholder: settings.newsletterPlaceholder,
      footerTagline: settings.footerTagline,
      featuredSlugs: featured?.map((p) => p.slug).join(", ") ?? "",
      valuesTitle: settings.valuesTitle,
      valuesSubtitle: settings.valuesSubtitle,
    });
  }, [settings, products]);

  if (!settings || !products) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Site settings</h1>
        <p className="text-sm text-muted-foreground">
          Hero copy, navigation-adjacent content, and featured SKUs (by slug).
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const ids = form.featuredSlugs
            .split(",")
            .map((s) => s.trim())
            .map((slug) => products.find((p) => p.slug === slug)?._id)
            .filter(Boolean) as typeof settings.featuredProductIds;
          void update({
            brandName: form.brandName,
            heroEyebrow: form.heroEyebrow,
            heroTitleLine1: form.heroTitleLine1,
            heroTitleLine2Gold: form.heroTitleLine2Gold,
            heroDescription: form.heroDescription,
            heroCtaShop: form.heroCtaShop,
            heroCtaStory: form.heroCtaStory,
            newsletterHeading: form.newsletterHeading,
            newsletterPlaceholder: form.newsletterPlaceholder,
            footerTagline: form.footerTagline,
            featuredProductIds: ids.length ? ids : settings.featuredProductIds,
            valuesTitle: form.valuesTitle,
            valuesSubtitle: form.valuesSubtitle,
          })
            .then(() => toast.success("Settings saved"))
            .catch(() => toast.error("Save failed"));
        }}
      >
        <div className="space-y-2">
          <Label>Brand name</Label>
          <Input
            value={form.brandName}
            onChange={(e) =>
              setForm((f) => ({ ...f, brandName: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Hero eyebrow</Label>
          <Input
            value={form.heroEyebrow}
            onChange={(e) =>
              setForm((f) => ({ ...f, heroEyebrow: e.target.value }))
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Hero title line 1</Label>
            <Input
              value={form.heroTitleLine1}
              onChange={(e) =>
                setForm((f) => ({ ...f, heroTitleLine1: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Hero gold line</Label>
            <Input
              value={form.heroTitleLine2Gold}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  heroTitleLine2Gold: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Hero description</Label>
          <Textarea
            rows={3}
            value={form.heroDescription}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                heroDescription: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA shop label</Label>
            <Input
              value={form.heroCtaShop}
              onChange={(e) =>
                setForm((f) => ({ ...f, heroCtaShop: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>CTA story label</Label>
            <Input
              value={form.heroCtaStory}
              onChange={(e) =>
                setForm((f) => ({ ...f, heroCtaStory: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Featured product slugs (comma)</Label>
          <Input
            value={form.featuredSlugs}
            onChange={(e) =>
              setForm((f) => ({ ...f, featuredSlugs: e.target.value }))
            }
            placeholder="aura-glow-serum, midnight-renewal-oil"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Values title</Label>
            <Input
              value={form.valuesTitle}
              onChange={(e) =>
                setForm((f) => ({ ...f, valuesTitle: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Values subtitle</Label>
            <Input
              value={form.valuesSubtitle}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  valuesSubtitle: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Newsletter heading</Label>
          <Input
            value={form.newsletterHeading}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                newsletterHeading: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Newsletter placeholder</Label>
          <Input
            value={form.newsletterPlaceholder}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                newsletterPlaceholder: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Footer tagline</Label>
          <Input
            value={form.footerTagline}
            onChange={(e) =>
              setForm((f) => ({ ...f, footerTagline: e.target.value }))
            }
          />
        </div>
        <Button type="submit" className="bg-gold text-primary-foreground">
          Save settings
        </Button>
      </form>
    </div>
  );
}
