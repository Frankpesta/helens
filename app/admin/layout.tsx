"use client";

import { useConvexAuth } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebarContent } from "@/components/admin/admin-sidebar-content";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Close sheet after navigation (e.g. back/forward); links also call onNavigate.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional UI reset on pathname change
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoading) return;
    const publicAdminPaths = ["/admin/login", "/admin/setup"];
    if (!isAuthenticated && !publicAdminPaths.includes(pathname ?? "")) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (pathname === "/admin/login" || pathname === "/admin/setup") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop: fixed sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/80 bg-[oklch(0.085_0.012_285)] md:flex"
        aria-label="Admin navigation"
      >
        <AdminSidebarContent
          signOut={() => void signOut()}
        />
      </aside>

      {/* Main column: toolbar + scrollable content */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-background/95 px-3 backdrop-blur-md md:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-foreground"
                aria-label="Open admin menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[min(100vw-3rem,20rem)] flex-col border-border/80 bg-[oklch(0.085_0.012_285)] p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Admin menu</SheetTitle>
              </SheetHeader>
              <AdminSidebarContent
                onNavigate={() => setMobileNavOpen(false)}
                signOut={() => void signOut()}
              />
            </SheetContent>
          </Sheet>
          <span className="min-w-0 truncate font-heading text-sm font-medium text-foreground">
            {`Helen's Admin`}
          </span>
        </header>

        <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-linear-to-br from-background via-background to-[oklch(0.11_0.02_285)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.9_0.14_88_/0.08),transparent)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
