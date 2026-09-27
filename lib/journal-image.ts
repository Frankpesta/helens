// Retired seed illustrations are absent from public/. Do not advertise broken images.
const retiredImages = new Set([
  "/products/spf-1.svg", "/products/oil-1.svg", "/products/cream-1.svg",
  "/products/cleanser-1.svg", "/products/serum-1.svg",
]);

export function journalImagePath(path?: string): string | undefined {
  return path && !retiredImages.has(path) ? path : undefined;
}
