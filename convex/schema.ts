import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  products: defineTable({
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    priceCents: v.number(),
    currency: v.string(),
    stripePriceId: v.optional(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
    trackInventory: v.boolean(),
    inventoryCount: v.optional(v.number()),
    ratingAverage: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    features: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      }),
    ),
    ritualSteps: v.array(
      v.object({
        step: v.string(),
        title: v.string(),
        description: v.string(),
      }),
    ),
    testimonialQuote: v.optional(v.string()),
    testimonialAuthor: v.optional(v.string()),
    testimonialTitle: v.optional(v.string()),
    heroImagePath: v.optional(v.string()),
    /** INCI-style list for PDP */
    ingredients: v.optional(v.array(v.string())),
    /** Rich guidance; markdown-style **bold** ok */
    howToUse: v.optional(v.string()),
    /** Optional before/after carousel */
    beforeAfterSlides: v.optional(
      v.array(
        v.object({
          alt: v.string(),
          publicPath: v.optional(v.string()),
          storageId: v.optional(v.id("_storage")),
          kind: v.optional(
            v.union(v.literal("before"), v.literal("after")),
          ),
        }),
      ),
    ),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_isActive_and_sortOrder", ["isActive", "sortOrder"]),

  productImages: defineTable({
    productId: v.id("products"),
    storageId: v.optional(v.id("_storage")),
    alt: v.string(),
    sortOrder: v.number(),
    /** Fallback when no Convex file yet */
    publicPath: v.optional(v.string()),
  })
    .index("by_product_and_sort", ["productId", "sortOrder"])
    .index("by_product", ["productId"]),

  journalPosts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    heroStorageId: v.optional(v.id("_storage")),
    heroPublicPath: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_and_publishedAt", ["published", "publishedAt"]),

  customerProfiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    postalCode: v.string(),
    country: v.string(),
    /** Last selected delivery tier */
    preferredDeliveryOption: v.string(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
  }),

  /** Marketing email list sign-ups from the storefront (e.g. home page). */
  newsletterSubscribers: defineTable({
    email: v.string(),
    createdAt: v.number(),
    source: v.optional(v.string()),
  }).index("by_email", ["email"]),

  siteSettings: defineTable({
    key: v.literal("main"),
    brandName: v.string(),
    heroEyebrow: v.string(),
    heroTitleLine1: v.string(),
    heroTitleLine2Gold: v.string(),
    heroDescription: v.string(),
    heroCtaShop: v.string(),
    heroCtaStory: v.string(),
    featuredProductIds: v.array(v.id("products")),
    valuesTitle: v.string(),
    valuesSubtitle: v.string(),
    valuesItems: v.array(
      v.object({
        step: v.string(),
        title: v.string(),
        description: v.string(),
      }),
    ),
    testimonials: v.array(
      v.object({
        quote: v.string(),
        author: v.string(),
        title: v.string(),
      }),
    ),
    newsletterHeading: v.string(),
    newsletterPlaceholder: v.string(),
    footerTagline: v.string(),
    stripePublishableKeyHint: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    facebookUrl: v.optional(v.string()),
    pinterestUrl: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  orders: defineTable({
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    email: v.optional(v.string()),
    customerUserId: v.optional(v.id("users")),
    deliveryOption: v.optional(v.string()),
    shippingFeeCents: v.optional(v.number()),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("fulfilled"),
      v.literal("canceled"),
    ),
    /** Set when order confirmation email was sent (idempotent). */
    orderConfirmationSentAt: v.optional(v.number()),
    amountTotalCents: v.optional(v.number()),
    currency: v.optional(v.string()),
    lineItems: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        quantity: v.number(),
        unitAmountCents: v.number(),
        productId: v.optional(v.id("products")),
      }),
    ),
    shippingSnapshot: v.optional(v.string()),
    rawMetadata: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_stripeCheckoutSessionId", ["stripeCheckoutSessionId"])
    .index("by_status", ["status"])
    .index("by_customerUserId", ["customerUserId"]),
});
