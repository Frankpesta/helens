/** Admin create/edit: INCI list, one line per ingredient. */
export function parseIngredientsText(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Format: before|/path|Alt or after|/path|Alt (public path or uploaded later on edit). */
export function parseBeforeAfterText(raw: string): {
  alt: string;
  publicPath: string;
  kind: "before" | "after";
}[] {
  const lines = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: {
    alt: string;
    publicPath: string;
    kind: "before" | "after";
  }[] = [];
  for (const line of lines) {
    const parts = line.split("|").map((s) => s.trim());
    const kind = parts[0];
    const path = parts[1];
    const alt = parts.slice(2).join("|").trim() || kind || "Slide";
    if (kind !== "before" && kind !== "after") continue;
    if (!path) continue;
    out.push({
      kind,
      publicPath: path,
      alt,
    });
  }
  return out;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
