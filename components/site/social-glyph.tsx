export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 22v-8.3h2.8l.4-3.3h-3.2V8.6c0-.9.3-1.6 1.7-1.6H17V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.8v3.3h2.5V22h3.2z" />
    </svg>
  );
}

export function PinterestGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.04 0C5.384 0 0 5.36 0 11.986c0 5.07 3.11 9.42 7.52 11.11-.1-.94-.19-2.39.04-3.41.21-.91 1.36-5.8 1.36-5.8s-.35-.7-.35-1.73c0-1.62.94-2.83 2.1-2.83.99 0 1.47.74 1.47 1.63 0 .99-.63 2.47-.95 3.84-.27 1.15.57 2.09 1.69 2.09 2.03 0 3.6-2.14 3.6-5.24 0-2.74-1.97-4.66-4.78-4.66-3.26 0-5.17 2.44-5.17 4.96 0 .98.38 2.03.85 2.6.09.11.1.21.08.32l-.31 1.24c-.05.19-.16.23-.37.14-1.38-.64-2.24-2.65-2.24-4.27 0-3.47 2.52-6.66 7.26-6.66 3.81 0 6.77 2.72 6.77 6.35 0 3.79-2.39 6.83-5.71 6.83-1.12 0-2.17-.58-2.53-1.27l-.69 2.63c-.25.96-.93 2.16-1.38 2.9 1.04.32 2.15.49 3.31.49 6.65 0 12.03-5.36 12.03-11.986C24.07 5.36 18.69 0 12.04 0z" />
    </svg>
  );
}
