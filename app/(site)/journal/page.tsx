"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { journalIntro } from "@/lib/expert-skin-care-copy";

export default function JournalIndexPage() {
  const posts = useQuery(api.journal.listPublished, { limit: 20 });

  if (!posts) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        Loading journal…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
        {journalIntro.eyebrow}
      </p>
      <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl">
        {journalIntro.title}
      </h1>
      <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
        {journalIntro.lead}
      </p>
      <ul className="mt-14 space-y-12">
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/journal/${post.slug}`} className="group grid gap-6 sm:grid-cols-2">
              <div className="relative aspect-video overflow-hidden border border-border/40">
                <Image
                  src={post.heroPublicPath ?? "/products/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div>
                <h2 className="font-heading text-2xl text-foreground group-hover:text-gold">
                  {post.title}
                </h2>
                <p className="mt-2 text-base text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm uppercase tracking-[0.2em] text-gold">
                  Read
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
