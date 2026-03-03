"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listingsAPI } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";
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
import { useQueryClient } from "@tanstack/react-query";

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

const CITIES_OPTIONS = [
  { value: "all", label: "All Cities" },
  { value: "Lahore", label: "Lahore" },
  { value: "Karachi", label: "Karachi" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Faisalabad", label: "Faisalabad" },
  { value: "Rawalpindi", label: "Rawalpindi" },
  { value: "Multan", label: "Multan" },
  { value: "Peshawar", label: "Peshawar" },
  { value: "Quetta", label: "Quetta" },
];

export default function SportsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { selectedLocation } = useLocation();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Listen for location changes and invalidate queries
  useEffect(() => {
    const handleLocationChange = () => {
      // Invalidate queries to refetch with new location
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    };
    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, [queryClient]);

  // Get city filter value (empty string for "all", city name for specific cities)
  const cityFilter = selectedLocation.value === 'all' 
    ? '' 
    : selectedLocation.city || '';

  const handleCreateListing = () => {
    if (isAuthenticated) {
      router.push("/create-listing");
    } else {
      router.push("/signup");
    }
  };

  // Check if filters are applied
  const hasFilters = Boolean(sport !== "all" || cityFilter || search);

  // Fetch grouped listings by sport type (only when no filters)
  const { data: groupedData, isLoading: isLoadingGrouped } = useQuery({
    queryKey: ["listings-grouped", cityFilter],
    queryFn: () => listingsAPI.getGroupedBySportsType(6, cityFilter || undefined),
    enabled: !hasFilters,
  });

  // If filters are applied, fetch filtered results
  const { data, isLoading: isLoadingFiltered } = useQuery({
    queryKey: ["listings", page, sport, cityFilter],
    queryFn: () =>
      listingsAPI.getAll({
        page,
        limit: 12,
        sport: sport === "all" ? "" : sport,
        city: cityFilter,
      }),
    enabled: hasFilters,
  });

  const isLoading = hasFilters ? isLoadingFiltered : isLoadingGrouped;
  const listings = hasFilters ? (data?.data || []) : [];
  const pagination = hasFilters ? (data?.pagination || { page: 1, pages: 1, total: 0 }) : { page: 1, pages: 1, total: 0 };
  const groupedListings = !hasFilters ? (groupedData?.data || []) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Sports Listings</h1>
          <p className="text-white/70">
            Find teams, tournaments, players, and more
          </p>
        </div>
        <Button
          onClick={handleCreateListing}
          className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="glass-card border-white/10 mb-8">
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
            <Input
              type="search"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-[#00FFA3]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#00FFA3]" />
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>
              {sport !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSport("all");
                  }}
                  className="text-white/70 hover:text-white h-8"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {/* Sport Filter */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Sport Type
                </Label>
                <Select value={sport} onValueChange={setSport}>
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


              {/* Active Filters Display */}
              {sport !== "all" && (
                <div className="flex items-end">
                  <div className="flex flex-wrap gap-2 w-full">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#00FFA3]/20 text-[#00FFA3] rounded-lg text-sm font-medium">
                      <span>
                        {SPORTS_OPTIONS.find((s) => s.value === sport)?.label}
                      </span>
                      <button
                        onClick={() => setSport("all")}
                        className="ml-1 hover:text-[#00FFA3]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Display Ad - Sports Listings */}
      <div className="mb-6">
        <GoogleAds
          adSlot="3814764721"
          adFormat="auto"
          fullWidthResponsive={true}
          className="w-full"
          minHeight="250px"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-white/70">Loading...</div>
      ) : hasFilters ? (
        // Show filtered results
        listings.length === 0 ? (
          <EmptyState
            title="No listings found"
            description="Try adjusting your filters or check back later for new listings."
            icon="search"
          />
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {listings.map((listing: Record<string, unknown>) => (
                <ListingCard
                  key={String(listing._id)}
                  title={(listing.title as string) || "Untitled Listing"}
                  sport={listing.sportType as string}
                  listingType={listing.listingType as string}
                  city={listing.city as string}
                  href={`/sports/${listing._id}`}
                  description={listing.description as string}
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
      ) : (
        // Show grouped listings by sport type
        groupedListings.length === 0 ? (
          <EmptyState
            title="No listings found"
            description="Check back later for new listings."
            icon="search"
          />
        ) : (
          <div className="space-y-12">
            {groupedListings.map((group: any) => (
              <div key={group.sportType}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {group.sportType.replace("_", " ")} Listings
                  </h2>
                  <span className="text-white/60 text-sm">
                    {group.totalCount} {group.totalCount === 1 ? "listing" : "listings"}
                  </span>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {group.listings.map((listing: Record<string, unknown>) => (
                    <ListingCard
                      key={String(listing._id)}
                      title={(listing.title as string) || "Untitled Listing"}
                      sport={listing.sportType as string}
                      listingType={listing.listingType as string}
                      city={(listing.location as any)?.city as string}
                      href={`/sports/${listing._id}`}
                      description={listing.description as string}
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
                      isBoosted={listing.isBoosted as boolean}
                    />
                  ))}
                </div>
                {group.totalCount > group.listings.length && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSport(group.sportType)}
                      className="border-[#00FFA3] text-[#00FFA3] hover:bg-[#00FFA3]/10"
                    >
                      View All {group.sportType.replace("_", " ")} Listings ({group.totalCount})
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
