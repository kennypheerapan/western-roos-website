import type { Metadata } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import "./competition.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
export const metadata: Metadata = {
  title: {
    default: "Western Roos | Tournament Softball Club",
    template: "%s | Western Roos",
  },
  description:
    "Western Roos Tournament Softball Club promotes participation, player development, competition and community connection.",
  icons: { icon: "/preview-icon.svg" },
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
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
