"use client";

import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { MarketplaceListingCard } from "@/components/MarketplaceListingCard";
import GoogleAds from "@/components/GoogleAds";
import { VerificationBanner } from "@/components/VerificationBanner";
import { useQuery } from "@tanstack/react-query";
import { marketplaceAPI, listingsAPI } from "@/lib/api";
import { ArrowRight, Download, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: featuredAds } = useQuery({
    queryKey: ["featured-ads"],
    queryFn: () => marketplaceAPI.getFeatured(),
  });

  const { data: recentListings } = useQuery({
    queryKey: ["recent-listings"],
    queryFn: () => listingsAPI.getAll({ page: 1, limit: 6 }),
  });

  // Fetch grouped marketplace listings by sports type
  const { data: groupedMarketplaceData } = useQuery({
    queryKey: ["marketplace-grouped-homepage"],
    queryFn: () => marketplaceAPI.getGroupedBySportsType(4), // 4 listings per category for homepage
  });

  const groupedMarketplaceListings = groupedMarketplaceData?.data || [];

  return (
    <div className="min-h-screen">
      {/* Verification Banner */}
      <VerificationBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-transparent to-[#39FF14]/10"></div>
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Ultimate <span className="text-[#00FFFF]">Sports</span>{" "}
              Marketplace
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Connect with teams, buy and sell sports equipment, and discover
              amazing sports opportunities all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
                >
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sports">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Browse Sports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Display Ad - Homepage */}
      <section className="container mx-auto px-4 py-8">
        <GoogleAds
          adSlot="3814764721"
          adFormat="auto"
          fullWidthResponsive={true}
          className="w-full"
          minHeight="250px"
        />
      </section>

      {/* Featured Ads */}
      {featuredAds?.data && featuredAds.data.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                <TrendingUp className="inline h-8 w-8 text-[#39FF14] mr-2" />
                Featured Items
              </h2>
              <p className="text-white/70">Handpicked premium listings</p>
            </div>
            <Link href="/marketplace">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* Cards Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {featuredAds.data
              .slice(0, 6)
              .map((item: Record<string, unknown>) => (
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
        </section>
      )}

      {/* Marketplace Listings by Category */}
      {groupedMarketplaceListings.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Marketplace by Category
              </h2>
              <p className="text-white/70">Browse sports equipment by category</p>
            </div>
            <Link href="/marketplace">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Grouped Listings by Category with Horizontal Scroll */}
          <div className="space-y-12">
            {groupedMarketplaceListings.map((group: any) => (
              <div key={group.category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">
                      {group.category}
                    </h3>
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
            ))}
          </div>
        </section>
      )}

      {/* Recent Listings */}
      {recentListings?.data && recentListings.data.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Latest Sports Listings
              </h2>
              <p className="text-white/70">Newest opportunities in sports</p>
            </div>
            <Link href="/sports">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* Cards Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {recentListings.data
              .slice(0, 6)
              .map((listing: Record<string, unknown>) => (
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
                />
              ))}
          </div>
        </section>
      )}

      {/* Vertical Sidebar Ad - Commented out until ad slot ID is created */}
      {/* Uncomment and add your sidebar ad slot ID when ready */}
      {/* 
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[300px]">
            <GoogleAds
              adSlot="YOUR_AD_SLOT_ID_SIDEBAR"
              adFormat="vertical"
              className="w-full"
              minHeight="600px"
            />
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card border-white/10 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Download the SportX app for iOS and Android to access all features
            on the go.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
            >
              <Download className="mr-2 h-5 w-5" />
              Download App
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
