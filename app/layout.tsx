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
    "Find cricket players in Pakistan, join a cricket team near you, and connect with cricket players near you. Browse cricket teams in Pakistan, book grounds, tournaments, and gear — your sports marketplace Pakistan on SportX360.",
  keywords: [
    "find cricket players in Pakistan",
    "join cricket team near me",
    "cricket players near me",
    "cricket teams Pakistan",
    "sports marketplace Pakistan",
  ],
  applicationName: "SportX360",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "SportX360",
    title: "SportX360 — Sports Marketplace",
    description:
      "Find cricket players in Pakistan, join a team near you, and explore cricket teams and sports listings across Pakistan and worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportX360 — Sports Marketplace",
    description:
      "Cricket players near you, cricket teams Pakistan, grounds, and sports marketplace listings.",
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
