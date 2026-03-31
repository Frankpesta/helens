import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/authz";

export const getMainForEmail = internalQuery({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();
    return {
      brandName: doc?.brandName ?? "Helen's Beauty Secret",
    };
  },
});

export const getMain = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();
  },
});

export const updateMain = mutation({
  args: {
    brandName: v.optional(v.string()),
    heroEyebrow: v.optional(v.string()),
    heroTitleLine1: v.optional(v.string()),
    heroTitleLine2Gold: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    heroCtaShop: v.optional(v.string()),
    heroCtaStory: v.optional(v.string()),
    featuredProductIds: v.optional(v.array(v.id("products"))),
    valuesTitle: v.optional(v.string()),
    valuesSubtitle: v.optional(v.string()),
    valuesItems: v.optional(
      v.array(
        v.object({
          step: v.string(),
          title: v.string(),
          description: v.string(),
        }),
      ),
    ),
    testimonials: v.optional(
      v.array(
        v.object({
          quote: v.string(),
          author: v.string(),
          title: v.string(),
        }),
      ),
    ),
    newsletterHeading: v.optional(v.string()),
    newsletterPlaceholder: v.optional(v.string()),
    footerTagline: v.optional(v.string()),
    stripePublishableKeyHint: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    facebookUrl: v.optional(v.string()),
    pinterestUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();
    const patch = Object.fromEntries(
      Object.entries(args).filter(([, val]) => val !== undefined),
    ) as Record<string, unknown>;
    if (!doc) {
      throw new Error("Site settings missing; run seed first.");
    }
    await ctx.db.patch(doc._id, { ...patch, updatedAt: Date.now() });
  },
});
