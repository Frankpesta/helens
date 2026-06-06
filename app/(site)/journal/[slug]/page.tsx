import type { Metadata } from "next";
import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getSiteUrl } from "@/lib/site-url";
import { JournalPostClient } from "./journal-post-client";

type Props = { params: Promise<{ slug: string }> };

const getPost = cache(async (slug: string) => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return null;
  try {
    return await Promise.race([
      fetchQuery(api.journal.getBySlug, { slug }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const post = await getPost(slug);

  if (!post || !post.published) {
    return { title: "Journal | Helen's Beauty Secret" };
  }

  const imageUrl = post.heroPublicPath
    ? `${siteUrl}${post.heroPublicPath}`
    : `${siteUrl}/og-image.jpg`;
  const title = `${post.title} | Helen's Beauty Secret`;
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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const post = await getPost(slug);

  const articleJsonLd =
    post && post.published
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt ?? post.title,
          image: post.heroPublicPath ? `${siteUrl}${post.heroPublicPath}` : undefined,
          url: `${siteUrl}/journal/${slug}`,
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
          // eslint-disable-next-line react/no-danger -- structured data for crawlers
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      ) : null}
      <JournalPostClient slug={slug} />
    </>
  );
}
