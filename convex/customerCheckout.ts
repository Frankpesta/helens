import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { deliveryLabelForOption, shippingFeeForOption } from "./shipping";
import type { Doc } from "./_generated/dataModel";

function isProfileComplete(
  p: Doc<"customerProfiles"> | null | undefined,
): boolean {
  if (!p) return false;
  if (
    !p.fullName.trim() ||
    !p.phone.trim() ||
    !p.line1.trim() ||
    !p.city.trim() ||
    !p.postalCode.trim() ||
    !p.country.trim() ||
    !p.preferredDeliveryOption
  ) {
    return false;
  }
  return shippingFeeForOption(p.preferredDeliveryOption) !== null;
}

export const getCheckoutContext = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { step: "sign-in" as const };
    const profile = await ctx.db
      .query("customerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!isProfileComplete(profile)) {
      return { step: "details" as const, profile: profile ?? null };
    }
    return { step: "ready" as const, profile: profile! };
  },
});

/** Validates the signed-in user, completed profile, and delivery tier. Used from checkout action. */
export const assertCheckoutAllowed = query({
  args: { deliveryOption: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Please sign in to continue.");
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("customerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!isProfileComplete(profile)) {
      throw new Error("Please complete your delivery details before paying.");
    }
    const fee = shippingFeeForOption(args.deliveryOption);
    if (fee === null) throw new Error("Invalid delivery option.");
    const deliveryLabel =
      deliveryLabelForOption(args.deliveryOption) ?? args.deliveryOption;
    const email = profile!.email ?? user?.email ?? undefined;
    return {
      userId,
      profile: profile!,
      shippingFeeCents: fee,
      deliveryLabel,
      email: email ?? undefined,
    };
  },
});

export const saveProfile = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    postalCode: v.string(),
    country: v.string(),
    preferredDeliveryOption: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");
    if (shippingFeeForOption(args.preferredDeliveryOption) === null) {
      throw new Error("Invalid delivery option");
    }
    const user = await ctx.db.get(userId);
    const email = user?.email;
    const now = Date.now();
    const existing = await ctx.db
      .query("customerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, email, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("customerProfiles", {
      userId,
      ...args,
      email,
      updatedAt: now,
    });
  },
});

export const updateDeliveryPreference = mutation({
  args: { preferredDeliveryOption: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");
    if (shippingFeeForOption(args.preferredDeliveryOption) === null) {
      throw new Error("Invalid delivery option");
    }
    const existing = await ctx.db
      .query("customerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!existing) throw new Error("Complete your profile first");
    await ctx.db.patch(existing._id, {
      preferredDeliveryOption: args.preferredDeliveryOption,
      updatedAt: Date.now(),
    });
  },
});
