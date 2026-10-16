import type { Metadata } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import "./competition.css";
import "./club-life.css";
import "./teams.css";
import "./join.css";
import "./mobile.css";
import "./editorial.css";
import "./managed-content.css";
import "@/components/about/about.css";
import { CartProvider } from '@/components/shop/cart-provider';
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SiteChrome } from '@/components/site-chrome';
export const metadata: Metadata = {
  title: {
    default: "Western Roos | Tournament Softball Club",
    template: "%s | Western Roos",
  },
  description:
    "Western Roos Tournament Softball Club promotes participation, player development, competition and community connection.",
  icons: { icon: "/favicon.ico" },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <CartProvider><SiteChrome><Navigation /></SiteChrome>
        <main id="main">{children}</main>
        <SiteChrome><Footer /></SiteChrome></CartProvider>
      </body>
    </html>
  );
}
