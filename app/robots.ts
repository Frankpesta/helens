import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/product/", "/about", "/journal/", "/contact"],
        disallow: [
          "/admin/",
          "/api/",
          "/account",
          "/sign-in",
          "/cart",
          "/checkout",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/products/", "/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
