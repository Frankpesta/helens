/**
 * Canonical site origin for metadata, sitemap, and robots (no trailing slash).
 * Override with NEXT_PUBLIC_SITE_URL (e.g. http://localhost:3000 for local-only testing).
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://helensbeautysecret.com"
  ).replace(/\/$/, "");
}
