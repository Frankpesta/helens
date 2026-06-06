import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contact Us | Helen's Beauty Secret",
  description:
    "Contact the Helen's Beauty Secret care team with questions about organic skincare products, ingredients, orders, or professional use.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/contact`,
    title: "Contact | Helen's Beauty Secret",
    description: "Get in touch with our skincare care team.",
    siteName: "Helen's Beauty Secret",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
