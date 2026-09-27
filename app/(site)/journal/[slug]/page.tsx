import { journalImagePath } from "@/lib/journal-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/storefront-data";
import { absoluteImageUrl, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { JournalPostClient } from "./journal-post-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const post = await getPost(slug);
  if (!post?.published) notFound();

  const imageUrl = absoluteImageUrl(journalImagePath(post.heroPublicPath)) ?? `${siteUrl}/og-image.jpg`;
  const title = post.title;
  const description = post.excerpt ?? `${post.title} — skincare tips and insights from Helen's Beauty Secret.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/journal/${slug}` },
    openGraph: {
      type: "article",
      url: `${siteUrl}/journal/${slug}`,
      title,
      description,
      siteName: "Helen's Beauty Secret",
      images: [{ url: imageUrl!, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const post = await getPost(slug);
  if (!post?.published) notFound();

  const articleJsonLd =
    post && post.published
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt ?? post.title,
          image: absoluteImageUrl(journalImagePath(post.heroPublicPath)),
          url: `${siteUrl}/journal/${slug}`,
          datePublished: new Date(post.publishedAt ?? post._creationTime).toISOString(),
          dateModified: new Date(post.updatedAt).toISOString(),
          publisher: {
            "@type": "Organization",
            name: "Helen's Beauty Secret",
            logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
          },
        }
      : null;

  return (
    <>
      {articleJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
        />
      ) : null}
      <JournalPostClient slug={slug} initialPost={post} />
    </>
  );
}
