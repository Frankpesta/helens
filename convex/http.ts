import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }
    const rawBody = await request.text();
    let eventPayload: unknown;
    try {
      const json = await ctx.runAction(internal.stripeNode.verifyWebhook, {
        rawBody,
        signature,
      });
      eventPayload = JSON.parse(json);
    } catch {
      return new Response("Webhook verification failed", { status: 400 });
    }
    const event = eventPayload as {
      type?: string;
      data?: { object?: { id?: string } };
    };
    if (event.type === "checkout.session.completed") {
      const sessionId = event.data?.object?.id;
      if (sessionId) {
        await ctx.runAction(internal.stripeNode.fulfillCheckout, {
          sessionId,
        });
      }
    }
    return new Response(null, { status: 200 });
  }),
});

export default http;
