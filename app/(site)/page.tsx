import type { Metadata } from "next";
import HomePageClient from "./home-page-client";
import { getProducts, getSettings } from "@/lib/storefront-data";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <HomePageClient initialProducts={products} initialSettings={settings} />;
}
