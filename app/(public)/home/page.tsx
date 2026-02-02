// "use client";

// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { ListingCard } from "@/components/ListingCard";
// import { MarketplaceListingCard } from "@/components/MarketplaceListingCard";
// import GoogleAds from "@/components/GoogleAds";
// import { VerificationBanner } from "@/components/VerificationBanner";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { marketplaceAPI, listingsAPI } from "@/lib/api";
// import { ArrowRight, Download, TrendingUp, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { useLocation } from "@/contexts/LocationContext";

// export default function HomePage() {
//   const queryClient = useQueryClient();
//   const { selectedLocation } = useLocation();

//   // Get location filter value (empty string for "all", city name for specific cities)
//   const locationFilter = selectedLocation.value === 'all' 
//     ? '' 
//     : selectedLocation.city || selectedLocation.label;

//   // Listen for location changes and invalidate queries
//   useEffect(() => {
//     const handleLocationChange = () => {
//       // Invalidate queries to refetch with new location
//       queryClient.invalidateQueries({ queryKey: ["featured-ads"] });
//       queryClient.invalidateQueries({ queryKey: ["marketplace-grouped-homepage"] });
//       queryClient.invalidateQueries({ queryKey: ["recent-listings"] });
//     };
//     window.addEventListener('locationChanged', handleLocationChange);
//     return () => window.removeEventListener('locationChanged', handleLocationChange);
//   }, [queryClient]);

//   const { data: featuredAds } = useQuery({
//     queryKey: ["featured-ads", locationFilter],
//     queryFn: () => marketplaceAPI.getFeatured(locationFilter || undefined),
//   });

//   const { data: recentListings } = useQuery({
//     queryKey: ["recent-listings", locationFilter],
//     queryFn: () => listingsAPI.getAll({ 
//       page: 1, 
//       limit: 6,
//       city: locationFilter || undefined,
//     }),
//   });

//   // Fetch grouped marketplace listings by sports type
//   const { data: groupedMarketplaceData } = useQuery({
//     queryKey: ["marketplace-grouped-homepage", locationFilter],
//     queryFn: () => marketplaceAPI.getGroupedBySportsType(4, locationFilter || undefined), // 4 listings per category for homepage
//   });

//   const groupedMarketplaceListings = groupedMarketplaceData?.data || [];

//   return (
//     <div className="min-h-screen">
//       {/* Verification Banner */}
//       <VerificationBanner />

//       {/* Hero Section */}
//       <section className="relative overflow-hidden border-b border-white/10">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-transparent to-[#39FF14]/10"></div>
//         <div className="container relative mx-auto px-4 py-24 md:py-32">
//           <div className="max-w-3xl">
//             <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
//               Your Ultimate <span className="text-[#00FFFF]">Sports</span>{" "}
//               Marketplace
//             </h1>
//             <p className="text-xl text-white/70 mb-8">
//               Connect with teams, buy and sell sports equipment, and discover
//               amazing sports opportunities all in one place.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link href="/marketplace">
//                 <Button
//                   size="lg"
//                   className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
//                 >
//                   Explore Marketplace
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Link href="/sports">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-white/10 text-white hover:bg-white/5"
//                 >
//                   Browse Sports
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Responsive Display Ad - Homepage */}
//       <section className="container mx-auto px-4 py-8">
//         <GoogleAds
//           adSlot="3814764721"
//           adFormat="auto"
//           fullWidthResponsive={true}
//           className="w-full"
//           minHeight="250px"
//         />
//       </section>

//       {/* Featured Ads */}
//       {featuredAds?.data && featuredAds.data.length > 0 && (
//         <section className="container mx-auto px-4 py-16">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-bold text-white mb-2">
//                 <TrendingUp className="inline h-8 w-8 text-[#39FF14] mr-2" />
//                 Featured Items
//               </h2>
//               <p className="text-white/70">Handpicked premium listings</p>
//             </div>
//             <Link href="/marketplace">
//               <Button
//                 variant="ghost"
//                 className="text-white/70 hover:text-white"
//               >
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//           {/* Cards Grid */}
//           <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//             {featuredAds.data
//               .slice(0, 6)
//               .map((item: Record<string, unknown>) => (
//                 <MarketplaceListingCard
//                   key={String(item._id)}
//                   id={String(item._id)}
//                   title={item.title as string}
//                   description={item.description as string}
//                   price={item.price as number}
//                   image={(item.images as string[])?.[0]}
//                   location={item.location as string}
//                   category={item.category as string}
//                   condition={item.condition as "New" | "Used"}
//                   viewsCount={item.viewsCount as number}
//                   isFeatured={item.isFeatured as boolean}
//                   isBoosted={item.isBoosted as boolean}
//                   href={`/marketplace/${item._id}`}
//                   status={item.status as "active" | "sold" | "expired"}
//                 />
//               ))}
//           </div>
//         </section>
//       )}

