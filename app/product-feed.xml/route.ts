import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getProducts } from "@/lib/storefront-data";
import { absoluteImageUrl, plainDescription } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function xml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

/** Public catalog only. Shipping, returns, and target countries belong in Merchant Center. */
export async function GET() {
  const base = getSiteUrl();
  const products = await getProducts();
  const items = await Promise.all(products.map(async (product) => {
    const gallery = await fetchQuery(api.products.getGallery, { productId: product._id });
    const images = [...new Set([...gallery.map((g) => g.url), product.heroImagePath]
      .map(absoluteImageUrl).filter((url): url is string => Boolean(url)))];
    // A placeholder cannot be submitted as a product photo.
    if (!images.length) return "";
    const url = `${base}/product/${encodeURIComponent(product.slug)}`;
    return `<item>
      <g:id>${xml(product._id)}</g:id>
      <g:title>${xml(product.name.slice(0, 150))}</g:title>
      <g:description>${xml(plainDescription(product.description).slice(0, 5000))}</g:description>
      <g:link>${xml(url)}</g:link>
      <g:canonical_link>${xml(url)}</g:canonical_link>
      <g:image_link>${xml(images[0])}</g:image_link>
      ${images.slice(1, 11).map((image) => `<g:additional_image_link>${xml(image)}</g:additional_image_link>`).join("\n")}
      <g:availability>${product.trackInventory && (product.inventoryCount ?? 0) <= 0 ? "out_of_stock" : "in_stock"}</g:availability>
      <g:price>${(product.priceCents / 100).toFixed(2)} ${xml(product.currency)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>Helen&apos;s Beauty Secret</g:brand>
      <g:product_type>Skin Care</g:product_type>
    </item>`;
  }));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
      <title>Helen&apos;s Beauty Secret</title><link>${xml(base)}</link>
      <description>Helen&apos;s Beauty Secret skincare products</description>
      ${items.join("\n")}
    </channel></rss>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
