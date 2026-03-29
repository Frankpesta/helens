"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = convexUrl
  ? new ConvexReactClient(convexUrl)
  : (null as unknown as ConvexReactClient);

function CartRehydrate() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  if (!convexUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
        Set{" "}
        <code className="mx-1 text-gold">NEXT_PUBLIC_CONVEX_URL</code> in{" "}
        <code className="mx-1">.env.local</code>.
      </div>
    );
  }
  return (
    <>
      <CartRehydrate />
      <ConvexAuthNextjsProvider client={convex}>
        {children}
      </ConvexAuthNextjsProvider>
    </>
  );
}
