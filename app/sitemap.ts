import { journalImagePath } from "@/lib/journal-image";
import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { legalPages } from "@/lib/legal-copy";
import { getSiteUrl } from "@/lib/site-url";
import { absoluteImageUrl } from "@/lib/seo";
import { getProducts, getPosts } from "@/lib/storefront-data";

// Refresh from the catalog on every request; never cache a partial sitemap on failure.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  const productEntries = await Promise.all(products.map(async (product) => {
    const gallery = await fetchQuery(api.products.getGallery, { productId: product._id });
    const images = [...new Set([...gallery.map((g) => g.url), product.heroImagePath]
      .map(absoluteImageUrl).filter((url): url is string => Boolean(url)))];
    return {
      url: base + "/product/" + encodeURIComponent(product.slug),
      lastModified: new Date(product.updatedAt), images,
    };
  }));
  return [
    ...["", "/shop", "/ingredients", "/about", "/journal", "/contact",
      ...Object.keys(legalPages).map((slug) => "/legal/" + slug)]
      .map((path) => ({ url: base + path })),
    ...productEntries,
    ...posts.map((post) => ({
      url: base + "/journal/" + encodeURIComponent(post.slug),
      lastModified: new Date(post.updatedAt),
      images: [absoluteImageUrl(journalImagePath(post.heroPublicPath))].filter((url): url is string => Boolean(url)),
    })),
  ];
}
