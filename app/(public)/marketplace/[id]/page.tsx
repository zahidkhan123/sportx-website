import type { Metadata } from "next";
import { MarketplaceAdDetailsClient } from "@/components/marketplace/MarketplaceAdDetailsClient";
import { fetchMarketplaceById } from "@/lib/server-api";
import { buildMarketplaceAdMetadata, buildProductJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ad = await fetchMarketplaceById(id);
  return buildMarketplaceAdMetadata(ad);
}

export default async function MarketplaceAdPage({ params }: Props) {
  const { id } = await params;
  const ad = await fetchMarketplaceById(id);
  return (
    <>
      {ad ? <JsonLd data={buildProductJsonLd(ad)} /> : null}
      <MarketplaceAdDetailsClient adId={id} />
    </>
  );
}
