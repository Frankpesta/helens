"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMoney } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { AdminBusinessCharts } from "@/components/admin/admin-business-charts";

export default function AdminHomePage() {
  const kpis = useQuery(api.orders.adminKpis, {});
  const revenueTrend = useQuery(api.orders.adminRevenueTrend, { days: 30 });
  const signupTrend = useQuery(api.newsletter.adminSignupTrend, { days: 30 });

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl">
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Revenue includes paid, processing, shipped, and fulfilled orders. Trends
          use UTC calendar days.
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
              Paid pipeline
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

      <section aria-label="Business trends">
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="font-heading text-xl text-foreground md:text-2xl">
            Business trends
          </h2>
          <p className="text-sm text-muted-foreground">
            Last 30 days — sales motion, revenue buildup, and list growth.
          </p>
        </div>
        <AdminBusinessCharts
          revenueTrend={revenueTrend}
          signupTrend={signupTrend}
        />
      </section>
    </div>
  );
}
