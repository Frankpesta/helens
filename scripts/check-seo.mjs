import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://localhost:3000";
const canonical = "https://helensbeautysecret.com";
async function page(path) {
  const response = await fetch(new URL(path, base), {
    headers: { "user-agent": "Googlebot" },
  });
  assert.equal(response.status, 200, path);
  return response.text();
}
const visible = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
const sitemap = await page("/sitemap.xml");
assert.ok(sitemap.includes(`${canonical}/ingredients`));
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
const products = urls.filter((url) => url.pathname.startsWith("/product/"));
assert.ok(products.length > 0, "Product sitemap cannot be empty");
for (const url of products) {
  const html = await page(url.pathname);
  const markup = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const product = markup.find((entry) => entry["@type"] === "Product");
  assert.ok(product?.image?.length, `${url.pathname}: product image`);
  assert.ok(product.image.every((image) => /^https:\/\//.test(image)), "Absolute image URLs");
  assert.match(visible(html), /<h1\b/, "Product title rendered without JavaScript");
  assert.match(visible(html), /Ingredients/, "Ingredient section rendered without JavaScript");
  assert.ok(html.includes(`rel="canonical" href="${url.href}"`), "Self canonical");
  assert.ok(markup.every((entry) => entry["@type"] !== "FAQPage"), "No unrelated FAQ schema");
  assert.ok(product.offers.priceCurrency && Number(product.offers.price) >= 0);
}
for (const path of ["/", "/shop", "/ingredients", "/journal"]) {
  const html = visible(await page(path));
  assert.match(html, /<h1\b/, `${path}: server-rendered heading`);
  assert.ok(html.includes('href="/product/') || html.includes('href="/journal/'), `${path}: crawlable links`);
}
for (const url of urls.filter((url) => url.pathname.startsWith("/journal/"))) {
  const html = await page(url.pathname);
  assert.match(visible(html), /<article\b/, "Journal body rendered without JavaScript");
  assert.ok(html.includes(`rel="canonical" href="${url.href}"`));
}
for (const path of ["/product/seo-check-nonexistent-product", "/journal/seo-check-nonexistent-post"]) {
  const response = await fetch(new URL(path, base), { headers: { "user-agent": "Googlebot" } });
  const html = await response.text();
  assert.ok(response.status === 404 || /name="robots" content="[^"]*noindex/.test(html), "Missing pages must be 404 or noindex when streamed");
}
const feed = await page("/product-feed.xml");
assert.equal([...feed.matchAll(/<item>/g)].length, products.length, "Feed covers catalog with photos");
assert.ok(feed.includes("<g:image_link>https://"));
assert.ok(!feed.includes("undefined") && !feed.includes("placeholder.svg"));
console.log(`SEO checks passed: ${products.length} products, server-rendered storefront and journal, canonicals, missing pages, sitemap, and feed.`);
