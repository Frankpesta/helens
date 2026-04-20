const DEFAULT_PRODUCTION_ORIGIN = "https://helensbeautysecret.com";

/**
 * Canonical site origin for metadata, sitemap, and robots (no trailing slash).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.… if that is your GSC property).
 * For local-only testing you can use http://localhost:3000.
 */
export function getSiteUrl(): string {
  let raw =
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_PRODUCTION_ORIGIN;
  raw = raw.replace(/\/$/, "");

  const isProdDeploy =
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (isProdDeploy && /localhost|127\.0\.0\.1/i.test(raw)) {
    return DEFAULT_PRODUCTION_ORIGIN;
  }

  return raw;
}
