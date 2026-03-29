"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Database, Package, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

export default function AdminHomePage() {
  const kpis = useQuery(api.orders.adminKpis, {});
  const settings = useQuery(api.siteSettings.getMain);
  const products = useQuery(api.products.listAllForAdminIncludingInactive, {});
  const seed = useMutation(api.products.seedIfEmpty);
  const seedLoading = settings === undefined || products === undefined;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl">
          Overview
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Revenue sums paid and fulfilled orders. Use{" "}
          <span className="text-gold/90">Seed / repair catalog</span> if the
          storefront says there are no site settings yet — it now fills in
          missing settings even when products already exist.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/80 bg-card/60 ring-1 ring-gold/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wider">
              <TrendingUp className="size-3.5 text-gold" />
              Revenue (est.)
            </CardDescription>
            <CardTitle className="font-heading text-2xl font-normal text-gold md:text-3xl">
              {kpis ? formatMoney(kpis.revenueCents) : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/80 bg-card/60">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wider">
              <Package className="size-3.5 text-muted-foreground" />
              Paid orders
            </CardDescription>
            <CardTitle className="font-heading text-2xl font-normal md:text-3xl">
              {kpis?.paidCount ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/80 bg-card/60">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wider">
              <AlertTriangle className="size-3.5 text-muted-foreground" />
              Low stock SKUs
            </CardDescription>
            <CardTitle className="font-heading text-2xl font-normal md:text-3xl">
              {kpis?.lowStockCount ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-dashed border-gold/35 bg-card/40 ring-1 ring-gold/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground">
            <Database className="size-5 text-gold" />
            Catalog &amp; site content
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            First run adds six products, main site settings, and a journal post.
            If you already have products but the store shows &quot;No site
            settings&quot;, one click creates the missing settings (and a
            default journal post if the table is empty).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className={settings ? "text-emerald-400/90" : "text-amber-400/90"}>
              {settings === undefined
                ? "Checking site settings…"
                : settings
                  ? "Site settings: OK"
                  : "Site settings: missing"}
            </span>
            <span className="text-muted-foreground">
              {products === undefined
                ? "Products: …"
                : `Products: ${products.length}`}
            </span>
          </div>
          <Button
            type="button"
            className="shrink-0 bg-gold text-primary-foreground shadow-[0_0_24px_oklch(0.9_0.14_88_/0.2)] hover:bg-gold/90"
            disabled={seedLoading}
            onClick={() =>
              void seed({})
                .then((r) => {
                  if (!r.seeded) {
                    toast.message("Nothing to do", {
                      description:
                        "Products, site settings, and journal are already present.",
                    });
                    return;
                  }
                  if (r.count > 0) {
                    toast.success(`Seeded ${r.count} products`, {
                      description: "Site settings and sample journal post added.",
                    });
                  } else {
                    toast.success("Storefront content repaired", {
                      description:
                        "Created missing site settings (and journal if needed). Open the shop in a new tab.",
                    });
                  }
                })
                .catch((e: Error) => {
                  toast.error(e.message ?? "Seed failed");
                })
            }
          >
            <Sparkles className="mr-2 size-4" />
            Seed / repair catalog
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
