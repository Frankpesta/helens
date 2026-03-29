"use node";

import Stripe from "stripe";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const verifyWebhook = internalAction({
  args: {
    rawBody: v.string(),
    signature: v.string(),
  },
  handler: async (_ctx, args) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
    const event = stripe.webhooks.constructEvent(
      args.rawBody,
      args.signature,
      secret,
    );
    return JSON.stringify(event);
  },
});

export const fulfillCheckout = internalAction({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
    const session = await stripe.checkout.sessions.retrieve(args.sessionId, {
      expand: ["line_items"],
    });
    const email =
      session.customer_details?.email ?? session.customer_email ?? undefined;
    const pi =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent &&
            typeof session.payment_intent === "object" &&
            "id" in session.payment_intent
          ? (session.payment_intent as { id: string }).id
          : undefined;
    const shipPayload = {
      customer: session.customer_details ?? null,
      shipping: (session as unknown as { shipping_details?: unknown })
        .shipping_details ?? null,
    };
    await ctx.runMutation(internal.orders.markPaidFromStripe, {
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: pi,
      email,
      amountTotalCents: session.amount_total ?? undefined,
      currency: session.currency?.toUpperCase(),
      shippingSnapshot: JSON.stringify(shipPayload),
    });
  },
});
