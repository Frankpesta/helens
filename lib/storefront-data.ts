import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// Backend failures must not become empty, indexable pages or false 404s.
export const getProducts = cache(() => fetchQuery(api.products.listActive, {}));
export const getSettings = cache(() => fetchQuery(api.siteSettings.getMain, {}));
export const getPosts = cache(() => fetchQuery(api.journal.listPublished, { limit: 50 }));
export const getPost = cache((slug: string) => fetchQuery(api.journal.getBySlug, { slug }));
export const getProduct = cache(async (slug: string) => {
  const product = await fetchQuery(api.products.getBySlug, { slug });
  if (!product?.isActive) return null;
  const gallery = await fetchQuery(api.products.getGallery, { productId: product._id });
  return { product, gallery };
});
