/** Admin create/edit: INCI list, one line per ingredient. */
export function parseIngredientsText(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * One carousel slide per line: `/path/to/image|Alt text` or `/path` only.
 * Legacy lines `before|/path|Alt` / `after|/path|Alt` still parse (kind ignored).
 */
export function parseBeforeAfterText(raw: string): {
  alt: string;
  publicPath: string;
}[] {
  const lines = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: { alt: string; publicPath: string }[] = [];
  for (const line of lines) {
    const parts = line.split("|").map((s) => s.trim());
    const first = parts[0];
    if (!first) continue;

    let publicPath: string;
    let alt: string;

    if (first === "before" || first === "after") {
      publicPath = parts[1] ?? "";
      alt =
        parts.slice(2).join("|").trim() || first || "Before and after";
    } else {
      publicPath = first;
      alt = parts.slice(1).join("|").trim() || "Before and after";
    }

    if (!publicPath) continue;
    out.push({ publicPath, alt });
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
