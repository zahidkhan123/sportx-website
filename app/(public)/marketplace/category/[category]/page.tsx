"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { marketplaceAPI } from "@/lib/api";
import { MarketplaceListingCard } from "@/components/MarketplaceListingCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { filterRealMarketplaceItems } from "@/lib/utils";

export default function MarketplaceCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category as string;
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-category", category, page],
    queryFn: () =>
      marketplaceAPI.getAll({
        page,
        limit: 20,
        category: decodeURIComponent(category || ""),
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: !!category,
  });

  const items = filterRealMarketplaceItems(
    data?.data as Record<string, unknown>[] | undefined
  );
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/marketplace">
          <Button
            variant="ghost"
            className="mb-4 text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">
          {decodeURIComponent(category || "Marketplace")}
        </h1>
        <p className="text-white/70">
          {pagination.total} {pagination.total === 1 ? "listing" : "listings"} available
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-white/70">Loading...</div>
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${decodeURIComponent(category || "")} listings found`}
          description="Try checking back later for new listings."
          icon="search"
        />
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item: Record<string, unknown>) => (
              <MarketplaceListingCard
                key={String(item._id)}
                id={String(item._id)}
                title={item.title as string}
                description={item.description as string}
                price={item.price as number}
                image={(item.images as string[])?.[0]}
                location={item.location as string}
                category={item.category as string}
                condition={item.condition as "New" | "Used"}
                viewsCount={item.viewsCount as number}
                isFeatured={item.isFeatured as boolean}
                isBoosted={item.isBoosted as boolean}
                href={`/marketplace/${item._id}`}
                status={item.status as "active" | "sold" | "expired"}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white/10 text-white"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-white/70">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="border-white/10 text-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