//       {/* Marketplace Listings by Category */}
//       {groupedMarketplaceListings.length > 0 && (
//         <section className="container mx-auto px-4 py-16">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-bold text-white mb-2">
//                 Marketplace by Category
//               </h2>
//               <p className="text-white/70">Browse sports equipment by category</p>
//             </div>
//             <Link href="/marketplace">
//               <Button
//                 variant="ghost"
//                 className="text-white/70 hover:text-white"
//               >
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
          
//           {/* Grouped Listings by Category with Horizontal Scroll */}
//           <div className="space-y-12">
//             {groupedMarketplaceListings.map((group: any) => (
//               <div key={group.category} className="space-y-4">
//                 {/* Category Header */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-bold text-white">
//                       {group.category}
//                     </h3>
//                     <span className="text-white/60 text-sm">
//                       ({group.totalCount} {group.totalCount === 1 ? "listing" : "listings"})
//                     </span>
//                   </div>
//                   <Link href={`/marketplace/category/${encodeURIComponent(group.category)}`}>
//                     <Button
//                       variant="ghost"
//                       className="text-[#00FFA3] hover:text-[#00FFFF] hover:bg-[#00FFA3]/10"
//                     >
//                       See All
//                       <ChevronRight className="h-4 w-4 ml-1" />
//                     </Button>
//                   </Link>
//                 </div>

//                 {/* Horizontal Scroll Listings */}
//                 <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
//                   <div className="flex gap-4 min-w-max">
//                     {group.listings.map((item: Record<string, unknown>) => (
//                       <div
//                         key={String(item._id)}
//                         className="flex-shrink-0 w-[280px]"
//                       >
//                         <MarketplaceListingCard
//                           id={String(item._id)}
//                           title={item.title as string}
//                           description={item.description as string}
//                           price={item.price as number}
//                           image={(item.images as string[])?.[0]}
//                           location={item.location as string}
//                           category={item.category as string}
//                           condition={item.condition as "New" | "Used"}
//                           viewsCount={item.viewsCount as number}
//                           isFeatured={item.isFeatured as boolean}
//                           href={`/marketplace/${item._id}`}
//                           status={item.status as "active" | "sold" | "expired"}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Recent Listings */}
//       {recentListings?.data && recentListings.data.length > 0 && (
//         <section className="container mx-auto px-4 py-16">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-bold text-white mb-2">
//                 Latest Sports Listings
//               </h2>
//               <p className="text-white/70">Newest opportunities in sports</p>
//             </div>
//             <Link href="/sports">
//               <Button
//                 variant="ghost"
//                 className="text-white/70 hover:text-white"
//               >
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//           {/* Cards Grid */}
//           <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//             {recentListings.data
//               .slice(0, 6)
//               .map((listing: Record<string, unknown>) => (
//                 <ListingCard
//                   key={String(listing._id)}
//                   title={(listing.title as string) || "Untitled Listing"}
//                   sport={listing.sportType as string}
//                   listingType={listing.listingType as string}
//                   city={listing.city as string}
//                   href={`/sports/${listing._id}`}
//                   description={listing.description as string}
//                   userId={
//                     listing.userId as {
//                       profileImage?: string;
//                       name?: string;
//                       fullName?: string;
//                     }
//                   }
//                   createdAt={listing.createdAt as string}
//                   listingData={listing.data as Record<string, unknown>}
//                   location={listing.location as Record<string, unknown>}
//                   isFeatured={listing.isFeatured as boolean}
//                   isBoosted={listing.isBoosted as boolean}
//                 />
//               ))}
//           </div>
//         </section>
//       )}

