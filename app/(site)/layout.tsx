"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useQuery(api.siteSettings.getMain);

  if (settings === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24 text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 pb-24 pt-32 text-center">
        <p className="font-heading text-xl text-gold md:text-2xl">
          No site settings yet
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The database needs the main site document (and usually the sample
          catalog). In the admin overview, use{" "}
          <span className="text-foreground/90">Seed / repair catalog</span> — it
          adds settings even if products already exist.
        </p>
        <Button
          asChild
          className="mt-8 bg-gold text-primary-foreground hover:bg-gold/90"
        >
          <Link href="/admin">Open admin</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="site-grain relative flex min-h-screen flex-col">
      <SiteHeader brandName={settings.brandName} />
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter
        brandName={settings.brandName}
        tagline={settings.footerTagline}
      />
    </div>
  );
}
