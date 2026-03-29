"use client";

import type { ReactNode } from "react";

function splitBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <span key={i} className="text-gold font-medium">
          {m[1]}
        </span>
      );
    }
    return part;
  });
}

export function RichDescription({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={className}>
      {splitBold(text).map((node, i) =>
        typeof node === "string" ? (
          <span key={i}>{node}</span>
        ) : (
          node
        ),
      )}
    </p>
  );
}
