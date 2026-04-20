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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [
    staticEntry("", { priority: 1, changeFrequency: "weekly" }),
    staticEntry("/shop", { priority: 0.9, changeFrequency: "weekly" }),
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
      entries.push({
        url: `${base}/product/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }

    const posts = await fetchQuery(api.journal.listPublished, { limit: 50 });
    for (const post of posts) {
      entries.push({
        url: `${base}/journal/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  } catch {
    // Convex unreachable or misconfigured at runtime: static URLs only.
  }

  return entries;
}
