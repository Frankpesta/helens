"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = useQuery(api.journal.getBySlug, { slug });

  if (post === undefined) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">Loading…</div>
    );
  }

  if (!post || !post.published) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-heading text-gold">Post not found</p>
        <Link href="/journal" className="mt-4 inline-block text-gold underline">
          Journal home
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/journal" className="text-xs uppercase tracking-[0.2em] text-gold">
        ← Journal
      </Link>
      <h1 className="mt-6 font-heading text-4xl text-foreground">{post.title}</h1>
      <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
      <div className="relative mt-10 aspect-video overflow-hidden border border-border/40">
        <Image
          src={post.heroPublicPath ?? "/products/placeholder.svg"}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="prose prose-invert prose-headings:font-heading mt-10 max-w-none prose-p:text-muted-foreground prose-strong:text-gold">
        {post.body.split("\n\n").map((para, i) => (
          <p key={i}>{para.replace(/^##\s+/, "").replace(/\*\*([^*]+)\*\*/g, "$1")}</p>
        ))}
      </div>
    </article>
  );
}
