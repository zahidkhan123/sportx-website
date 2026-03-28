import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Equipment Marketplace Pakistan | Buy & Sell | SportX360",
  description:
    "Buy and sell sports equipment in Pakistan — cricket, football, and more. New and used gear with seller chat on SportX360.",
  alternates: { canonical: "/marketplace" },
};

export default function MarketplaceSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
