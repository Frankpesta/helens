import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal-copy";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
  const routes = [
    "",
    "/shop",
    "/about",
    "/journal",
    "/cart",
    "/checkout/success",
    "/checkout/cancel",
    ...Object.keys(legalPages).map((s) => `/legal/${s}`),
  ];
  const now = new Date();
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));
}
