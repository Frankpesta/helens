import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/** Orders tied to the signed-in customer (via checkout). */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db
      .query("orders")
      .withIndex("by_customerUserId", (q) => q.eq("customerUserId", userId))
      .order("desc")
      .take(100);
  },
});

export const mySpendingSummary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customerUserId", (q) => q.eq("customerUserId", userId))
      .collect();
    let totalSpentCents = 0;
    let completedCount = 0;
    for (const o of orders) {
      if (o.status === "paid" || o.status === "fulfilled") {
        totalSpentCents += o.amountTotalCents ?? 0;
        completedCount += 1;
      }
    }
    return {
      allOrdersCount: orders.length,
      completedPurchaseCount: completedCount,
      totalSpentCents,
    };
  },
});
