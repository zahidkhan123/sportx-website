"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { marketplaceAPI, type MarketplaceProductCondition } from "@/lib/api";
import { filterRealMarketplaceItems } from "@/lib/utils";
import { MarketplaceListingCard } from "@/components/MarketplaceListingCard";
import GoogleAds from "@/components/GoogleAds";
import { Loader2 } from "lucide-react";

/**
 * SEO-focused equipment hub: loads marketplace inventory with keyword-rich surrounding copy on the server page.
 */
export function EquipmentBrowseClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["equipment-marketplace-seo"],
    queryFn: () =>
      marketplaceAPI.getAll({
        page: 1,
        limit: 24,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  const items = filterRealMarketplaceItems(
    data?.data as Record<string, unknown>[] | undefined
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#00FFA3]" />
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {items.map((item) => (
              <MarketplaceListingCard
                key={String(item._id)}
                id={String(item._id)}
                title={item.title as string}
                description={item.description as string}
                price={item.price as number}
                image={(item.images as string[])?.[0]}
                location={item.location as string}
                category={item.category as string}
                condition={item.condition as MarketplaceProductCondition}
                viewsCount={item.viewsCount as number}
                isFeatured={item.isFeatured as boolean}
                featuredTier={
                  (item.featuredTier as "featured" | "promoted" | null | undefined) ?? null
                }
                isBoosted={item.isBoosted as boolean}
                href={`/marketplace/${item._id}`}
                status={item.status as "active" | "sold" | "expired"}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace"
              className="text-[#00FFFF] font-semibold hover:underline"
            >
              Open full marketplace →
            </Link>
          </div>
        </>
      )}
      <div className="mt-12">
        <GoogleAds
          adSlot="3814764721"
          adFormat="auto"
          fullWidthResponsive
          className="w-full"
          minHeight="250px"
        />
      </div>
    </div>
  );
}
