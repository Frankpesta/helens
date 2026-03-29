import Link from "next/link";
import { notFound } from "next/navigation";
import { legalPages } from "@/lib/legal-copy";

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalPages[slug];
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/" className="text-xs uppercase tracking-[0.2em] text-gold">
        ← Home
      </Link>
      <h1 className="mt-6 font-heading text-3xl text-foreground">{doc.title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {doc.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
