import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { ContextMenuBlocker } from "@/components/ContextMenuBlocker";
import { buildOrganizationJsonLd, getSiteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SportX360 — Sports Marketplace Pakistan | Players, Teams, Grounds",
    template: "%s | SportX360",
  },
  description:
    "Find cricket players in Pakistan, join a team near you, book a ground in Lahore or Karachi, enter sports tournaments, hire umpires and scorers, and buy sports equipment — SportX360.",
  applicationName: "SportX360",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "SportX360",
    title: "SportX360 — Sports Marketplace",
    description:
      "Players, teams, tournaments, grounds, and sports equipment across Pakistan and worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportX360 — Sports Marketplace",
    description:
      "Connect with players and teams, book grounds, and shop sports gear in Pakistan.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="google-adsense-verification"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1874611183482152"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={buildOrganizationJsonLd()} />
        <ContextMenuBlocker>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ContextMenuBlocker>
      </body>
    </html>
  );
}
