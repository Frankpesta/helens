import { getSiteUrl } from "@/lib/site-url";

export function absoluteImageUrl(path?: string | null): string | undefined {
  if (!path || path.endsWith("/placeholder.svg")) return undefined;
  try {
    const url = new URL(path, `${getSiteUrl()}/`);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function plainDescription(value: string): string {
  return value.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}