//       {/* Vertical Sidebar Ad - Commented out until ad slot ID is created */}
//       {/* Uncomment and add your sidebar ad slot ID when ready */}
//       {/* 
//       <section className="container mx-auto px-4 py-8">
//         <div className="flex justify-center">
//           <div className="w-full max-w-[300px]">
//             <GoogleAds
//               adSlot="YOUR_AD_SLOT_ID_SIDEBAR"
//               adFormat="vertical"
//               className="w-full"
//               minHeight="600px"
//             />
//           </div>
//         </div>
//       </section>
//       */}

//       {/* CTA Section */}
//       <section className="container mx-auto px-4 py-16">
//         <div className="glass-card border-white/10 p-12 text-center">
//           <h2 className="text-3xl font-bold text-white mb-4">
//             Ready to Get Started?
//           </h2>
//           <p className="text-white/70 mb-8 max-w-2xl mx-auto">
//             Download the SportX app for iOS and Android to access all features
//             on the go.
//           </p>
//           <div className="flex justify-center gap-4">
//             <Button
//               size="lg"
//               className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
//             >
//               <Download className="mr-2 h-5 w-5" />
//               Download App
//             </Button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GoogleAds from "@/components/GoogleAds";
import { VerificationBanner } from "@/components/VerificationBanner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { marketplaceAPI, listingsAPI } from "@/lib/api";
import { authService } from "@/lib/auth";
import { getListingLocationSubtitle } from "@/lib/utils";
import { generateDescriptiveSubtitle } from "@/lib/listingDescriptiveSubtitle";
import {
  Search,
  ChevronRight,
  PlusCircle,
  Users,
  Building2,
  ShoppingCart,
  Flame,
  PersonStanding,
  Trophy,
  MapPin,
  Ribbon,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useLocation } from "@/contexts/LocationContext";

// Category gradients/icons matching mobile DashboardHomeScreen
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  player: ["#00FFA3", "#4DD0E1"],
  team: ["#F7971E", "#FFD200"],
  tournament: ["#E100FF", "#7F00FF"],
  ground: ["#43CEA2", "#185A9D"],
  officials: ["#FF512F", "#DD2476"],
};

const CATEGORIES = [
  { id: "player", label: "Players", icon: PersonStanding },
  { id: "team", label: "Teams", icon: Users },
  { id: "tournament", label: "Tournaments", icon: Trophy },
  { id: "ground", label: "Grounds", icon: MapPin },
  { id: "officials", label: "Umpires / Scorers", icon: Ribbon },
];

