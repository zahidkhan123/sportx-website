import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ListingDetailsClient } from "@/components/listings/ListingDetailsClient";
import { fetchListingById } from "@/lib/server-api";
import { buildListingJsonLd, buildListingMetadata, getListingHref } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(id);
  return buildListingMetadata(listing);
}

export default async function TeamListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  if (!listing) notFound();
  const path = getListingHref(listing as { _id: string; listingType?: string });
  if (path !== `/team/${id}`) redirect(path);
  return (
    <>
      <JsonLd data={buildListingJsonLd(listing)} />
      <ListingDetailsClient listingId={id} />
    </>
  );
}
