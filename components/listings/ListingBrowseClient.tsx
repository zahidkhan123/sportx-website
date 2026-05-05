"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listingsAPI } from "@/lib/api";
import { getListingHref } from "@/lib/seo";
import { ListingCard, type ListingImageEntry } from "@/components/ListingCard";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import GoogleAds from "@/components/GoogleAds";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useLocation } from "@/contexts/LocationContext";

const SPORTS_OPTIONS = [
  { value: "all", label: "All Sports" },
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "hockey", label: "Hockey" },
  { value: "badminton", label: "Badminton" },
  { value: "table_tennis", label: "Table Tennis" },
  { value: "volleyball", label: "Volleyball" },
  { value: "tennis", label: "Tennis" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" },
  { value: "kabaddi", label: "Kabaddi" },
  { value: "squash", label: "Squash" },
  { value: "golf", label: "Golf" },
  { value: "rugby", label: "Rugby" },
  { value: "athletics", label: "Athletics" },
  { value: "swimming", label: "Swimming" },
  { value: "handball", label: "Handball" },
  { value: "chess", label: "Chess" },
  { value: "cycling", label: "Cycling" },
  { value: "boxing", label: "Boxing" },
];

export type BrowseVariant = "all" | "player" | "team" | "tournament" | "ground";

type ForcedFilters = {
  sport: string;
  city: string;
  listingType: Exclude<BrowseVariant, "all">;
};

type Props = {
  variant: BrowseVariant;
  /** When set, ignore navbar location — used by /discover/[slug] landing pages. */
  forced?: ForcedFilters;
  pageTitle: string;
  pageSubtitle: string;
};

