import type { Metadata } from "next";
import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getSiteUrl } from "@/lib/site-url";
import { ProductPageClient } from "./product-page-client";

type Props = { params: Promise<{ slug: string }> };

const getProduct = cache(async (slug: string) => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return null;
  try {
    return await Promise.race([
      fetchQuery(api.products.getBySlug, { slug }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/product/${slug}`;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product | Helen's Beauty Secret" };
  }

  const rawDesc = product.description.replace(/\*\*/g, "");
  const description = `${rawDesc.slice(0, 140)}… Shop certified organic skincare at Helen's Beauty Secret.`;
  const imageUrl = product.heroImagePath
    ? `${siteUrl}${product.heroImagePath}`
    : `${siteUrl}/og-image.jpg`;
  const title = `${product.name} | Certified Organic Skincare`;

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    keywords: [
      product.name,
      "organic skincare",
      "natural beauty",
      "certified organic",
      product.tagline ?? "",
      "Helen's Beauty Secret",
      "organic face cream",
      "clean beauty",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      url: productUrl,
      title,
      description,
      siteName: "Helen's Beauty Secret",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1500,
          alt: `${product.name} — certified organic skincare by Helen's Beauty Secret`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const product = await getProduct(slug);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description.replace(/\*\*/g, ""),
        url: `${siteUrl}/product/${slug}`,
        image: product.heroImagePath
          ? [
              {
                "@type": "ImageObject",
                url: `${siteUrl}${product.heroImagePath}`,
                name: `${product.name} — organic skincare by Helen's Beauty Secret`,
              },
            ]
          : undefined,
        brand: { "@type": "Brand", name: "Helen's Beauty Secret" },
        category: "Skincare",
        offers: {
          "@type": "Offer",
          priceCurrency: product.currency,
          price: (product.priceCents / 100).toFixed(2),
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/product/${slug}`,
          seller: { "@type": "Organization", name: "Helen's Beauty Secret" },
        },
        ...(product.ratingAverage && product.ratingCount
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.ratingAverage.toFixed(1),
                reviewCount: product.ratingCount,
                bestRating: "5",
                worstRating: "1",
              },
            }
          : {}),
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
      {
        "@type": "ListItem",
        position: 3,
        name: product?.name ?? "Product",
        item: `${siteUrl}/product/${slug}`,
      },
    ],
  };

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- structured data for crawlers
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- structured data for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient slug={slug} />
    </>
  );
}
