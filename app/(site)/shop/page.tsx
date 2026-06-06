import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { ShopPageClient } from "./shop-page-client";

const siteUrl = getSiteUrl();
const shopUrl = `${siteUrl}/shop`;

export const metadata: Metadata = {
  title: "Shop Organic Skincare Products | Helen's Beauty Secret",
  description:
    "Browse certified organic skincare products at Helen's Beauty Secret. Shop natural face creams, serums, moisturizers, and beauty products made with organic botanicals.",
  alternates: { canonical: shopUrl },
  keywords: [
    "buy organic skincare",
    "organic skincare products",
    "natural beauty products online",
    "certified organic face cream",
    "organic moisturizer",
    "organic serum",
    "clean beauty products",
    "non-toxic skincare",
    "organic skin care routine",
    "Helen's Beauty Secret shop",
  ],
  openGraph: {
    type: "website",
    url: shopUrl,
    title: "Shop Organic Skincare | Helen's Beauty Secret",
    description:
      "Certified organic face creams, serums, and moisturizers. Professional-grade natural beauty products with full ingredient transparency.",
    siteName: "Helen's Beauty Secret",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Helen's Beauty Secret — Organic Skincare Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Organic Skincare | Helen's Beauty Secret",
    description:
      "Certified organic face creams, serums, and moisturizers. Professional-grade natural beauty.",
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
