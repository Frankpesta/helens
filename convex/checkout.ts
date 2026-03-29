"use node";

import Stripe from "stripe";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

type CheckoutAuthContext = {
  userId: Id<"users">;
  profile: Doc<"customerProfiles">;
  shippingFeeCents: number;
  deliveryLabel: string;
  email?: string;
};

export const createCheckoutSession = action({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      }),
    ),
    deliveryOption: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) throw new Error("Cart is empty");
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error("Stripe is not configured");

    const checkoutCtx: CheckoutAuthContext = await ctx.runQuery(
      api.customerCheckout.assertCheckoutAllowed,
      {
        deliveryOption: args.deliveryOption,
      },
    );

    const ids = args.items.map((i) => i.productId);
    const products: Doc<"products">[] = await ctx.runQuery(
      api.products.getForCheckout,
      { ids },
    );
    const byId = new Map(products.map((p) => [p._id, p]));

    const lineItemsForConvex: {
      slug: string;
      name: string;
      quantity: number;
      unitAmountCents: number;
      productId: (typeof ids)[number];
    }[] = [];

    const stripeItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of args.items) {
      if (item.quantity < 1) continue;
      const product = byId.get(item.productId);
      if (!product) throw new Error("Invalid product in cart");
      lineItemsForConvex.push({
        slug: product.slug,
        name: product.name,
        quantity: item.quantity,
        unitAmountCents: product.priceCents,
        productId: product._id,
      });
      if (product.stripePriceId) {
        stripeItems.push({
          price: product.stripePriceId,
          quantity: item.quantity,
        });
      } else {
        stripeItems.push({
          quantity: item.quantity,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              metadata: {
                slug: product.slug,
                productId: product._id,
              },
            },
          },
        });
      }
    }

    if (stripeItems.length === 0) throw new Error("No valid line items");

    const firstPid = lineItemsForConvex[0]?.productId;
    const firstProduct = firstPid ? byId.get(firstPid) : undefined;
    const shipCurrency = firstProduct?.currency.toLowerCase() ?? "usd";
    stripeItems.push({
      quantity: 1,
      price_data: {
        currency: shipCurrency,
        unit_amount: checkoutCtx.shippingFeeCents,
        product_data: {
          name: `Shipping — ${checkoutCtx.deliveryLabel}`,
          metadata: {
            type: "shipping",
            deliveryOption: args.deliveryOption,
          },
        },
      },
    });

    const stripe = new Stripe(stripeKey);
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: args.successUrl,
      cancel_url: args.cancelUrl,
      line_items: stripeItems,
      billing_address_collection: "required",
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      phone_number_collection: { enabled: true },
      metadata: {
        convexCustomerUserId: checkoutCtx.userId,
        deliveryOption: args.deliveryOption,
      },
    });

    if (!session.url) throw new Error("Stripe did not return a URL");

    await ctx.runMutation(internal.orders.createPendingCheckoutRecord, {
      stripeCheckoutSessionId: session.id,
      lineItems: lineItemsForConvex,
      customerUserId: checkoutCtx.userId,
      deliveryOption: args.deliveryOption,
      shippingFeeCents: checkoutCtx.shippingFeeCents,
      email: checkoutCtx.email,
    });

    return { url: session.url };
  },
});
