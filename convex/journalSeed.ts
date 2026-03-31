import { mutation } from "./_generated/server";
import { requireAdmin } from "./lib/authz";

/** Canonical long-form articles for the journal. Idempotent: skips existing slugs. */
function defaultJournalArticles(now: number) {
  return [
    {
      slug: "what-certified-organic-means-for-your-skin",
      title: "What certified organic means—for your skin",
      excerpt:
        "The seal is a sourcing contract with the farm—not a promise that a formula is automatically milder, purer, or “chemical-free.” Here is how to think about it in 2026.",
      body: `## More than a marketing halo

When a botanical is **certified organic**, a credible program has audited how it was grown and handled: restricted synthetic pesticides on the crop, no GMO seed, traceability through handling, and documentation an independent body can verify. That matters because the *plant extract in your jar still reflects what happened in the field*—residue profiles, complexity of the extract, and sometimes oxidative stability start upstream.

Organic certification does **not** mean the finished product contains only organic ingredients. Many responsible formulas blend certified-organic botanicals with **well-studied functional ingredients** (humectants, emulsifiers, mineral filters, niacinamide, etc.) that are not “grown” at all—and that is not a betrayal of the standard; it is honest chemistry.

## What we optimize for at Helen’s Beauty Secret

1. **Transparency** — A complete INCI you can read like a professional.  
2. **Barrier realism** — pH, lipids, and preservation that respect microbiology.  
3. **Usage honesty** — SPF with photoaging, retinoid timing with clinicians, occlusion with heavier oils.

### A practical takeaway

If you care about organic inputs, ask two questions of any line: *Which ingredients are actually certified organic?* and *What is doing the work for performance and preservation?* Brands that welcome that scrutiny tend to earn professional trust.`,
      published: true,
      publishedAt: now,
      heroPublicPath: "/products/serum-1.svg",
      updatedAt: now,
    },
    {
      slug: "how-to-read-an-inci-list-like-a-formulator",
      title: "How to read an INCI list (without falling for ‘clean’ panic)",
      excerpt:
        "Order, concentration, and context: a calm framework for scanning labels on organic and conventional products alike.",
      body: `## Order is not a recipe card

INCI lists are ranked by **descending concentration** down to 1%—below that, ingredients may appear in **any order**. That single rule already explains why a beautiful botanical marketed on the front might land near the end: it can still matter sensorially or as part of an extract blend, but it is rarely the structural spine of the formula.

## Separating signal from slogans

- **INCI ≠ hazard.** Every ingredient sounds industrial when you Latinize it; *dose, leave-on vs rinse-off, and formula pH* decide tolerability.  
- **“Fragrance-free” vs “unscented.”** Unscented products can still use masking agents; “fragrance-free” is the clearer claim for reactive skin—verify on the label.  
- **Alcohols aren’t one thing.** *Fatty alcohols* (texture/emulsion) behave nothing like drying alcohols in a harsh astringent.

## What professionals look for first

1. **Preservation** — A robust system in a leave-on jar is non-negotiable; “preservative-free” often hides unconventional carriers.  
2. **pH for actives** — Ascorbic acid, azelaic acid, and exfoliating acids have pH windows where they behave predictably.  
3. **Occlusives vs humectants** — Occlusion seals water in; humectants bind it. Photosensitive regimens still finish with **broad-spectrum SPF** in the morning.

### Your homework on the next product you buy

Photograph the INCI, note whether the product is **rinse-off or leave-on**, and compare it to how the brand explains **order of use** on the site. When those two stories disagree, ask why.`,
      published: true,
      publishedAt: now,
      heroPublicPath: "/products/cleanser-1.svg",
      updatedAt: now,
    },
    {
      slug: "skin-barrier-101-lipids-ph-and-your-cleanser",
      title: "Skin barrier 101: lipids, pH, and why your cleanser matters",
      excerpt:
        "Most ‘sensitivity’ is an engineering problem—barrier lipids, acid mantle, and friction. Organic oils won’t save a brutal cleanse.",
      body: `## The barrier is laminar, not metaphorical

The stratum corneum behaves like **bricks (corneocytes) and mortar (lipids)**—ceramides, cholesterol, and fatty acids in a ratio evolution tuned for your climate and age. Disrupt that mortar with **hot water + aggressive surfactants + ruthless scrubbing**, and almost any “natural” oil layered on top is playing catch-up.

## pH and the acid mantle

Healthy surface skin leans **weakly acidic**. High-pH bars and some legacy cleansers can transiently alkalize skin, altering enzyme behavior and microbial balance. That does not mean pH is the only statistic that matters—**mildness also comes from surfactant choice and rinse mechanics**—but it is why formulation houses obsess over measurement.

## Organic positioning does not relax the rules

Certified-organic oils can be gorgeous; they still need **sensible preservation** once water and touch enter the picture. Likewise, an organic essential-oil story is not a license to ignore **phototoxicity** or **sensitization**.

### A calmer routine skeleton

1. **Gentle cleanse** — Enough to remove SPF and grime without squeak.  
2. **Hydrate** — Humectants on slightly damp skin.  
3. **Treat** — One primary concern per season unless a clinician coordinates more.  
4. **Seal / SPF** — Occclusion at night; **broad-spectrum SPF** by day.

If your barrier feels tight after every wash, fix step one before you buy another serum.`,
      published: true,
      publishedAt: now,
      heroPublicPath: "/products/cream-1.svg",
      updatedAt: now,
    },
    {
      slug: "layering-serums-actives-morning-night",
      title: "Layering organic serums with actives: order, timing, sunscreen",
      excerpt:
        "Morning is for defense; night is for repair. A disciplined sequence beats a shelf of single-note organics.",
      body: `## Thin to thick is a starting rule, not scripture

**Water-based actives** (many vitamin Cs, niacinamide serums, humectant toners) usually precede **emulsions and creams**, which precede **occlusive balms or facial oils**—unless the brand specifies otherwise for stability. What matters more than Instagram diagrams is **compatibility**: some silicones or film formers alter spread of what follows; some acids need a specific pH window.

## Morning vs evening responsibilities

- **AM:** Antioxidant support (where tolerated), **moisture appropriate to your type**, and **SPF that you will actually apply in sufficient quantity**.  
- **PM:** Barrier repair, controlled exfoliation if appropriate, or prescription timing as directed.

Organic marketing sometimes implies you can “stack botanicals endlessly.” In practice, **barrier recovery** likes fewer, proven steps.

## Photosensitizing notes that are not fear-mongering

Some plant constituents—think certain citrus extracts or essential oils at meaningful levels—interact badly with UV. That is not an argument against botanicals; it is an argument for **photoprotection and honest concentration choices**.

### One upgrade you can make today

Pick a single **leave-on treatment** to be “the main character” for eight weeks, keep everything else supportive, and photograph lighting consistently. Skin turnover deserves a longer narrative than a weekend.`,
      published: true,
      publishedAt: now,
      heroPublicPath: "/products/oil-1.svg",
      updatedAt: now,
    },
    {
      slug: "mineral-spf-and-organic-skincare-what-matters",
      title: "Mineral SPF meets organic skin care: what actually matters",
      excerpt:
        "Zinc doesn’t care if your moisturizer is organic—but film uniformity, reapplication, and pairing with antioxidants do.",
      body: `## Mineral filters are particles, not ideologies

**Zinc oxide** (and often titanium dioxide in blends) works as micronized or larger particles that scatter and absorb UV. The **finish, cast, and elegance** come from dispersion chemistry—how evenly those particles sit in the emulsion—not from whether your last step was organic.

## Pairing with “clean” or organic moisturizers

What breaks SPF is rarely your cream’s certification story; it is **under-application, skipped reapplication**, or aggressive rubbing that disrupts the film. If you love a rich organic oil at night, wonderful—ensure the morning film is **generously applied** and compatible with makeup if you wear it.

## Antioxidants are companions, not substitutes

Botanical antioxidants can be wonderful *supplements* to SPF for visible aging concerns related to free radicals—but they are **not interchangeable** with a regulated UV filter layer.

### The professional plea we repeat in the studio

**Two finger-lengths** for face and neck as a visual yardstick, **reapply on long outdoor days**, and schedule around sweat and clothing friction. The best organic line in the world cannot undo cumulative neglect on that front.`,
      published: true,
      publishedAt: now,
      heroPublicPath: "/products/spf-1.svg",
      updatedAt: now,
    },
  ];
}

/** Run once from Convex dashboard or a temp admin button; inserts any missing default articles by slug. */
export const seedDefaultArticles = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    let inserted = 0;
    const slugs: string[] = [];
    for (const post of defaultJournalArticles(now)) {
      const exists = await ctx.db
        .query("journalPosts")
        .withIndex("by_slug", (q) => q.eq("slug", post.slug))
        .unique();
      if (!exists) {
        await ctx.db.insert("journalPosts", { ...post });
        inserted += 1;
        slugs.push(post.slug);
      }
    }
    return { inserted, slugs };
  },
});
