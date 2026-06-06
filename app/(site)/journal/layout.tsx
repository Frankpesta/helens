import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Skincare Journal | Tips & Guides | Helen's Beauty Secret",
  description:
    "Expert skincare tips, organic ingredient guides, and beauty routines from Helen's Beauty Secret. Learn about natural skincare, barrier repair, SPF habits, and building an organic beauty routine.",
  alternates: { canonical: `${siteUrl}/journal` },
  keywords: [
    "skincare tips",
    "organic skincare guide",
    "natural beauty tips",
    "skin care routine guide",
    "organic ingredients",
    "barrier repair skincare",
    "clean beauty blog",
    "Helen's Beauty Secret journal",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/journal`,
    title: "Skincare Journal | Helen's Beauty Secret",
    description:
      "Expert skincare tips and organic beauty guides from Helen's Beauty Secret.",
    siteName: "Helen's Beauty Secret",
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: "Helen's Beauty Secret Journal" }],
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
