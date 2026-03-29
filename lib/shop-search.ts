import type { Doc } from "@/convex/_generated/dataModel";

/** Case-insensitive match on name, tagline, slug, and description fields. */
export function productMatchesSearchQuery(
  p: Doc<"products">,
  raw: string,
): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    p.name,
    p.tagline,
    p.slug,
    p.description.replace(/\*\*/g, ""),
    p.longDescription ?? "",
    ...(p.ingredients ?? []),
  ]
    .join(" \n ")
    .toLowerCase();
  return haystack.includes(q);
}
