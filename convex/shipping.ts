import { query } from "./_generated/server";

/** International delivery tiers — fee added in Stripe as a separate line item. */
export const DELIVERY_OPTIONS = [
  {
    id: "standard_worldwide",
    label: "Standard worldwide",
    description: "Tracked air — typically 10–18 business days",
    cents: 1299,
  },
  {
    id: "express_worldwide",
    label: "Express worldwide",
    description: "Priority courier — typically 3–7 business days",
    cents: 4499,
  },
  {
    id: "economy_intl",
    label: "Economy international",
    description: "Best value — may take longer on remote routes",
    cents: 0,
  },
] as const;

export type DeliveryOptionId = (typeof DELIVERY_OPTIONS)[number]["id"];

export function shippingFeeForOption(id: string): number | null {
  const row = DELIVERY_OPTIONS.find((o) => o.id === id);
  return row ? row.cents : null;
}

export function deliveryLabelForOption(id: string): string | null {
  const row = DELIVERY_OPTIONS.find((o) => o.id === id);
  return row ? row.label : null;
}

export const listDeliveryOptions = query({
  args: {},
  handler: async () =>
    DELIVERY_OPTIONS.map((o) => ({
      id: o.id,
      label: o.label,
      description: o.description,
      cents: o.cents,
    })),
});