export default function HomePage() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const locationFilter =
    selectedLocation.value === "all"
      ? ""
      : selectedLocation.city || selectedLocation.label;

  useEffect(() => {
    setIsAuthenticated(!!authService.getCurrentUser());
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      queryClient.invalidateQueries({ queryKey: ["featured-listings-grouped"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-preview"] });
      queryClient.invalidateQueries({ queryKey: ["trending-listings"] });
    };
    window.addEventListener("locationChanged", handleLocationChange);
    return () => window.removeEventListener("locationChanged", handleLocationChange);
  }, [queryClient]);

  // Featured listings: grouped by sports type, flatten to 6 (like mobile)
  const { data: groupedListings, isLoading: loadingFeatured } = useQuery({
    queryKey: ["featured-listings-grouped", locationFilter],
    queryFn: () => listingsAPI.getGroupedBySportsType(3, locationFilter || undefined),
  });

  const featuredListings = useCallback(() => {
    const grouped = groupedListings?.data || groupedListings || [];
    const flattened: Record<string, unknown>[] = [];
    for (const group of grouped) {
      const list = (group as { listings?: Record<string, unknown>[] }).listings || [];
      for (const item of list) {
        if (flattened.length >= 6) break;
        flattened.push(item);
      }
    }
    return flattened;
  }, [groupedListings])();

  // Marketplace preview: featured first, then recent (4 items)
  const { data: featuredAds } = useQuery({
    queryKey: ["marketplace-preview", locationFilter],
    queryFn: () => marketplaceAPI.getFeatured(locationFilter || undefined),
  });

  const { data: marketplaceAds } = useQuery({
    queryKey: ["marketplace-ads-fallback", locationFilter],
    queryFn: () => marketplaceAPI.getAll({ page: 1, limit: 4 }),
    enabled: !featuredAds?.data?.length,
  });

  const marketplacePreview =
    featuredAds?.data?.length > 0
      ? (featuredAds.data as Record<string, unknown>[]).slice(0, 4)
      : (marketplaceAds?.data as Record<string, unknown>[] | undefined)?.slice(0, 4) || [];

  // Trending: recent active listings (6)
  const { data: trendingData } = useQuery({
    queryKey: ["trending-listings", locationFilter],
    queryFn: () =>
      listingsAPI.getAll({
        page: 1,
        limit: 6,
        city: locationFilter || undefined,
      }),
  });

  const trendingListings =
    (trendingData?.data as Record<string, unknown>[] | undefined) || [];

  const loading = loadingFeatured;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0d0d3a 50%, #1a1a2e 100%)",
      }}
    >
      <VerificationBanner />

      {/* ========== PREVIOUS HOME PAGE (commented out - do not remove) ==========
      <div className="min-h-screen">
        <VerificationBanner />
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-transparent to-[#39FF14]/10"></div>
          <div className="container relative mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Your Ultimate <span className="text-[#00FFFF]">Sports</span> Marketplace
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Connect with teams, buy and sell sports equipment, and discover
                amazing sports opportunities all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/marketplace">
                  <Button size="lg" className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sports">
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    Browse Sports
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8">
          <GoogleAds adSlot="3814764721" adFormat="auto" fullWidthResponsive={true} className="w-full" minHeight="250px" />
        </section>
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
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {featuredAds.data.slice(0, 6).map((item) => (
                <MarketplaceListingCard key={...} ... />
              ))}
            </div>
          </section>
        )}
        {groupedMarketplaceListings.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Marketplace by Category</h2>
                <p className="text-white/70">Browse sports equipment by category</p>
              </div>
              <Link href="/marketplace">...</Link>
            </div>
            <div className="space-y-12">...</div>
          </section>
        )}
        {recentListings?.data && recentListings.data.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Latest Sports Listings</h2>
                <p className="text-white/70">Newest opportunities in sports</p>
              </div>
              <Link href="/sports">...</Link>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">...</div>
          </section>
        )}
        <section className="container mx-auto px-4 py-16">
          <div className="glass-card border-white/10 p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Download the SportX app for iOS and Android to access all features on the go.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90">
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Main content - web-optimized layout */}
      <div className="w-full">
        {/* Hero section */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-transparent to-[#39FF14]/10" />
          <div className="container relative mx-auto max-w-6xl px-6 py-16 md:py-24 lg:py-28">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Your Ultimate{" "}
                <span className="bg-gradient-to-r from-[#00FFA3] to-[#00FFFF] bg-clip-text text-transparent">
                  Sports
                </span>{" "}
                Marketplace
              </h1>
              <p className="mt-4 text-lg text-white/75 sm:text-xl">
                Connect with teams, buy and sell sports equipment, and discover
                amazing opportunities — all in one place.
              </p>
              {/* Search bar - prominent in hero */}
              <div className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-white/15 bg-black/40 px-4 py-3 shadow-lg backdrop-blur-sm">
                <Search className="h-5 w-5 shrink-0 text-white/60" />
                <input
                  type="search"
                  placeholder="Search teams, players, grounds, gear…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      window.location.href = `/sports?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="flex-1 bg-transparent text-base text-white placeholder:text-white/50 outline-none"
                />
                <Link href={`/sports?search=${encodeURIComponent(searchQuery)}`}>
                  <Button
                    size="default"
                    className="bg-[#00FFA3] text-[#0D0D0D] hover:bg-[#00FFA3]/90"
                  >
                    Search
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/sports">
                  <Button
                    size="lg"
                    className="bg-[#00FFA3] text-[#0D0D0D] hover:bg-[#00FFA3]/90"
                  >
                    Browse Listings
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container relative mx-auto max-w-6xl px-6 py-10 md:py-14">
          {/* Quick actions - 4 columns on desktop */}
          <section className="mb-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Quick actions
              </h2>
              <p className="mt-1 text-white/60">
                The fastest way to get started
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: PlusCircle,
                  label: "Post Listing",
                  sub: "Create a new listing",
                  href: isAuthenticated ? "/create-listing" : "/login",
                },
                {
                  icon: Users,
                  label: "Find Match / Team",
                  sub: "Teams & players",
                  href: "/sports",
                },
                {
                  icon: Building2,
                  label: "Book Ground",
                  sub: "Venues & grounds",
                  href: "/sports",
                },
                {
                  icon: ShoppingCart,
                  label: "Buy / Sell Gear",
                  sub: "Marketplace",
                  href: "/marketplace",
                },
              ].map(({ icon: Icon, label, sub, href }) => (
                <Link key={label} href={href}>
                  <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#00FFA3]/30 hover:bg-white/[0.08]">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00FFA3]/30 bg-[#00FFA3]/10">
                        <Icon className="h-6 w-6 text-[#00FFA3]" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 transition group-hover:text-[#00FFA3]" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Responsive Display Ad */}
          <section className="mb-14">
            <GoogleAds
              adSlot="3814764721"
              adFormat="auto"
              fullWidthResponsive={true}
              className="w-full"
              minHeight="250px"
            />
          </section>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-[#00FFA3]" />
            </div>
          ) : (
            <>
              {/* Featured Listings - grid on desktop */}
              {featuredListings.length > 0 && (
                <section className="mb-14">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white md:text-3xl">
                        Featured Listings
                      </h2>
                      <p className="mt-1 text-white/60">
                        What&apos;s happening near you
                      </p>
                    </div>
                    <Link
                      href="/sports"
                      className="inline-flex items-center text-[#00FFA3] font-semibold hover:text-[#00FFA3]/90"
                    >
                      View all listings
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredListings.map((listing) => {
                      const id = String(listing._id);
                      const type = (listing.listingType as string) || "listing";
                      const sportType = ((listing.sportType as string) || "")
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      const locSub = getListingLocationSubtitle(listing);
                      const descriptiveSubtitle = generateDescriptiveSubtitle(listing);
                      return (
                        <Link
                          key={id}
                          href={`/sports/${id}`}
                          className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#00FFA3]/25 hover:bg-white/[0.08]"
                        >
                          <div className="flex items-start justify-between">
                            <span className="rounded-full bg-[#00FFA3]/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#00FFA3]">
                              {type}
                              {sportType ? ` · ${sportType}` : ""}
                            </span>
                            <ChevronRight className="h-5 w-5 text-white/40 transition group-hover:text-[#00FFA3]" />
                          </div>
                          <p className="mt-3 text-base font-semibold text-white line-clamp-2">
                            {(listing.title as string) || "Untitled"}
                          </p>
                          <p className="mt-2 text-sm text-white/60 line-clamp-2">
                            {descriptiveSubtitle || (locSub ? `📍 ${locSub}` : "📍 Nearby")}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Marketplace section - Shop Gear */}
              <section className="mb-14">
                <div
                  className="rounded-2xl border border-[rgba(0,255,163,0.2)] overflow-hidden shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,255,163,0.12) 0%, rgba(13,13,58,0.9) 100%)",
                  }}
                >
                  <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="h-5 w-5 text-[#00FFA3]" />
                        <span className="text-sm font-semibold uppercase tracking-wide text-[#00FFA3]">
                          Marketplace Picks
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white md:text-3xl">
                        Shop Gear
                      </h2>
                      <p className="mt-2 text-white/70">
                        Buy & sell sports gear — new and used
                      </p>
                    </div>
                    <Link href="/marketplace">
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-[#0D0D0D] font-bold hover:opacity-90 min-h-11 px-6"
                        size="lg"
                      >
                        Explore Marketplace
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  {marketplacePreview.length > 0 ? (
                    <div className="grid gap-5 p-6 pt-0 sm:grid-cols-2 lg:grid-cols-4 md:p-8 md:pt-0">
                      {marketplacePreview.map((ad) => {
                        const id = String(ad._id);
                        const images = ad.images as string[] | undefined;
                        const imageUri = images?.[0];
                        const condition = (ad.condition as string) || "Used";
                        return (
                          <Link
                            key={id}
                            href={`/marketplace/${id}`}
                            className="group rounded-xl border border-white/10 bg-black/40 overflow-hidden transition hover:border-[#00FFA3]/25"
                          >
                            <div className="relative h-40 bg-white/5">
                              {imageUri ? (
                                <img
                                  src={imageUri}
                                  alt=""
                                  className="h-full w-full object-cover transition group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <ShoppingCart className="h-10 w-10 text-[#00FFA3]/50" />
                                </div>
                              )}
                              <div className="absolute bottom-3 left-3 rounded-full bg-black/80 border border-[#00FFA3]/30 px-3 py-1.5">
                                <span className="text-sm font-bold text-white">
                                  Rs {Number(ad.price || 0).toLocaleString()}
                                </span>
                              </div>
                              <div
                                className={`absolute top-3 left-3 rounded-full px-3 py-1.5 text-xs font-bold text-[#0D0D0D] ${
                                  condition === "New"
                                    ? "bg-[#00FFA3]"
                                    : "bg-[#00CFFF]"
                                }`}
                              >
                                {condition}
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="font-semibold text-white truncate">
                                {(ad.title as string) || "Untitled"}
                              </p>
                              <p className="mt-1 text-sm text-white/55 truncate">
                                {(ad.category as string) || "Gear"} ·{" "}
                                {(ad.location as string) || "Nearby"}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-10 px-6 text-center md:px-8">
                      <p className="text-white/60">
                        No ads right now. Browse or post gear below.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Explore by category */}
              <section className="mb-14">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">
                    Explore by category
                  </h2>
                  <p className="mt-1 text-white/60">
                    Jump into listings with one click
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {CATEGORIES.map((cat) => {
                    const gradient = CATEGORY_GRADIENTS[cat.id] || [
                      "#00FFA3",
                      "#4DD0E1",
                    ];
                    const Icon = cat.icon;
                    return (
                      <Link key={cat.id} href="/sports">
                        <div
                          className="group relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl p-6 transition hover:scale-[1.02] hover:shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
                          }}
                        >
                          <div className="flex h-14 w-14 items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/25 bg-black/20 shadow-md">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <span className="mt-3 text-center text-base font-bold text-white tracking-wide">
                            {cat.label}
                          </span>
                          <div className="absolute right-4 top-4 rounded-full bg-black/15 p-2 transition group-hover:bg-black/25">
                            <ChevronRight className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Trending now - grid on desktop */}
              {trendingListings.length > 0 && (
                <section className="mb-14">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#00FFA3] px-4 py-2">
                      <Flame className="h-4 w-4 text-[#0D0D0D]" />
                      <span className="text-sm font-bold text-[#0D0D0D]">
                        Trending
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                      Trending now
                    </h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {trendingListings.map((listing) => {
                      const id = String(listing._id);
                      const type = (listing.listingType as string) || "listing";
                      const locSub = getListingLocationSubtitle(listing);
                      const descriptiveSubtitle = generateDescriptiveSubtitle(listing);
                      return (
                        <Link
                          key={id}
                          href={`/sports/${id}`}
                          className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#00FFA3]/25 hover:bg-white/[0.08]"
                        >
                          <div className="flex items-start justify-between">
                            <span className="rounded-full bg-[#00FFA3]/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#00FFA3]">
                              {type}
                            </span>
                            <ChevronRight className="h-5 w-5 text-white/40 transition group-hover:text-[#00FFA3]" />
                          </div>
                          <p className="mt-3 text-base font-semibold text-white line-clamp-2">
                            {(listing.title as string) || "Untitled"}
                          </p>
                          <p className="mt-2 text-sm text-white/60 line-clamp-2">
                            {descriptiveSubtitle || (locSub ? `📍 ${locSub}` : "📍 Nearby")}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Conversion / CTA card */}
              <section className="pb-12 md:pb-16">
                <div className="rounded-2xl border border-[rgba(0,255,163,0.2)] bg-black/50 p-8 text-center shadow-xl md:p-12">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">
                    Didn&apos;t find what you&apos;re looking for?
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
                    Post your own listing in seconds and let the right players,
                    teams, and organizers find you.
                  </p>
                  <Link
                    href={isAuthenticated ? "/create-listing" : "/login"}
                    className="mt-8 inline-block"
                  >
                    <Button
                      className="rounded-full bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] px-8 py-6 text-base font-bold text-[#0D0D0D] hover:opacity-90"
                      size="lg"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create Listing
                    </Button>
                  </Link>
                </div>
              </section>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
