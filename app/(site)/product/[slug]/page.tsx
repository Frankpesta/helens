import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/storefront-data";
import { absoluteImageUrl, plainDescription, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { ProductPageClient } from "./product-page-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/product/${slug}`;
  const data = await getProduct(slug);
  if (!data) notFound();
  const { product, gallery } = data;

  const description = product.seoDescription?.trim() || plainDescription(product.description).slice(0, 160);
  const imageUrl = absoluteImageUrl(gallery[0]?.url ?? product.heroImagePath);
  const title = product.seoTitle?.trim() || product.name;

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
          url: imageUrl ?? `${siteUrl}/og-image.jpg`,
          alt: `${product.name} — certified organic skincare by Helen's Beauty Secret`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const data = await getProduct(slug);
  if (!data) notFound();
  const { product, gallery } = data;

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description.replace(/\*\*/g, ""),
        url: `${siteUrl}/product/${slug}`,
        image: [...new Set([...gallery.map((g) => g.url), product.heroImagePath].map(absoluteImageUrl).filter((url): url is string => Boolean(url)))],
        brand: { "@type": "Brand", name: "Helen's Beauty Secret" },
        category: "Skincare",
        offers: {
          "@type": "Offer",
          priceCurrency: product.currency,
          price: (product.priceCents / 100).toFixed(2),
          availability: product.trackInventory && (product.inventoryCount ?? 0) <= 0
            ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ProductPageClient slug={slug} initialProduct={product} initialGallery={gallery} />
    </>
  );
}
