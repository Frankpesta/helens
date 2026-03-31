import { mutation, query, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { requireAdmin } from "./lib/authz";

export const internalGet = internalQuery({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const message = args.message.trim();
    if (!name || !email || !message) {
      throw new Error("Please complete all fields.");
    }
    if (message.length > 8000) throw new Error("Message is too long.");
    const id = await ctx.db.insert("contactMessages", {
      name,
      email,
      message,
      createdAt: Date.now(),
      read: false,
    });
    await ctx.scheduler.runAfter(0, internal.emailNode.notifyNewContactMessage, {
      contactMessageId: id,
    });
    return id;
  },
});

export const listForAdmin = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lim = Math.min(args.limit ?? 100, 200);
    return await ctx.db.query("contactMessages").order("desc").take(lim);
  },
});

export const markRead = mutation({
  args: { id: v.id("contactMessages"), read: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { read: args.read });
  },
});
