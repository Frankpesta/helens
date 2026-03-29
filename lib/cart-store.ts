"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Id } from "@/convex/_generated/dataModel";

export type CartLine = {
  productId: Id<"products">;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  /** Incremented when items are added so the header badge can pulse subtly */
  bagPulseAt: number;
  pulseBag: () => void;
  add: (productId: Id<"products">, qty?: number) => void;
  setQty: (productId: Id<"products">, qty: number) => void;
  remove: (productId: Id<"products">) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      bagPulseAt: 0,
      pulseBag: () => set({ bagPulseAt: Date.now() }),
      add: (productId, qty = 1) => {
        const lines = get().lines;
        const i = lines.findIndex((l) => l.productId === productId);
        if (i === -1) {
          set({ lines: [...lines, { productId, quantity: qty }] });
        } else {
          const next = [...lines];
          next[i] = {
            ...next[i],
            quantity: next[i].quantity + qty,
          };
          set({ lines: next });
        }
      },
      setQty: (productId, qty) => {
        if (qty < 1) {
          set({
            lines: get().lines.filter((l) => l.productId !== productId),
          });
          return;
        }
        const lines = get().lines.map((l) =>
          l.productId === productId ? { ...l, quantity: qty } : l,
        );
        set({ lines });
      },
      remove: (productId) =>
        set({
          lines: get().lines.filter((l) => l.productId !== productId),
        }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "helens-cart",
      skipHydration: true,
    },
  ),
);

export function cartItemCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.quantity, 0);
}
