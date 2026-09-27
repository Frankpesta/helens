# SEO changes and rollout

## Verified problems

- The live homepage returned a loading screen in its initial HTML. The storefront layout waited for a browser-only Convex subscription before rendering any page content.
- Home, shop, product pages, and journal pages also waited for browser queries. Ingredients and product links were missing from the initial rendered page.
- Product metadata ignored the existing `seoTitle` and `seoDescription` fields. Server queries stopped waiting after three seconds and silently returned incomplete metadata.
- Product structured data always claimed stock was available and omitted gallery uploads.
- Image URL concatenation could corrupt absolute upload URLs. The sitemap deliberately excluded uploaded images and silently dropped catalog URLs on query failures.
- FAQ markup appeared on every page and did not match the actual FAQ copy. A homepage canonical was inherited by pages without their own canonical.
- Seeded journal image paths point to files that no longer exist. They are now excluded from SEO image references; journal cards use the existing brand image as a visual fallback until real editorial images are supplied.

## Implemented

The storefront layout loads settings on the server. Home, shop, product and journal views receive server data, preserving their browser subscriptions. Product descriptions, ingredients, links and galleries are rendered in the page HTML. Missing/inactive products and missing/unpublished posts use Next.js `notFound()`; service errors remain errors instead of becoming empty successful pages.

Product metadata uses saved SEO fields, actual gallery images, valid absolute URLs, real prices/currency and inventory. JSON-LD is safely serialized. Unrelated global FAQ markup was removed. Legal pages have their own metadata and canonicals.

`/ingredients` groups the ingredient entries already stored in active products and links to their formulas. Links from the shop and product pages make this index discoverable. No ingredient benefits, certifications or medical claims were invented.

`/sitemap.xml` is generated from current catalog data, including uploaded gallery images. False modification dates on static pages were removed. A query failure fails the sitemap request rather than publishing a truncated sitemap.

`/product-feed.xml` is an RSS product feed for Merchant Center. It includes current public product names, descriptions, prices, availability and up to 10 additional images. It does not invent GTINs, MPNs, shipping rates or return policies.

## Required release steps

1. Deploy the Next.js changes. No Convex schema change, data mutation or backend deployment is required. Keep `NEXT_PUBLIC_CONVEX_URL` pointed at the production catalog and `NEXT_PUBLIC_SITE_URL=https://helensbeautysecret.com`.
2. Verify the deployed sitemap and feed return XML successfully. Use Search Console URL Inspection on the homepage, shop, ingredient index and representative product pages. Confirm their rendered content, self-canonical and indexability; request indexing and resubmit the sitemap once.
3. Create Google Merchant Center, verify/claim the domain, and enable free listings. Add `https://helensbeautysecret.com/product-feed.xml` as a scheduled product data source. This URL becomes available only after deployment.
4. Configure actual shipping charges, delivery coverage and return policy for each supported market. Start with the USA and Canada, then check current free-listing eligibility for Nigeria and each additional African/European country. Do not target countries the checkout cannot serve.
5. Supply genuine GTINs/MPNs where assigned. The current product schema has no identifier fields; identifiers must be supplied through Merchant Center or a later catalog enhancement. Missing values do not establish that identifiers do not exist. Review product diagnostics before considering the account ready.
6. Test representative product pages in Google's Rich Results Test. Review product photo suitability and uploaded image crawlability. Existing local photos are 1024×1536 or 1536×1024; retain their original resolution. Verify the image host in Search Console if you control it and Google requests this.

## Content and measurement

- Review every product's ingredient list against its packaging. Complete missing lists and save distinct SEO titles/descriptions using the product's real type and differentiating ingredients. Only claim certifications, reviews and benefits that can be substantiated.
- The ingredient index helps discovery; it is not a substitute for useful editorial content. Prioritize substantive guides based on actual Search Console queries, with accurate ingredient explanations and links to relevant products. Avoid generating thin pages for every ingredient or country.
- Replace missing journal illustrations with relevant original images through the journal editor. Use accurate alt text for product gallery uploads.
- Track indexed product URLs, impressions, clicks, queries and countries in Search Console, including the Image search filter. Track Merchant Center product approvals and free-listing clicks separately. Compare results after Google recrawls; submission does not guarantee indexing or rankings.
- The existing queries cap the storefront at 50 products and the journal at 50 posts. Add pagination and complete sitemap enumeration before the catalog exceeds those limits.

## Verification

Validated locally against the live public catalog: production build passed, changed-file ESLint passed, and the smoke check passed for all 7 products and 6 journal articles. Both XML endpoints parsed successfully: 23 sitemap URLs and 7 feed items. All 7 primary product images returned HTTP 200 through the local production image optimizer. These results do not mean the changes have been deployed.

Build with the production public Convex URL, then start the app and run:

```text
npm run build
npm run start -- --port 3000
node scripts/check-seo.mjs http://localhost:3000
```

The smoke check covers initial HTML, product structured data, canonical URLs, journal rendering, missing pages, sitemap coverage and feed coverage. It does not certify Google's indexing decisions or Merchant Center approval.

References: [Google image guidance](https://developers.google.com/search/docs/appearance/google-images), [product structured data](https://developers.google.com/search/docs/appearance/structured-data/product), [Merchant Center free listings](https://support.google.com/merchants/answer/13889434), [product data specification](https://support.google.com/merchants/answer/7052112).
