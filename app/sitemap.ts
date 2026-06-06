import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { legalPages } from "@/lib/legal-copy";
import { getSiteUrl } from "@/lib/site-url";

function staticEntry(
  path: string,
  opts: { priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] },
): MetadataRoute.Sitemap[0] {
  const base = getSiteUrl();
  return {
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
}

// Static product images in /public — always indexable, never expire
const STATIC_PRODUCT_IMAGES = [
  { path: "/products/face-cream.png", title: "Helen's Face Cream — Certified Organic Skincare" },
  { path: "/products/brightening.png", title: "Helen's Brightening Serum — Organic Beauty" },
  { path: "/products/collagen-booster.png", title: "Helen's Collagen Booster Cream — Natural Skincare" },
  { path: "/products/age-reversal.png", title: "Helen's Age Reverse Serum — Organic Anti-Aging" },
  { path: "/products/cleanser.png", title: "Helen's Cleanser — Certified Organic Skin Care" },
  { path: "/products/anti-blemish.png", title: "Helen's Anti-Blemish Treatment — Clean Beauty" },
  { path: "/products/mask.png", title: "Helen's Clarifying Mask — Natural Skincare" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticImageUrls = STATIC_PRODUCT_IMAGES.map((img) => `${base}${img.path}`);

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: staticImageUrls,
    },
    {
      url: `${base}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: staticImageUrls,
    },
    staticEntry("/about", { priority: 0.85, changeFrequency: "monthly" }),
    staticEntry("/journal", { priority: 0.85, changeFrequency: "weekly" }),
    staticEntry("/contact", { priority: 0.85, changeFrequency: "monthly" }),
    ...Object.keys(legalPages).map((slug) =>
      staticEntry(`/legal/${slug}`, {
        priority: 0.35,
        changeFrequency: "yearly",
      }),
    ),
  ];

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return entries;
  }

  try {
    const products = await fetchQuery(api.products.listActive, {});
    for (const p of products) {
      const images: MetadataRoute.Sitemap[0]["images"] = [];
      // Only include heroImagePath if it's a stable public path (not a signed Convex storage URL)
      if (p.heroImagePath && !p.heroImagePath.includes("convex.cloud")) {
        images.push(`${base}${p.heroImagePath}`);
      }
      entries.push({
        url: `${base}/product/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly",
        priority: 0.9,
        images,
      });
    }

    const posts = await fetchQuery(api.journal.listPublished, { limit: 50 });
    for (const post of posts) {
      const images: MetadataRoute.Sitemap[0]["images"] = [];
      if (post.heroPublicPath) {
        images.push(`${base}${post.heroPublicPath}`);
      }
      entries.push({
        url: `${base}/journal/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.65,
        images,
      });
    }
  } catch {
    // Convex unreachable at build time — static URLs only.
  }

  return entries;
}
