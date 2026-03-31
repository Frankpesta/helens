import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/authz";

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Public: subscribe from storefront forms. Idempotent per email. */
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    if (!email || !email.includes("@") || email.length > 254) {
      throw new Error("Please enter a valid email address.");
    }
    const local = email.split("@")[0] ?? "";
    const domain = email.split("@")[1] ?? "";
    if (!local || !domain || !domain.includes(".")) {
      throw new Error("Please enter a valid email address.");
    }

    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      return { ok: true as const, alreadySubscribed: true as const };
    }

    await ctx.db.insert("newsletterSubscribers", {
      email,
      createdAt: Date.now(),
      source: args.source ?? "home",
    });
    return { ok: true as const, alreadySubscribed: false as const };
  },
});

/** Daily newsletter signups for admin charts (UTC). */
export const adminSignupTrend = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const dayCount = Math.min(Math.max(args.days ?? 30, 7), 90);
    const end = Date.now();

    const utcDayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);
    const bucketKeys: string[] = [];
    for (let i = dayCount - 1; i >= 0; i--) {
      bucketKeys.push(utcDayKey(end - i * 86_400_000));
    }
    const counts = new Map<string, number>();
    for (const k of bucketKeys) counts.set(k, 0);

    const startMs = new Date(bucketKeys[0]!).getTime();
    const subs = await ctx.db
      .query("newsletterSubscribers")
      .order("desc")
      .take(4000);
    for (const s of subs) {
      if (s.createdAt < startMs - 86_400_000) continue;
      const k = utcDayKey(s.createdAt);
      if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
    }

    let cumulative = 0;
    const series = bucketKeys.map((date) => {
      const n = counts.get(date) ?? 0;
      cumulative += n;
      return {
        date,
        label: date.slice(5),
        signups: n,
        signupsCumulative: cumulative,
      };
    });
    return { series };
  },
});

export const listForAdmin = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lim = Math.min(args.limit ?? 200, 500);
    return await ctx.db
      .query("newsletterSubscribers")
      .order("desc")
      .take(lim);
  },
});
