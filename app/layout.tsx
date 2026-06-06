import type { Metadata } from "next";
import { Geist_Mono, Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_PHONE_TEL } from "@/lib/site-contact";
import Script from "next/script";

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
  "Shop certified organic skincare at Helen's Beauty Secret. Natural beauty products with clean ingredients — organic face creams, serums, and moisturizers for healthy, radiant skin.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Helen's Beauty Secret",
  },
  description: defaultDescription,
  applicationName: "Helen's Beauty Secret",
  keywords: [
    "organic skincare",
    "certified organic skin care",
    "natural beauty products",
    "organic face cream",
    "organic moisturizer",
    "organic serum",
    "clean beauty",
    "non-toxic skincare",
    "natural skin care routine",
    "organic botanicals",
    "barrier repair skincare",
    "professional organic skincare",
    "Helen's Beauty Secret",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Helen's Beauty Secret",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Helen's Beauty Secret — Certified Organic Skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Helen's Beauty Secret",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/logo.png`,
  },
  telephone: SITE_PHONE_TEL.replace(/^tel:/, ""),
  description:
    "Certified organic skincare brand offering professional-grade natural beauty products including face creams, serums, and moisturizers.",
  sameAs: [],
} as const;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Helen's Beauty Secret",
  url: siteUrl,
  description: defaultDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
} as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are your organic skincare products appropriate for sensitive skin?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We formulate for broad tolerability, but \"sensitive\" is individual. Patch test new organic skincare products for 24–48 hours and introduce one formula at a time. Discontinue if irritation persists.",
      },
    },
    {
      "@type": "Question",
      name: "What does \"certified organic\" mean for your skincare products?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We emphasize certified-organic botanical inputs where marketing and regulatory language allow. Full INCI lists on each product page are the authoritative breakdown — organic claims on packaging follow certification rules for that SKU.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best organic skincare products for a daily routine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with your non-negotiables: a certified organic cleanser, hydrating moisturizer, and daytime SPF protection. Add organic serums or treatment products gradually so you can observe how your skin responds to natural ingredients.",
      },
    },
    {
      "@type": "Question",
      name: "Are Helen's Beauty Secret products clean beauty and non-toxic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Helen's Beauty Secret products are formulated without parabens and with certified organic botanicals, full INCI transparency, and stability-tested preservation — meeting professional clean beauty standards.",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- JSON-LD for crawlers
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- FAQ structured data for Google rich results
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
        <Script
          id="livechat-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__lc = window.__lc || {};
              window.__lc.license = 19766061;
              window.__lc.integration_name = "manual_onboarding";
              window.__lc.product_name = "livechat";
              ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
            `,
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
