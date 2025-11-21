"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { marketplaceAPI } from "@/lib/api";
import { MarketplaceListingCard } from "@/components/MarketplaceListingCard";
import { EmptyState } from "@/components/EmptyState";
import GoogleAds from "@/components/GoogleAds";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, DollarSign, MapPin, Tag, Plus, ChevronRight } from "lucide-react";
import { authService } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [condition, setCondition] = useState<"New" | "Used" | "">("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleCreateAd = () => {
    if (isAuthenticated) {
      router.push("/add-listing");
    } else {
      setAuthModalOpen(true);
    }
  };

  // Check if filters are applied
  const hasFilters = Boolean(
    category || location || condition || minPrice || maxPrice || search
  );

  // Fetch grouped listings by sports type (only when no filters)
  const { data: groupedData, isLoading } = useQuery({
    queryKey: ["marketplace-grouped"],
    queryFn: () => marketplaceAPI.getGroupedBySportsType(6), // 6 listings per category
    enabled: !hasFilters,
  });

  // If filters are applied, fetch filtered results
  const { data: filteredData, isLoading: isLoadingFiltered } = useQuery({
    queryKey: [
      "marketplace-filtered",
      search,
      category,
      location,
      minPrice,
      maxPrice,
      condition,
    ],
    queryFn: () =>
      marketplaceAPI.getAll({
        page: 1,
        limit: 50,
        search,
        category,
        location,
        minPrice,
        maxPrice,
        condition: condition || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: hasFilters,
  });

  const groupedListings = groupedData?.data || [];
  const filteredItems = filteredData?.data || [];

  const handleCategoryClick = (categoryName: string) => {
    setCategory(categoryName);
    // Scroll to filtered results section
    setTimeout(() => {
      const element = document.getElementById("filtered-results");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="signup"
        onSuccess={() => {
          setIsAuthenticated(true);
          router.push("/add-listing");
        }}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-white/70">Find sports equipment, gear, and more</p>
        </div>
        <Button
          onClick={handleCreateAd}
          className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="glass-card border-white/10 mb-6">
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
            <Input
              type="search"
              placeholder="Search marketplace items..."
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#00FFA3]" />
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>
              {(category || location || condition || minPrice || maxPrice) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategory("");
                    setLocation("");
                    setCondition("");
                    setMinPrice(undefined);
                    setMaxPrice(undefined);
                  }}
                  className="text-white/70 hover:text-white h-8"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Primary Filters */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#00FFA3]" />
                  Category
                </Label>
                <Select
                  value={category || undefined}
                  onValueChange={(value) =>
                    setCategory(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="all" className="text-white">
                      All Categories
                    </SelectItem>
                    <SelectItem value="Cricket" className="text-white">
                      Cricket
                    </SelectItem>
                    <SelectItem value="Football" className="text-white">
                      Football
                    </SelectItem>
                    <SelectItem value="Tennis" className="text-white">
                      Tennis
                    </SelectItem>
                    <SelectItem value="Basketball" className="text-white">
                      Basketball
                    </SelectItem>
                    <SelectItem value="Gym" className="text-white">
                      Gym
                    </SelectItem>
                    <SelectItem value="Others" className="text-white">
                      Others
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#00FFA3]" />
                  Location
                </Label>
                <Input
                  type="text"
                  placeholder="Enter location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-[#00FFA3]"
                />
              </div>

              {/* Condition Filter */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  Condition
                </Label>
                <Select
                  value={condition || undefined}
                  onValueChange={(value) =>
                    setCondition(
                      value === "all" ? "" : (value as "New" | "Used")
                    )
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="all" className="text-white">
                      All Conditions
                    </SelectItem>
                    <SelectItem value="New" className="text-white">
                      New
                    </SelectItem>
                    <SelectItem value="Used" className="text-white">
                      Used
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#00FFA3]" />
                  Min Price
                </Label>
                <Input
                  type="number"
                  placeholder="Minimum price"
                  value={minPrice || ""}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-[#00FFA3]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#00FFA3]" />
                  Max Price
                </Label>
                <Input
                  type="number"
                  placeholder="Maximum price"
                  value={maxPrice || ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-[#00FFA3]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Display Ad - Marketplace */}
      <div className="mb-6">
        <GoogleAds
          adSlot="3814764721"
          adFormat="auto"
          fullWidthResponsive={true}
          className="w-full"
          minHeight="250px"
        />
      </div>

      {(isLoading || isLoadingFiltered) ? (
        <div className="text-center py-12 text-white/70">Loading...</div>
      ) : hasFilters ? (
        // Show filtered results
        <div id="filtered-results" className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Search Results ({filteredItems.length})
          </h2>
          {filteredItems.length === 0 ? (
            <EmptyState
              title="No items found"
              description="Try adjusting your filters or check back later for new listings."
              icon="search"
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item: Record<string, unknown>) => (
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
                  href={`/marketplace/${item._id}`}
                  status={item.status as "active" | "sold" | "expired"}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Show grouped listings by sports type with horizontal scroll
        <div className="space-y-12">
          {groupedListings.length === 0 ? (
            <EmptyState
              title="No listings available"
              description="Be the first to post an ad!"
              icon="store"
            />
          ) : (
            groupedListings.map((group: any) => (
              <div key={group.category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">
                      {group.category}
                    </h2>
                    <span className="text-white/60 text-sm">
                      ({group.totalCount} {group.totalCount === 1 ? "listing" : "listings"})
                    </span>
                  </div>
                  <Link href={`/marketplace/category/${encodeURIComponent(group.category)}`}>
                    <Button
                      variant="ghost"
                      className="text-[#00FFA3] hover:text-[#00FFFF] hover:bg-[#00FFA3]/10"
                    >
                      See All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Horizontal Scroll Listings */}
                <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-4 min-w-max">
                    {group.listings.map((item: Record<string, unknown>) => (
                      <div
                        key={String(item._id)}
                        className="flex-shrink-0 w-[280px]"
                      >
                        <MarketplaceListingCard
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
                          href={`/marketplace/${item._id}`}
                          status={item.status as "active" | "sold" | "expired"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
