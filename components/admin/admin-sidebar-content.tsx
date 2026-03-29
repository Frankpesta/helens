"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Package,
  Settings2,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/journal", label: "Journal", icon: BookOpen },
  { href: "/admin/settings", label: "Site", icon: Settings2 },
] as const;

export function AdminSidebarContent({
  onNavigate,
  signOut,
}: {
  onNavigate?: () => void;
  signOut: () => void | Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-border/60 px-4 py-5 md:px-5 md:py-6">
        <div className="h-1 w-10 rounded-full bg-gold shadow-[0_0_16px_oklch(0.9_0.14_88_/0.35)]" />
        <p className="mt-4 font-heading text-lg tracking-wide text-foreground">
          {`Helen's Admin`}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Catalog, orders, and site copy.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full border-border/80 bg-transparent text-xs text-muted-foreground hover:border-gold/40 hover:bg-gold/5 hover:text-gold"
          type="button"
          onClick={() => void signOut()}
        >
          <LogOut className="mr-2 size-3.5 opacity-70" />
          Sign out
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ?
              pathname === "/admin"
            : pathname === href || Boolean(pathname?.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-gold/10 font-medium text-gold shadow-[inset_3px_0_0_0_var(--gold)]"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" />
              {label}
            </Link>
          );
        })}
        <Separator className="my-3 bg-border/60" />
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/50 hover:text-gold"
        >
          <Store className="size-4" />
          View storefront
        </Link>
      </nav>
    </>
  );
}
