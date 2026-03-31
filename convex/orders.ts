import {
  internalMutation,
  internalQuery,
  query,
  mutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { requireAdmin } from "./lib/authz";

const orderStatusFilter = v.union(
  v.literal("pending_payment"),
  v.literal("paid"),
  v.literal("processing"),
  v.literal("shipped"),
  v.literal("fulfilled"),
  v.literal("canceled"),
);

const adminPostPaymentStatus = v.union(
  v.literal("paid"),
  v.literal("processing"),
  v.literal("shipped"),
  v.literal("fulfilled"),
  v.literal("canceled"),
);

export const internalGetOrder = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const markOrderConfirmationEmailSent = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { orderConfirmationSentAt: Date.now() });
  },
});

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
    status: v.optional(orderStatusFilter),
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

/** Admin status changes (post-payment workflow + cancel). Triggers customer email via scheduler. */
export const setAdminStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: adminPostPaymentStatus,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    const prev = order.status;
    const next = args.status;
    if (prev === next) return;
    if (prev === "pending_payment" && next !== "canceled") {
      throw new Error(
        "This checkout is still unpaid. Cancel it or wait for Stripe to mark it paid.",
      );
    }
    await ctx.db.patch(args.orderId, {
      status: next,
      updatedAt: Date.now(),
    });
    const skipEmail =
      prev === "pending_payment" && next === "canceled";
    if (!skipEmail) {
      await ctx.scheduler.runAfter(0, internal.emailNode.sendOrderStatusEmail, {
        orderId: args.orderId,
        previousStatus: prev,
        newStatus: next,
      });
    }
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

function utcDayKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Daily buckets for admin charts (UTC dates). Paid-through-fulfilled revenue by order creation day. */
export const adminRevenueTrend = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const dayCount = Math.min(Math.max(args.days ?? 30, 7), 90);
    const end = Date.now();
    const isRevenueStatus = (s: string) =>
      s === "paid" ||
      s === "processing" ||
      s === "shipped" ||
      s === "fulfilled";

    const bucketKeys: string[] = [];
    for (let i = dayCount - 1; i >= 0; i--) {
      bucketKeys.push(utcDayKey(end - i * 86_400_000));
    }
    const buckets = new Map<
      string,
      { revenueCents: number; orders: number }
    >();
    for (const k of bucketKeys) {
      buckets.set(k, { revenueCents: 0, orders: 0 });
    }

    const rows = await ctx.db.query("orders").order("desc").take(3000);
    const startMs = new Date(bucketKeys[0]!).getTime();
    for (const o of rows) {
      if (o._creationTime < startMs - 86_400_000) continue;
      if (!isRevenueStatus(o.status)) continue;
      const key = utcDayKey(o._creationTime);
      const b = buckets.get(key);
      if (!b) continue;
      b.revenueCents += o.amountTotalCents ?? 0;
      b.orders += 1;
    }

    let cumulativeCents = 0;
    const series = bucketKeys.map((date) => {
      const b = buckets.get(date)!;
      cumulativeCents += b.revenueCents;
      return {
        date,
        label: date.slice(5),
        revenueCents: b.revenueCents,
        revenue: Math.round(b.revenueCents) / 100,
        orders: b.orders,
        revenueCumulative: Math.round(cumulativeCents) / 100,
      };
    });

    return { series };
  },
});

export const adminKpis = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const revenueStatuses = [
      "paid",
      "processing",
      "shipped",
      "fulfilled",
    ] as const;
    let revenueCents = 0;
    let paidishCount = 0;
    for (const st of revenueStatuses) {
      const rows = await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", st))
        .take(500);
      paidishCount += rows.length;
      for (const o of rows) revenueCents += o.amountTotalCents ?? 0;
    }
    const fulfilled = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "fulfilled"))
      .take(500);
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
      paidCount: paidishCount,
      fulfilledCount: fulfilled.length,
      lowStockCount,
    };
  },
});
