import type { Metadata } from "next";
import { Geist_Mono, Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_PHONE_TEL } from "@/lib/site-contact";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const defaultTitle = "Helen's Beauty Secret | Certified Organic Skin Care";
const defaultDescription =
  "Certified organic botanicals, lab-disciplined formulation, and full ingredient transparency. Professional skin care for healthy, resilient skin.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Helen's Beauty Secret",
  },
  description: defaultDescription,
  applicationName: "Helen's Beauty Secret",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Helen's Beauty Secret",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/logo.png", alt: "Helen's Beauty Secret" }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Helen's Beauty Secret",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  telephone: SITE_PHONE_TEL.replace(/^tel:/, ""),
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full",
        manrope.variable,
        notoSerif.variable,
        geistMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ConvexAuthNextjsServerProvider>
          <Providers>
            {children}
            <Toaster position="top-center" richColors />
          </Providers>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
