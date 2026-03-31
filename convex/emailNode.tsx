"use node";

import { ContactAdminNotificationEmail } from "./emailTemplates/ContactAdminNotificationEmail";
import { OrderConfirmationEmail } from "./emailTemplates/OrderConfirmationEmail";
import { OrderStatusEmail } from "./emailTemplates/OrderStatusEmail";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { render } from "@react-email/render";
import { Resend } from "resend";
import * as React from "react";

const orderStatusValidator = v.union(
  v.literal("pending_payment"),
  v.literal("paid"),
  v.literal("processing"),
  v.literal("shipped"),
  v.literal("fulfilled"),
  v.literal("canceled"),
);

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(cents / 100);
}

function siteUrl() {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function fromAddress() {
  return process.env.RESEND_FROM ?? `Helen's <onboarding@resend.dev>`;
}

function statusEmailCopy(
  status:
    | "pending_payment"
    | "paid"
    | "processing"
    | "shipped"
    | "fulfilled"
    | "canceled",
): { headline: string; body: string } {
  switch (status) {
    case "paid":
      return {
        headline: "Payment received",
        body: "Thank you — we've received your payment and will prepare your shipment with the same care we bring to formulation.",
      };
    case "processing":
      return {
        headline: "We're preparing your order",
        body: "Your items are being packed in our studio. You'll receive tracking details when your parcel ships.",
      };
    case "shipped":
      return {
        headline: "Your order has shipped",
        body: "Your parcel is on its way. Allow tracking links (if applicable) to update over the next day. Thank you for supporting small-batch organic skin care.",
      };
    case "fulfilled":
      return {
        headline: "Delivered — thank you",
        body: "We hope you love the results. For ingredient questions or regimen guidance, reply to this email anytime.",
      };
    case "canceled":
      return {
        headline: "Your order was canceled",
        body: "This order is marked canceled in our system. If that surprises you, reply to this message and we'll sort it out.",
      };
    default:
      return {
        headline: "Order update",
        body: "There is an update on your order. Sign in to your account for full details.",
      };
  }
}

export const sendOrderConfirmation = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set; skipping order confirmation email");
      return;
    }
    const order = await ctx.runQuery(internal.orders.internalGetOrder, {
      orderId: args.orderId,
    });
    if (!order?.email || order.orderConfirmationSentAt) return;

    const settings = await ctx.runQuery(internal.siteSettings.getMainForEmail, {});
    const brandName = settings.brandName;
    const base = siteUrl();
    const lineSummary = order.lineItems.map((li) => ({
      name: li.name,
      quantity: li.quantity,
      lineTotal: formatMoney(
        li.unitAmountCents * li.quantity,
        order.currency ?? "USD",
      ),
    }));
    const totalLabel =
      order.amountTotalCents != null ?
        formatMoney(order.amountTotalCents, order.currency ?? "USD")
      : "—";

    const html = await render(
      <OrderConfirmationEmail
        brandName={brandName}
        siteUrl={base}
        sessionRef={`${order.stripeCheckoutSessionId.slice(0, 24)}…`}
        lineSummary={lineSummary}
        totalLabel={totalLabel}
      />,
    );

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: order.email,
      subject: `Order confirmed · ${brandName}`,
      html,
    });
    if (error) {
      console.error("Resend order confirmation error", error);
      throw new Error(error.message);
    }
    await ctx.runMutation(internal.orders.markOrderConfirmationEmailSent, {
      orderId: args.orderId,
    });
  },
});

export const sendOrderStatusEmail = internalAction({
  args: {
    orderId: v.id("orders"),
    previousStatus: orderStatusValidator,
    newStatus: orderStatusValidator,
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set; skipping order status email");
      return;
    }
    const order = await ctx.runQuery(internal.orders.internalGetOrder, {
      orderId: args.orderId,
    });
    if (!order?.email) return;

    const settings = await ctx.runQuery(internal.siteSettings.getMainForEmail, {});
    const { headline, body } = statusEmailCopy(args.newStatus);
    const html = await render(
      <OrderStatusEmail
        brandName={settings.brandName}
        siteUrl={siteUrl()}
        headline={headline}
        body={body}
        sessionRef={`${order.stripeCheckoutSessionId.slice(0, 24)}…`}
      />,
    );

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: order.email,
      subject: `${headline} · ${settings.brandName}`,
      html,
    });
    if (error) {
      console.error("Resend status email error", error);
      throw new Error(error.message);
    }
  },
});

export const notifyNewContactMessage = internalAction({
  args: { contactMessageId: v.id("contactMessages") },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.ADMIN_NOTIFY_EMAIL;
    if (!apiKey || !notifyTo) return;

    const row = await ctx.runQuery(internal.contact.internalGet, {
      id: args.contactMessageId,
    });
    if (!row) return;

    const settings = await ctx.runQuery(internal.siteSettings.getMainForEmail, {});
    const base = siteUrl();
    const html = await render(
      <ContactAdminNotificationEmail
        brandName={settings.brandName}
        adminPanelUrl={`${base}/admin/contact`}
        fromName={row.name}
        fromEmail={row.email}
        message={row.message}
      />,
    );
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: notifyTo,
      subject: `Contact · ${row.name} · ${settings.brandName}`,
      html,
    });
    if (error) console.error("Resend contact notify error", error);
  },
});
