import type { Metadata } from "next";
import { Geist_Mono, Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Helen's Beauty Secret | Certified Organic Skin Care",
    template: "%s | Helen's Beauty Secret",
  },
  description:
    "Certified organic botanicals, lab-disciplined formulation, and full ingredient transparency. Professional skin care for healthy, resilient skin.",
};

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
