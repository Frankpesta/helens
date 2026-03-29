import { query, mutation, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdmin } from "./lib/authz";

const beforeAfterSlideArg = v.object({
  alt: v.string(),
  publicPath: v.optional(v.string()),
  storageId: v.optional(v.id("_storage")),
  kind: v.optional(v.union(v.literal("before"), v.literal("after"))),
});

function buildDefaultMainSiteSettings(
  now: number,
  featuredProductIds: Id<"products">[],
) {
  return {
    key: "main" as const,
    brandName: "Helen's Beauty Secret",
    heroEyebrow: "Certified organic · Professional skincare",
    heroTitleLine1: "Skin health,",
    heroTitleLine2Gold: "rooted in organics",
    heroDescription:
      "Evidence-minded formulas with certified organic botanicals, responsible preservation, and full INCI transparency. Developed to support barrier health and visible results—without noise or empty promises.",
    heroCtaShop: "Shop the collection",
    heroCtaStory: "Our standards",
    featuredProductIds,
    valuesTitle: "organic integrity",
    valuesSubtitle:
      "We formulate like a professional skin care house: verify inputs, test stability, publish honest guidance, and batch at a scale where every jar stays traceable.",
    valuesItems: [
      {
        step: "01",
        title: "Verified botanicals",
        description:
          "Certified organic and responsibly sourced plant materials, with documentation from field to fill.",
      },
      {
        step: "02",
        title: "Formulation discipline",
        description:
          "pH-aware bases, lab stability review, and microbiology controls before anything ships.",
      },
      {
        step: "03",
        title: "Transparent labeling",
        description:
          "Complete ingredient lists, realistic usage notes, and a care team trained on formulation FAQs.",
      },
    ],
    testimonials: [
      {
        quote:
          "Reads like a serious organic line—clear INCI, thoughtful bases, no fairy tales on the carton.",
        author: "Amira K.",
        title: "Physician associate, dermatology",
      },
      {
        quote:
          "My clients notice when a brand respects the barrier. This one does.",
        author: "Lauren M.",
        title: "Licensed esthetician",
      },
    ],
    newsletterHeading: "Formulation notes & launches",
    newsletterPlaceholder: "Professional email",
    footerTagline:
      "Certified organic skin care · Responsibly formulated · Mindful small-batch production",
    updatedAt: now,
  };
}

function buildDefaultJournalPost(now: number) {
  return {
    slug: "what-certified-organic-means-for-your-skin",
    title: "What certified organic means—for your skin",
    excerpt:
      "Why we anchor our botanical core in certified organic agriculture, and how that supports cleaner formulas.",
    body: "## More than a seal\n\n**Certified organic** agricultural ingredients are grown under standards that restrict synthetic pesticides and GMOs we choose not to formulate around. It is one part of how we keep the plant fraction of our work accountable.\n\n### How we formulate\n\nHelen's Beauty Secret pairs those botanicals with **well-studied actives**, **responsible preservation**, and **realistic usage guidance**. If an ingredient does not earn its place in performance or skin comfort, it leaves the brief.\n\n### Questions?\n\nOur care team is trained on every INCI list—email any time you want the nuance behind a choice.",
    published: true,
    publishedAt: now,
    heroPublicPath: "/products/serum-1.svg",
    updatedAt: now,
  };
}

async function featuredProductIdsForSettings(
  ctx: MutationCtx,
): Promise<Id<"products">[]> {
  let rows = await ctx.db
    .query("products")
    .withIndex("by_isActive_and_sortOrder", (q) => q.eq("isActive", true))
    .order("asc")
    .take(2);
  if (rows.length === 0) {
    rows = await ctx.db.query("products").order("asc").take(2);
  }
  if (rows.length === 0) {
    throw new Error("No products in database; run a full catalog seed first.");
  }
  const a = rows[0]!._id;
  const b = rows[1]?._id ?? a;
  return [a, b];
}

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_isActive_and_sortOrder", (q) => q.eq("isActive", true))
      .order("asc")
      .take(50);
  },
});

export const listAllForAdminIncludingInactive = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("products").order("asc").take(200);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const out: Doc<"products">[] = [];
    for (const id of args.ids) {
      const p = await ctx.db.get(id);
      if (p) out.push(p);
    }
    return out;
  },
});

