/** Static expert-positioning copy for organic / professional skin care (site-wide). */

import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  FlaskConical,
  Leaf,
  Microscope,
  Sun,
} from "lucide-react";

export const credentialsItems: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Leaf,
    title: "Organic-forward sourcing",
    description:
      "Certified-organic botanicals where claims apply—traceable lots and supplier documentation on file.",
  },
  {
    icon: FlaskConical,
    title: "Stability-aware formulating",
    description:
      "Preservation and packaging choices tested for real-world use—not just beautiful INCI lists.",
  },
  {
    icon: Microscope,
    title: "Batch discipline",
    description:
      "Controlled small runs with monitoring suited to natural actives and variable harvest years.",
  },
  {
    icon: BadgeCheck,
    title: "Label clarity",
    description:
      "Full ingredient disclosure and honest usage guidance you can reconcile with professional standards.",
  },
];

export const formulationPillars: {
  title: string;
  body: string;
}[] = [
  {
    title: "Barrier first",
    body: "We prioritize stratum corneum integrity and comfortable daily wear before chasing aggressive claims.",
  },
  {
    title: "Evidence-weighted actives",
    body: "Botanicals and functional ingredients are chosen for established safety profiles and sensible use levels.",
  },
  {
    title: "Sensory without compromise",
    body: "Texture and finish are tuned for compliance and wear time—especially under SPF or makeup.",
  },
  {
    title: "Professional context",
    body: "Language and routines are written for both home users and consult-led care plans.",
  },
];

export const routineSteps: {
  phase: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    phase: "01",
    label: "Cleanse",
    detail: "Remove SPF, makeup, and daily film without stripping lipids.",
    icon: Sun,
  },
  {
    phase: "02",
    label: "Treat",
    detail: "Target concerns with serums or oils—one primary active focus per step.",
    icon: FlaskConical,
  },
  {
    phase: "03",
    label: "Moisturize",
    detail: "Seal water and support barrier recovery with compatible emollients.",
    icon: Leaf,
  },
  {
    phase: "04",
    label: "Protect",
    detail: "Daytime SPF as the final step; reapply per label and exposure.",
    icon: BadgeCheck,
  },
];

export const skinCareFaq: { q: string; a: string }[] = [
  {
    q: "Are your products appropriate for sensitive skin?",
    a: "We formulate for broad tolerability, but “sensitive” is individual. Patch test new products for 24–48 hours and introduce one formula at a time. Discontinue if irritation persists and consult a clinician for persistent redness or discomfort.",
  },
  {
    q: "What does “organic” mean on this site?",
    a: "We emphasize certified-organic botanical inputs where marketing and regulatory language allow. Full INCI lists on each product page are the authoritative breakdown—organic claims on packaging follow certification rules for that SKU.",
  },
  {
    q: "How should I layer with prescription topicals?",
    a: "Prescriptions take precedence. Use them per your prescriber’s order and spacing rules. Our routines are written for cosmetic use only—never as medical advice.",
  },
  {
    q: "Why might color or scent vary between batches?",
    a: "Natural extracts and cold-pressed oils shift with harvest, climate, and oxidation state. Micro batching can produce subtle batch variance—stability testing confirms acceptable ranges.",
  },
];

export const shopGuidance = {
  eyebrow: "Browse with intent",
  title: "Build a regimen, not a cluttered shelf",
  lead:
    "Start with your non-negotiables: cleanse, hydrate, daytime protection. Add treatment steps gradually so you can observe how your skin responds.",
  bullets: [
    "Match texture to climate and skin type—gels and lighter fluids for humid or oily-prone days; richer creams when barrier repair is the goal.",
    "Introduce one new active product per week when possible so you can attribute results or irritation.",
    "If you are pregnant, nursing, or under dermatologic care, confirm ingredient suitability with your clinician.",
  ],
};

export const aboutExpertSections = {
  sourcing: {
    eyebrow: "Sourcing",
    title: "Suppliers we can document",
    body:
      "We work with partners who provide consistent documentation for identity, purity, and—where applicable—organic certification. That paperwork is part of how we defend quality to professionals and discerning clients alike.",
  },
  lab: {
    eyebrow: "Formulation",
    title: "Small-batch, specification-driven",
    body:
      "Each formula has a target sensory profile, pH range, and preservative strategy appropriate to its format. We don’t ship novelty for novelty’s sake—every SKU needs a clear role in a coherent routine.",
  },
  education: {
    eyebrow: "Education",
    title: "Confidence in the consult room",
    body:
      "Our editorial and product copy favor precise language over hype. If you need batch numbers, COAs, or deeper technical notes for professional use, route requests through customer care with your order context.",
  },
};

export const journalIntro = {
  eyebrow: "From the lab",
  title: "Formulation notes without the fluff",
  lead:
    "Short essays on organic inputs, stability trade-offs, and how we think about barrier health—written for curious clients and practitioners.",
};

export const productExpertDisclaimer = {
  title: "Professional notes",
  body:
    "For cosmetic use only. Not intended to diagnose, treat, cure, or prevent disease. Patch test before full-face use. Store away from heat and direct sun; follow period-after-opening guidance on packaging.",
};

export const shippingExpertNote = {
  title: "Cold-climate shipping",
  body:
    "Extreme temperatures can affect emulsions and wax-heavy formulas. If your parcel sat outdoors in freezing or excessive heat, allow it to reach room temperature before opening.",
};