export function ListingBrowseClient({
  variant,
  forced,
  pageTitle,
  pageSubtitle,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState(forced?.sport || "all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { selectedLocation } = useLocation();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings-grouped"] });
    };
    window.addEventListener("locationChanged", handleLocationChange);
    return () => window.removeEventListener("locationChanged", handleLocationChange);
  }, [queryClient]);

  const cityFilter = forced
    ? forced.city
    : selectedLocation.value === "all"
      ? ""
      : selectedLocation.city || "";

  const listingTypeParam =
    variant === "all" ? undefined : variant;

  useEffect(() => {
    if (forced?.sport) setSport(forced.sport);
  }, [forced?.sport]);

  const handleCreateListing = () => {
    if (isAuthenticated) router.push("/create-listing");
    else router.push("/signup");
  };

  const hasTypeFilter = variant !== "all";
  const hasFilters = Boolean(
    sport !== "all" || cityFilter || search || hasTypeFilter || forced
  );

  const { data: groupedData, isLoading: isLoadingGrouped } = useQuery({
    queryKey: ["listings-grouped", cityFilter],
    queryFn: () => listingsAPI.getGroupedBySportsType(6, cityFilter || undefined),
    enabled: !hasFilters && !forced,
  });

  const { data, isLoading: isLoadingFiltered } = useQuery({
    queryKey: [
      "listings",
      page,
      sport,
      cityFilter,
      listingTypeParam,
      forced?.city,
      forced?.sport,
    ],
    queryFn: () =>
      listingsAPI.getAll({
        page,
        limit: 12,
        sport: sport === "all" ? "" : sport,
        city: cityFilter,
        type: listingTypeParam || undefined,
      }),
    enabled: hasFilters || !!forced,
  });

  const isLoading = hasFilters || forced ? isLoadingFiltered : isLoadingGrouped;
  const listings = hasFilters || forced ? (data?.data || []) : [];
  const pagination =
    hasFilters || forced
      ? data?.pagination || { page: 1, pages: 1, total: 0 }
      : { page: 1, pages: 1, total: 0 };
  const groupedListings =
    !hasFilters && !forced ? (groupedData?.data || []) : [];

  const listingHref = (row: Record<string, unknown>) =>
    getListingHref({
      _id: String(row._id),
      listingType: row.listingType as string,
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-white/70 max-w-2xl">{pageSubtitle}</p>
        </div>
        <Button
          onClick={handleCreateListing}
          className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      <Card className="glass-card border-white/10 mb-8">
        <CardContent className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
            <Input
              type="search"
              placeholder="Search on page…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-[#00FFA3]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {!forced && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-[#00FFA3]" />
                <h2 className="text-lg font-semibold text-white">Filters</h2>
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Sport Type
                </Label>
                <Select
                  value={sport}
                  onValueChange={(v) => {
                    setSport(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {SPORTS_OPTIONS.map((sportOption) => (
                      <SelectItem
                        key={sportOption.value}
                        value={sportOption.value}
                        className="text-white"
                      >
                        {sportOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {forced ? (
            <p className="text-sm text-white/50 mt-2">
              Showing results for{" "}
              <span className="text-[#00FFA3]">
                {forced.city}
              </span>{" "}
              — use the main{" "}
              <a href="/sports" className="text-[#00FFFF] underline">
                sports listings
              </a>{" "}
              page to browse all cities.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="mb-6">
        <GoogleAds
          adSlot="3814764721"
          adFormat="auto"
          fullWidthResponsive
          className="w-full"
          minHeight="250px"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-white/70">Loading...</div>
      ) : hasFilters || forced ? (
        listings.length === 0 ? (
          <EmptyState
            title="No listings found"
            description="Try another sport or check back soon for new posts."
            icon="search"
          />
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {listings
                .filter((row: Record<string, unknown>) => {
                  if (!search.trim()) return true;
                  const t = `${(row.title as string) || ""} ${(row.description as string) || ""}`.toLowerCase();
                  return t.includes(search.toLowerCase());
                })
                .map((listing: Record<string, unknown>) => (
                  <ListingCard
                    key={String(listing._id)}
                    title={(listing.title as string) || "Untitled Listing"}
                    sport={listing.sportType as string}
                    listingType={listing.listingType as string}
                    city={listing.city as string}
                    href={listingHref(listing)}
                    description={listing.description as string}
                    images={listing.images as ListingImageEntry[] | undefined}
                    userId={
                      listing.userId as {
                        profileImage?: string;
                        name?: string;
                        fullName?: string;
                      }
                    }
                    createdAt={listing.createdAt as string}
                    listingData={listing.data as Record<string, unknown>}
                    location={listing.location as Record<string, unknown>}
                    isFeatured={listing.isFeatured as boolean}
                    featuredTier={
                      (listing as { featuredTier?: "featured" | "promoted" | null })
                        .featuredTier ?? null
                    }
                    isBoosted={listing.isBoosted as boolean}
                  />
                ))}
            </div>
            {pagination.pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )
      ) : groupedListings.length === 0 ? (
        <EmptyState
          title="No listings found"
          description="Check back later for new listings."
          icon="search"
        />
      ) : (
        <div className="space-y-12">
          {groupedListings.map((group: Record<string, unknown>) => (
            <div key={String(group.sportType)}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white capitalize">
                  {String(group.sportType).replace("_", " ")} Listings
                </h2>
                <span className="text-white/60 text-sm">
                  {group.totalCount as number}{" "}
                  {(group.totalCount as number) === 1 ? "listing" : "listings"}
                </span>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {(group.listings as Record<string, unknown>[]).map(
                  (listing: Record<string, unknown>) => (
                    <ListingCard
                      key={String(listing._id)}
                      title={(listing.title as string) || "Untitled Listing"}
                      sport={listing.sportType as string}
                      listingType={listing.listingType as string}
                      city={(listing.location as { city?: string })?.city as string}
                      href={listingHref(listing)}
                      description={listing.description as string}
                      images={listing.images as ListingImageEntry[] | undefined}
                      userId={
                        listing.userId as {
                          profileImage?: string;
                          name?: string;
                          fullName?: string;
                        }
                      }
                      createdAt={listing.createdAt as string}
                      listingData={listing.data as Record<string, unknown>}
                      location={listing.location as Record<string, unknown>}
                      isFeatured={listing.isFeatured as boolean}
                      featuredTier={
                        (listing as { featuredTier?: "featured" | "promoted" | null })
                          .featuredTier ?? null
                      }
                      isBoosted={listing.isBoosted as boolean}
                    />
                  )
                )}
              </div>
              {(group.totalCount as number) >
                (group.listings as unknown[]).length && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSport(String(group.sportType))}
                    className="border-[#00FFA3] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                  >
                    View All {String(group.sportType).replace("_", " ")} Listings (
                    {group.totalCount as number})
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