export const getForCheckout = query({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const out: Doc<"products">[] = [];
    const seen = new Set<string>();
    for (const id of args.ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      const p = await ctx.db.get(id);
      if (p?.isActive) out.push(p);
    }
    return out;
  },
});

/** One entry per cart line (same `productId` may appear more than once). Primary = first gallery image, else hero. */
export const getCheckoutLinePreviews = query({
  args: { productIds: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const previews: { imageUrl: string; imageAlt: string }[] = [];
    for (const productId of args.productIds) {
      const p = await ctx.db.get(productId);
      if (!p) {
        previews.push({
          imageUrl: "/products/placeholder.svg",
          imageAlt: "Product",
        });
        continue;
      }
      const images = await ctx.db
        .query("productImages")
        .withIndex("by_product_and_sort", (q) => q.eq("productId", productId))
        .order("asc")
        .take(1);
      const img = images[0];
      let imageUrl = p.heroImagePath ?? "/products/placeholder.svg";
      const imageAlt = img?.alt ?? p.name;
      if (img?.publicPath) imageUrl = img.publicPath;
      if (img?.storageId) {
        const signed = await ctx.storage.getUrl(img.storageId);
        if (signed) imageUrl = signed;
      }
      previews.push({ imageUrl, imageAlt });
    }
    return previews;
  },
});

export const imagesByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("productImages")
      .withIndex("by_product_and_sort", (q) => q.eq("productId", args.productId))
      .order("asc")
      .take(20);
  },
});

export const getGallery = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("productImages")
      .withIndex("by_product_and_sort", (q) => q.eq("productId", args.productId))
      .order("asc")
      .take(20);
    const out: { alt: string; url: string }[] = [];
    for (const img of images) {
      let url = img.publicPath ?? "/products/placeholder.svg";
      if (img.storageId) {
        const signed = await ctx.storage.getUrl(img.storageId);
        if (signed) url = signed;
      }
      out.push({ alt: img.alt, url });
    }
    return out;
  },
});

export const getBeforeAfterGallery = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const p = await ctx.db.get(args.productId);
    const slides = p?.beforeAfterSlides;
    if (!slides?.length) return [];
    const out: { alt: string; url: string; kind?: "before" | "after" }[] = [];
    for (const s of slides) {
      let url = s.publicPath ?? "/products/placeholder.svg";
      if (s.storageId) {
        const signed = await ctx.storage.getUrl(s.storageId);
        if (signed) url = signed;
      }
      out.push({ alt: s.alt, url, kind: s.kind });
    }
    return out;
  },
});

