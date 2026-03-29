export const legalPages: Record<
  string,
  { title: string; body: string[] }
> = {
  privacy: {
    title: "Privacy",
    body: [
      "We collect only the information needed to process and ship orders—contact details, delivery address, and payment data handled securely by Stripe.",
      "Operational data for our storefront and internal systems is stored with our infrastructure provider. We do not sell or rent personal information.",
      "To request access, correction, or deletion of your data, contact the customer care address shown on your order confirmation.",
    ],
  },
  terms: {
    title: "Terms",
    body: [
      "By purchasing from Helen's Beauty Secret you agree to our shipping timelines, which vary by region and carrier load.",
      "Product imagery is representative; slight variance between batches is normal for organic formulations.",
      "We reserve the right to refuse service on orders that appear fraudulent.",
    ],
  },
  shipping: {
    title: "Shipping",
    body: [
      "Most orders ship within two business days of payment confirmation. You will receive tracking information when the carrier accepts the parcel.",
      "International customers are responsible for import duties, taxes, and customs fees assessed by their country.",
      "Delivery options and environmental offset programs, where offered, are disclosed at checkout.",
    ],
  },
  returns: {
    title: "Returns",
    body: [
      "Unopened items in original packaging may be returned within 14 days of delivery for store credit, subject to restocking policies published at purchase.",
      "Opened skin care cannot be resold. If you experience irritation, contact customer care with your order number for product-specific guidance.",
      "Approved refunds are issued to the original payment method after the warehouse inspects and accepts the return.",
    ],
  },
};
