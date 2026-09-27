import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getSettings } from "@/lib/storefront-data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const brandName = settings?.brandName ?? "Helen's Beauty Secret";
  return <div className="site-grain relative flex min-h-screen flex-col">
    <SiteHeader brandName={brandName} />
    <main className="relative z-10 flex-1">{children}</main>
    <SiteFooter brandName={brandName} tagline={settings?.footerTagline ?? "Skin care by Helen's Beauty Secret"}
      instagramUrl={settings?.instagramUrl} facebookUrl={settings?.facebookUrl} pinterestUrl={settings?.pinterestUrl} />
  </div>;
}
