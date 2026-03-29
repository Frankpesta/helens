import {
  internalMutation,
  query,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/authz";

export const getByCheckoutSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripeCheckoutSessionId", (q) =>
        q.eq("stripeCheckoutSessionId", args.sessionId),
      )
      .unique();
  },
});

export const listForAdmin = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending_payment"),
        v.literal("paid"),
        v.literal("fulfilled"),
        v.literal("canceled"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lim = Math.min(args.limit ?? 50, 200);
    if (args.status !== undefined) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(lim);
    }
    return await ctx.db.query("orders").order("desc").take(lim);
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("fulfilled"), v.literal("canceled")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const markPaidFromStripe = internalMutation({
  args: {
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    email: v.optional(v.string()),
    amountTotalCents: v.optional(v.number()),
    currency: v.optional(v.string()),
    shippingSnapshot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_stripeCheckoutSessionId", (q) =>
        q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId),
      )
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "paid",
        email: args.email ?? existing.email,
        amountTotalCents: args.amountTotalCents ?? existing.amountTotalCents,
        currency: args.currency ?? existing.currency,
        stripePaymentIntentId:
          args.stripePaymentIntentId ?? existing.stripePaymentIntentId,
        shippingSnapshot: args.shippingSnapshot ?? existing.shippingSnapshot,
        updatedAt: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("orders", {
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      email: args.email,
      status: "paid",
      amountTotalCents: args.amountTotalCents,
      currency: args.currency,
      lineItems: [],
      shippingSnapshot: args.shippingSnapshot,
      updatedAt: now,
    });
  },
});

export const createPendingCheckoutRecord = internalMutation({
  args: {
    stripeCheckoutSessionId: v.string(),
    lineItems: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        quantity: v.number(),
        unitAmountCents: v.number(),
        productId: v.optional(v.id("products")),
      }),
    ),
    customerUserId: v.optional(v.id("users")),
    deliveryOption: v.optional(v.string()),
    shippingFeeCents: v.optional(v.number()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_stripeCheckoutSessionId", (q) =>
        q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId),
      )
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("orders", {
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      status: "pending_payment",
      lineItems: args.lineItems,
      customerUserId: args.customerUserId,
      deliveryOption: args.deliveryOption,
      shippingFeeCents: args.shippingFeeCents,
      email: args.email,
      updatedAt: Date.now(),
    });
  },
});

export const purgeStalePendingOrders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const pending = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "pending_payment"))
      .take(200);
    for (const o of pending) {
      if (o._creationTime < cutoff) {
        await ctx.db.delete(o._id);
      }
    }
    return null;
  },
});

export const adminKpis = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const paid = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "paid"))
      .take(500);
    const fulfilled = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "fulfilled"))
      .take(500);
    let revenueCents = 0;
    for (const o of paid) revenueCents += o.amountTotalCents ?? 0;
    for (const o of fulfilled) revenueCents += o.amountTotalCents ?? 0;
    const active = await ctx.db
      .query("products")
      .withIndex("by_isActive_and_sortOrder", (q) => q.eq("isActive", true))
      .take(100);
    let lowStockCount = 0;
    for (const p of active) {
      if (!p.trackInventory) continue;
      const inv = p.inventoryCount ?? 0;
      if (inv < 5) lowStockCount++;
    }
    return {
      revenueCents,
      paidCount: paid.length,
      fulfilledCount: fulfilled.length,
      lowStockCount,
    };
  },
});
