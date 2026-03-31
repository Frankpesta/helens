/**
 * Static marketing copy for the home page (hero, standards block, testimonials, newsletter).
 * Featured SKUs come from Convex `siteSettings.featuredProductIds` + `products.getByIds`.
 */

export const homeHero = {
  eyebrow: "Certified organic · Professional skincare",
  titleLine1: "Radiance you can",
  titleLine2Gold: "measure in the mirror",
  description:
    "Formulas engineered for what you can see and feel: brighter, more even tone; smoother texture; calmer redness; stronger moisture retention; and daily protection that holds up under real life. We start with certified-organic botanicals because they perform—and we finish with rigor so you get consistent results jar after jar, not novelty.",
  ctaShop: "Shop the collection",
  ctaStory: "Our standards",
} as const;

export const homeValues = {
  title: "organic integrity",
  subtitle:
    "We formulate like a professional skin care house: verify inputs, challenge stability, publish honest guidance, and batch at a scale where every jar stays traceable.",
  items: [
    {
      step: "01",
      title: "Verified botanicals",
      description:
        "Certified organic and responsibly sourced plant inputs—with documentation from field to fill, because “natural” alone is not a specification.",
    },
    {
      step: "02",
      title: "Formulation discipline",
      description:
        "pH-aware bases, preservation that respects microbiology, and realistic usage notes. Organic is the beginning of the brief, not the end.",
    },
    {
      step: "03",
      title: "Transparent labeling",
      description:
        "Complete INCI lists, no fairy-tale claims on the carton, and a care team trained to explain what each choice is doing for your skin.",
    },
  ],
} as const;

export const homeTestimonials = [
  {
    quote:
      "Finally an organic line that reads like serious skin care—clear INCI, thoughtful bases, and educators who know their preservatives.",
    author: "Amira K.",
    title: "Physician associate, dermatology",
  },
  {
    quote:
      "My clients notice when a brand respects the barrier. This one does—and the mineral SPF layers cleanly for photo days.",
    author: "Lauren M.",
    title: "Licensed esthetician",
  },
  {
    quote:
      "We stock for texture, scent restraint, and honest organic sourcing. Helen's checks all three without sounding like a lifestyle brochure.",
    author: "Jordan R.",
    title: "Independent beauty buyer",
  },
] as const;

export const homeNewsletter = {
  heading: "Skincare tips in your inbox",
  placeholder: "Your email",
  supporting:
    "Short, practical notes on building a routine that works—layering, SPF habits, barrier repair, seasonal switches, and product timing—so your skin keeps improving between orders.",
} as const;