export const create = mutation({
  args: {
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
      v.object({ title: v.string(), description: v.string() }),
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
    ingredients: v.optional(v.array(v.string())),
    howToUse: v.optional(v.string()),
    beforeAfterSlides: v.optional(v.array(beforeAfterSlideArg)),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    return await ctx.db.insert("products", {
      ...args,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    priceCents: v.optional(v.number()),
    currency: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    trackInventory: v.optional(v.boolean()),
    inventoryCount: v.optional(v.number()),
    ratingAverage: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    features: v.optional(
      v.array(v.object({ title: v.string(), description: v.string() })),
    ),
    ritualSteps: v.optional(
      v.array(
        v.object({
          step: v.string(),
          title: v.string(),
          description: v.string(),
        }),
      ),
    ),
    testimonialQuote: v.optional(v.string()),
    testimonialAuthor: v.optional(v.string()),
    testimonialTitle: v.optional(v.string()),
    heroImagePath: v.optional(v.string()),
    ingredients: v.optional(v.array(v.string())),
    howToUse: v.optional(v.string()),
    beforeAfterSlides: v.optional(v.array(beforeAfterSlideArg)),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...patch } = args;
    const cleaned = Object.fromEntries(
      Object.entries(patch).filter(([, val]) => val !== undefined),
    ) as Record<string, unknown>;
    await ctx.db.patch(id, { ...cleaned, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const product = await ctx.db.get(args.id);
    if (!product) return;

    for (const slide of product.beforeAfterSlides ?? []) {
      if (slide.storageId) {
        try {
          await ctx.storage.delete(slide.storageId);
        } catch {
          /* ignore */
        }
      }
    }

    const images = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.id))
      .collect();
    for (const img of images) {
      if (img.storageId) {
        try {
          await ctx.storage.delete(img.storageId);
        } catch {
          /* ignore */
        }
      }
      await ctx.db.delete(img._id);
    }

    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();
    if (
      settings &&
      settings.featuredProductIds.some((fid) => fid === args.id)
    ) {
      await ctx.db.patch(settings._id, {
        featuredProductIds: settings.featuredProductIds.filter(
          (fid) => fid !== args.id,
        ),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(args.id);
  },
});

export const addProductImage = mutation({
  args: {
    productId: v.id("products"),
    alt: v.string(),
    sortOrder: v.number(),
    storageId: v.optional(v.id("_storage")),
    publicPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("productImages", args);
  },
});

export const removeProductImage = mutation({
  args: { imageId: v.id("productImages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const img = await ctx.db.get(args.imageId);
    if (img?.storageId) {
      try {
        await ctx.storage.delete(img.storageId);
      } catch {
        /* ignore */
      }
    }
    await ctx.db.delete(args.imageId);
  },
});

export const reorderProductImages = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("productImages"),
        sortOrder: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    for (const u of args.updates) {
      await ctx.db.patch(u.id, { sortOrder: u.sortOrder });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const mainSettings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .unique();
    const anyProduct = await ctx.db.query("products").take(1);

    if (anyProduct.length === 0) {
    const defs = [
      {
        slug: "aura-glow-serum",
        name: "Organic Radiance Serum",
        tagline: "Brightening daily serum",
        description:
          "A lightweight **organic-based** serum with niacinamide, hydrating humectants, and botanical extracts to support even tone and a healthy glow.",
        longDescription:
          "Designed for morning and evening use. Absorbs quickly and layers cleanly under moisturizer and sunscreen.",
        priceCents: 12500,
        sortOrder: 1,
        heroImagePath: "/products/serum-1.svg",
        features: [
          {
            title: "Barrier-friendly base",
            description:
              "Hydrating humectants and panthenol support comfortable daily wear.",
          },
          {
            title: "Tone & texture",
            description:
              "Niacinamide at tested use levels for visible brightening support.",
          },
          {
            title: "Professional finish",
            description:
              "Silky spreadability suited to client regimens and makeup prep.",
          },
        ],
        ritualSteps: [
          {
            step: "01",
            title: "Cleanse",
            description: "Use a gentle, low-pH cleanser suited to your skin type.",
          },
          {
            step: "02",
            title: "Apply",
            description: "Press 2–3 drops over face, neck, and décolleté.",
          },
          {
            step: "03",
            title: "Moisturize",
            description: "Seal with cream; always finish AM routines with SPF.",
          },
        ],
        testimonialQuote:
          "Reads serious on the label—and my patients tolerate it well.",
        testimonialAuthor: "Elena M.",
        testimonialTitle: "Editor, clinical skin care journal",
        ratingAverage: 4.9,
        ratingCount: 128,
        ingredients: [
          "Aloe Barbadensis Leaf Juice",
          "Niacinamide",
          "Propanediol",
          "Sodium Hyaluronate",
          "Panthenol",
          "Tocopherol",
        ],
        howToUse:
          "**AM and PM:** after cleansing and toning, apply **2–3 drops** to dry skin, then moisturizer. **Always use broad-spectrum SPF during the day.**",
        beforeAfterSlides: [
          {
            alt: "Baseline uneven tone",
            publicPath: "/products/serum-1.svg",
            kind: "before" as const,
          },
          {
            alt: "After 8 weeks — clinical photography",
            publicPath: "/products/cream-1.svg",
            kind: "after" as const,
          },
        ],
      },
      {
        slug: "midnight-renewal-oil",
        name: "Overnight Barrier Facial Oil",
        tagline: "Restorative night oil",
        description:
          "A squalane-rich night oil with ceramide support and organic blue tansy extract to comfort stressed skin by morning.",
        longDescription:
          "Use as the last step in your evening regimen. Warm between palms, then press—do not tug.",
        priceCents: 9800,
        sortOrder: 2,
        heroImagePath: "/products/oil-1.svg",
        features: [
          {
            title: "Lipid replenishment",
            description:
              "Plant-derived emollients that complement a healthy moisture barrier.",
          },
          {
            title: "Calming botanicals",
            description:
              "Blue tansy and chamomile extracts for the look of redness.",
          },
          {
            title: "Nighttime use",
            description:
              "Formulated to pair with gentle hydrators; rotate with strong retinoids as directed.",
          },
        ],
        ritualSteps: [
          {
            step: "01",
            title: "Hydrate",
            description: "Mist or apply essence so skin is slightly damp.",
          },
          {
            step: "02",
            title: "Press",
            description: "Smooth 4–6 drops upward along jaw, cheeks, and neck.",
          },
          {
            step: "03",
            title: "Allow",
            description:
              "Let absorb; avoid stacking strong exfoliants the same night.",
          },
        ],
        testimonialQuote:
          "I recommend this finish to clients who need barrier repair without heaviness.",
        testimonialAuthor: "Jordan K.",
        testimonialTitle: "Licensed aesthetician",
        ratingAverage: 4.8,
        ratingCount: 96,
        ingredients: [
          "Squalane",
          "Caprylic/Capric Triglyceride",
          "Tanacetum Annuum (Blue Tansy) Flower Oil",
          "Ceramide NP",
          "Tocopherol",
        ],
        howToUse:
          "**Evening only:** warm **4–6 drops** in palms; press into skin. If using prescription topicals, ask your clinician about timing.",
        beforeAfterSlides: [
          {
            alt: "Before — barrier stress",
            publicPath: "/products/oil-1.svg",
            kind: "before" as const,
          },
          {
            alt: "After — smoother AM texture",
            publicPath: "/products/serum-1.svg",
            kind: "after" as const,
          },
        ],
      },
      {
        slug: "wild-rose-cleanse",
        name: "Wild Rose Cream Cleanser",
        tagline: "pH-balanced daily cleanse",
        description:
          "A sulfate-free cream-gel cleanser with organic rose hip and oat-derived amino acids. Removes SPF and impurities without stripping.",
        longDescription:
          "Rinse with lukewarm water. Suitable for most skin types; patch test if rosacea-prone.",
        priceCents: 4200,
        sortOrder: 3,
        heroImagePath: "/products/cleanser-1.svg",
        features: [
          {
            title: "Respects pH",
            description:
              "Formulated to leave skin comfortable—not tight—after rinsing.",
          },
          {
            title: "Low foam",
            description:
              "Cream-gel texture cushions friction during massage.",
          },
          {
            title: "Professional baseline",
            description:
              "Appropriate for twice-daily use under a full organic regimen.",
          },
        ],
        ritualSteps: [
          {
            step: "01",
            title: "Wet",
            description: "Splash lukewarm water across the face and neck.",
          },
          {
            step: "02",
            title: "Massage",
            description: "Work a coin-sized amount over skin for 30–45 seconds.",
          },
          {
            step: "03",
            title: "Rinse",
            description: "Rinse thoroughly; pat dry and continue with treatment steps.",
          },
        ],
        testimonialQuote:
          "Cleans without that squeaky feeling—exactly what I want in a pro kit.",
        testimonialAuthor: "Priya S.",
        testimonialTitle: "Makeup & skin photographer",
        ratingAverage: 4.7,
        ratingCount: 154,
        ingredients: [
          "Aqua",
          "Sodium Cocoyl Apple Amino Acids",
          "Rosa Canina Fruit Extract",
          "Glycerin",
          "Avena Sativa (Oat) Kernel Oil",
        ],
        howToUse:
          "**AM/PM:** massage a **coin-sized** amount onto damp skin for **45 seconds**, rinse with lukewarm water, pat dry.",
        beforeAfterSlides: [
          {
            alt: "Before — congested T-zone",
            publicPath: "/products/cleanser-1.svg",
            kind: "before" as const,
          },
          {
            alt: "After — calmer clarity",
            publicPath: "/products/mask-1.svg",
            kind: "after" as const,
          },
        ],
      },
      {
        slug: "celestial-moisture-veil",
        name: "Barrier Support Moisture Cream",
        tagline: "Oil–water balance",
        description:
          "A peptide-supported cream-gel moisturizer with **tremella** extract and humectants to hydrate combination skin without a heavy film.",
        longDescription:
          "Apply after serums. Press into skin; avoid rubbing to reduce pilling with SPF or makeup.",
        priceCents: 7600,
        sortOrder: 4,
        heroImagePath: "/products/cream-1.svg",
        features: [
          {
            title: "Water-binding botanicals",
            description:
              "Tremella mushroom polysaccharides hold hydration in the surface layers.",
          },
          {
            title: "Peptide care",
            description:
              "Signal peptides to support firmness and texture with consistent use.",
          },
          {
            title: "Layering-friendly",
            description:
              "Tested under mineral SPF and light–medium coverage foundation.",
          },
        ],
        ritualSteps: [
          {
            step: "01",
            title: "Dispense",
            description: "Use roughly a pearl-sized amount.",
          },
          {
            step: "02",
            title: "Press",
            description: "Press into cheeks, forehead, and neck until absorbed.",
          },
          {
            step: "03",
            title: "Protect",
            description: "AM: broad-spectrum SPF. PM: optional facial oil on top.",
          },
        ],
        testimonialQuote:
          "Hydration my combination clients can stick with—no slip, no grease.",
        testimonialAuthor: "Noah L.",
        testimonialTitle: "Salon owner",
        ratingAverage: 4.8,
        ratingCount: 88,
        ingredients: [
          "Aqua",
          "Tremella Fuciformis (Mushroom) Extract",
          "Peptides (Palmitoyl Tripeptide-1)",
          "Squalane",
          "Panthenol",
        ],
        howToUse:
          "Apply a **pearl-sized** amount after serums; **press** into skin. **AM:** finish with SPF. **PM:** seal with facial oil if desired.",
        beforeAfterSlides: [
          {
            alt: "Before — dehydrated combination skin",
            publicPath: "/products/cream-1.svg",
            kind: "before" as const,
          },
          {
            alt: "After — even moisture",
            publicPath: "/products/spf-1.svg",
            kind: "after" as const,
          },
        ],
      },
      {
        slug: "sunlit-mineral-shield",
        name: "Mineral Daily Defense SPF 35",
        tagline: "Broad-spectrum mineral",
        description:
          "A **zinc-based** daily SPF with niacinamide and ceramides in a sheer, skin-tone-adapting tint.",
        longDescription:
          "Shake before each use. Reapply at least every two hours in direct sun or after swimming/sweating per FDA guidance.",
        priceCents: 5400,
        sortOrder: 5,
        heroImagePath: "/products/spf-1.svg",
        features: [
          {
            title: "Mineral protection",
            description:
              "Non-nano zinc oxide primary filter for UVB/UVA coverage.",
          },
          {
            title: "Cosmetic elegance",
            description:
              "Iron oxide tint helps offset traditional mineral white cast on many skin tones.",
          },
          {
            title: "Skincare inside",
            description:
              "Barrier-support actives so SPF doubles as a daytime treatment step.",
          },
        ],
        ritualSteps: [
          {
            step: "01",
            title: "Shake",
            description: "Emulsify suspended mineral pigments fully.",
          },
          {
            step: "02",
            title: "Apply",
            description: "Use two finger-lengths for face; add more for neck.",
          },
          {
            step: "03",
            title: "Blend",
            description:
              "Feather edges into hairline; set with powder if desired.",
          },
        ],
        testimonialQuote:
          "A mineral SPF my on-camera clients will actually wear.",
        testimonialAuthor: "Amara V.",
        testimonialTitle: "Professional makeup artist",
        ratingAverage: 4.9,
        ratingCount: 210,
        ingredients: [
          "Zinc Oxide",
          "Niacinamide",
          "Ceramide NP",
          "Aloe Barbadensis Leaf Juice",
          "Iron Oxides (CI 77491)",
        ],
        howToUse:
          "**Shake well.** Apply **generously** as the last skincare step; reapply every **2 hours** in direct sun.",
        beforeAfterSlides: [
          {
            alt: "Before — photo day, no SPF habit",
            publicPath: "/products/spf-1.svg",
            kind: "before" as const,
          },
          {
            alt: "After — even, protected base",
            publicPath: "/products/cream-1.svg",
            kind: "after" as const,
          },
        ],
      },
      {
        slug: "garden-eclipse-mask",
        name: "Clarifying Clay Treatment Mask",
        tagline: "Weekly deep cleanse",
        description:
          "A cream–clay treatment with **salicylic-friendly** willow bark, spirulina, and linoleic-rich oils for clarified pores without chalky dryness.",
        longDescription:
          "Limit to 1–2× weekly on active breakout or oily areas; shorten time if tingling persists.",
        priceCents: 6100,
        sortOrder: 6,
        heroImagePath: "/products/mask-1.svg",
        features: [
          {
            title: "Controlled clarifying",
            description:
              "Kaolin lifts surface oil; willow bark supports clearer-looking pores.",
          },
          {
            title: "Balanced comfort",
            description:
              "Vitamin F and tocopherol offset the tight feel of traditional clay.",
          },
          {
            title: "Professional cadence",
            description:
              "Designed as an add-on treatment—not a daily cleanser replacement.",
          },
        ],
        ritualSteps: [
          {
            step: "01",
            title: "Apply",
            description: "Spread an even layer with clean brush or fingers.",
          },
          {
            step: "02",
            title: "Time",
            description: "Leave on 8–12 minutes in a humid environment.",
          },
          {
            step: "03",
            title: "Recover",
            description:
              "Remove with a soft cloth; follow with hydrating serum and cream.",
          },
        ],
        testimonialQuote:
          "Clay that does not leave my treatment-room clients angry-red.",
        testimonialAuthor: "Chris D.",
        testimonialTitle: "Lead spa therapist",
        ratingAverage: 4.7,
        ratingCount: 73,
        ingredients: [
          "Kaolin",
          "Spirulina Platensis Extract",
          "Salix Alba (Willow) Bark Extract",
          "Linoleic Acid",
          "Tocopherol",
        ],
        howToUse:
          "Apply an **even layer** with brush or fingers; leave **8–12 minutes**. Rinse with a **warm cloth**, then mist and moisturize.",
        beforeAfterSlides: [
          {
            alt: "Before — weekly buildup",
            publicPath: "/products/mask-1.svg",
            kind: "before" as const,
          },
          {
            alt: "After — refined pores",
            publicPath: "/products/cleanser-1.svg",
            kind: "after" as const,
          },
        ],
      },
    ];

    const insertedIds: Id<"products">[] = [];
    for (const d of defs) {
      const id = await ctx.db.insert("products", {
        slug: d.slug,
        name: d.name,
        tagline: d.tagline,
        description: d.description,
        longDescription: d.longDescription,
        priceCents: d.priceCents,
        currency: "USD",
        isActive: true,
        sortOrder: d.sortOrder,
        trackInventory: true,
        inventoryCount: 40,
        ratingAverage: d.ratingAverage,
        ratingCount: d.ratingCount,
        features: d.features,
        ritualSteps: d.ritualSteps,
        testimonialQuote: d.testimonialQuote,
        testimonialAuthor: d.testimonialAuthor,
        testimonialTitle: d.testimonialTitle,
        heroImagePath: d.heroImagePath,
        ingredients: d.ingredients,
        howToUse: d.howToUse,
        beforeAfterSlides: d.beforeAfterSlides,
        updatedAt: now,
      });
      insertedIds.push(id);
      await ctx.db.insert("productImages", {
        productId: id,
        alt: d.name,
        sortOrder: 0,
        publicPath: d.heroImagePath,
      });
    }

    await ctx.db.insert(
      "siteSettings",
      buildDefaultMainSiteSettings(now, [insertedIds[0], insertedIds[1]]),
    );
    await ctx.db.insert("journalPosts", buildDefaultJournalPost(now));

    return { seeded: true as const, count: insertedIds.length };
    }

    let repaired = false;
    if (!mainSettings) {
      const featured = await featuredProductIdsForSettings(ctx);
      await ctx.db.insert(
        "siteSettings",
        buildDefaultMainSiteSettings(now, featured),
      );
      repaired = true;
    }

    const anyJournal = await ctx.db.query("journalPosts").take(1);
    if (anyJournal.length === 0) {
      await ctx.db.insert("journalPosts", buildDefaultJournalPost(now));
      repaired = true;
    }

    if (!repaired) return { seeded: false as const };
    return { seeded: true as const, count: 0 };
  },
});
