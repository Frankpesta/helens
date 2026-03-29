import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/authz";

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const lim = Math.min(args.limit ?? 20, 50);
    return await ctx.db
      .query("journalPosts")
      .withIndex("by_published_and_publishedAt", (q) =>
        q.eq("published", true),
      )
      .order("desc")
      .take(lim);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("journalPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("journalPosts").order("desc").take(100);
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    heroPublicPath: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    return await ctx.db.insert("journalPosts", {
      slug: args.slug,
      title: args.title,
      excerpt: args.excerpt,
      body: args.body,
      heroPublicPath: args.heroPublicPath,
      published: args.published,
      publishedAt: args.published ? now : undefined,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("journalPosts"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    body: v.optional(v.string()),
    heroPublicPath: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    const patch = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    ) as Record<string, unknown>;
    let publishedAt: number | undefined = undefined;
    if (rest.published === true) {
      const cur = await ctx.db.get(id);
      if (cur && !cur.published) publishedAt = Date.now();
    }
    await ctx.db.patch(id, {
      ...patch,
      ...(publishedAt !== undefined ? { publishedAt } : {}),
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("journalPosts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
