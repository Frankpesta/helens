import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Skincare Ingredients & Products",
  description: "Explore the ingredients listed in Helen's Beauty Secret skincare products. Find matching formulas and read each product's full ingredient list and directions.",
  alternates: { canonical: "/ingredients" },
};

export default async function IngredientsPage() {
  const products = await getProducts();
  const ingredients = new Map<string, { name: string; products: typeof products }>();
  for (const product of products) {
    for (const raw of product.ingredients ?? []) {
      const name = raw.trim();
      if (!name) continue;
      const key = name.toLocaleLowerCase("en");
      const entry = ingredients.get(key) ?? { name, products: [] };
      if (!entry.products.some((p) => p._id === product._id)) entry.products.push(product);
      ingredients.set(key, entry);
    }
  }
  return <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
    <Link href="/shop" className="text-sm text-gold underline">Shop all skincare</Link>
    <h1 className="mt-6 font-heading text-4xl text-on-surface">Skincare ingredients</h1>
    <p className="mt-5 max-w-2xl text-on-surface-variant">Browse the ingredients listed in our formulas and find the products that contain them. Each product page includes its ingredient list and directions. Check the product label for the latest formulation.</p>
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      {[...ingredients.values()].sort((a,b) => a.name.localeCompare(b.name)).map((entry) =>
        <section key={entry.name} className="border border-outline-variant/25 bg-surface-container p-6">
          <h2 className="font-heading text-xl text-gold">{entry.name}</h2>
          <ul className="mt-4 space-y-3">{entry.products.map((p) => <li key={p._id}>
            <Link className="underline underline-offset-4 hover:text-gold" href={"/product/" + p.slug}>{p.name}</Link>
            <p className="mt-1 text-sm text-on-surface-variant">{p.tagline}</p>
          </li>)}</ul>
        </section>)}
    </div>
    {ingredients.size === 0 ? <p className="mt-8">Ingredient information is being updated. Please contact our care team with formulation questions.</p> : null}
  </div>;
}
