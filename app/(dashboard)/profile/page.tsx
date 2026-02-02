"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI, listingsAPI, marketplaceAPI, packagesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  User,
  Check,
  Calendar,
  FileText,
  Store,
  Star,
  Settings,
  LogOut,
  Edit,
  CreditCard,
  Package,
  Trash2,
  Rocket,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("listings");

  // Fetch user profile
  const { data: profileData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await authAPI.getProfile();
      return response.data?.user || response.data;
    },
  });

  // Fetch user listings
  const { data: listingsData } = useQuery({
    queryKey: ["user-listings"],
    queryFn: () => listingsAPI.getUserListings(),
    enabled: activeTab === "listings",
  });

  // Fetch marketplace ads
  const { data: marketplaceData } = useQuery({
    queryKey: ["user-marketplace-ads"],
    queryFn: () => marketplaceAPI.getUserAds(),
    enabled: activeTab === "marketplace",
  });

  // Fetch credits
  const { data: creditsData } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const response = await packagesAPI.getUserCredits();
      const user = response.data?.user || response.data;
      return {
        adsCredits: user?.adsCredits || 0,
        featuredCredits: user?.featuredCredits || 0,
        boostCredits: user?.boostCredits || 0,
        freeAdsUsed: user?.freeAdsUsed || 0,
        freeAdsRemaining: Math.max(0, 2 - (user?.freeAdsUsed || 0)),
      };
    },
  });

  const user = profileData;
  const listings = listingsData?.data || [];
  const marketplaceAds = marketplaceData?.data || [];
  const credits = creditsData || {
    adsCredits: 0,
    featuredCredits: 0,
    boostCredits: 0,
    freeAdsRemaining: 0,
  };

  // Boost mutation
  const boostMutation = useMutation({
    mutationFn: (adId: string) => marketplaceAPI.boostAd(adId),
    onSuccess: () => {
      toast.success("Ad boosted successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-marketplace-ads"] });
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to boost ad";
      if (error.response?.data?.requiresPackage) {
        toast.error(errorMessage, {
          action: {
            label: "Buy Package",
            onClick: () => router.push("/packages"),
          },
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleBoost = (adId: string) => {
    if (credits.boostCredits < 1) {
      toast.error("Insufficient boost credits", {
        action: {
          label: "Buy Package",
          onClick: () => router.push("/packages"),
        },
      });
      return;
    }

    if (
      confirm(
        "Boost your ad for 24 hours to get more visibility. This will use 1 boost credit."
      )
    ) {
      boostMutation.mutate(adId);
    }
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return "Recently joined";
    const date = new Date(user.createdAt);
    return `Member since ${date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };

  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(" ");
      return names
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone and will delete all your listings and data."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/${user?._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Card className="glass-card border-white/10 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  {user?.profileImage ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#00FFA3]">
                      <Image
                        src={user.profileImage}
                        alt={user.fullName || user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#00FFA3] flex items-center justify-center border-4 border-[#00FFA3]">
                      <span className="text-5xl font-bold text-black">
                        {getInitials()}
                      </span>
                    </div>
                  )}
                  {user?.isVerified && (
                    <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#00FFA3] flex items-center justify-center border-4 border-black">
                      <Check className="h-5 w-5 text-black" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {user?.fullName || user?.name || "User"}
                    </h1>
                  </div>
                  <p className="text-white/70 mb-6">{getMemberSince()}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-center md:justify-start gap-8 py-6 border-t border-b border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00FFA3]">
                        {listings.length}
                      </div>
                      <div className="text-sm text-white/70">Listings</div>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00FFA3]">
                        {marketplaceAds.length}
                      </div>
                      <div className="text-sm text-white/70">Marketplace</div>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00FFA3]">
                        {credits.freeAdsRemaining + credits.adsCredits}
                      </div>
                      <div className="text-sm text-white/70">Credits</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <Button
                      onClick={() => router.push("/profile/edit")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      onClick={() => router.push("/add-listing")}
                      className="bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-white/10">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "listings"
                  ? "text-[#00FFA3] border-b-2 border-[#00FFA3]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "marketplace"
                  ? "text-[#00FFA3] border-b-2 border-[#00FFA3]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "reviews"
                  ? "text-[#00FFA3] border-b-2 border-[#00FFA3]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                {activeTab === "listings" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Your Listings
                    </h2>
                    {listings.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto text-white/30 mb-4" />
                        <p className="text-white/70 mb-4">No listings yet</p>
                        <Button
                          onClick={() => router.push("/create-listing")}
                          className="bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black"
                        >
                          Create your first listing
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {listings.map((listing: any) => (
                          <div
                            key={listing._id}
                            className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#00FFA3]/50 transition-colors"
                          >
                            <Link
                              href={`/listings/${listing._id}`}
                              className="flex-1"
                            >
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {listing.title}
                              </h3>
                              <p className="text-white/70 text-sm">
                                {listing.sportType} • {listing.listingType}
                              </p>
                              <p className="text-[#00FFA3] text-xs mt-2 capitalize">
                                Status: {listing.status}
                              </p>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/create-listing?edit=${listing._id}`)
                              }
                              className="text-[#00FFA3] hover:text-[#00FFA3] hover:bg-[#00FFA3]/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "marketplace" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Your Marketplace Ads
                    </h2>
                    {marketplaceAds.length === 0 ? (
                      <div className="text-center py-12">
                        <Store className="h-16 w-16 mx-auto text-white/30 mb-4" />
                        <p className="text-white/70 mb-4">No marketplace ads yet</p>
                        <Button
                          onClick={() => router.push("/add-listing")}
                          className="bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black"
                        >
                          Create your first ad
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {marketplaceAds.map((ad: any) => (
                          <div
                            key={ad._id}
                            className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#00FFA3]/50 transition-colors"
                          >
                            <Link
                              href={`/marketplace/${ad._id}`}
                              className="flex-1"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {ad.title}
                                </h3>
                                {ad.isBoosted && (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white text-xs rounded-full">
                                    <Rocket className="h-3 w-3" />
                                    Boosted
                                  </span>
                                )}
                              </div>
                              <p className="text-white/70 text-sm">
                                {ad.category} • Rs {ad.price}
                              </p>
                              <p className="text-[#00FFA3] text-xs mt-2 capitalize">
                                Status: {ad.status}
                              </p>
                            </Link>
                            <div className="flex items-center gap-2">
                              {!ad.isBoosted && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBoost(ad._id)}
                                  disabled={boostMutation.isPending}
                                  className="text-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                                  title={`Boost (${credits.boostCredits} credits)`}
                                >
                                  <Rocket className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/add-listing?edit=${ad._id}`)
                                }
                                className="text-[#00FFA3] hover:text-[#00FFA3] hover:bg-[#00FFA3]/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto text-white/30 mb-4" />
                    <p className="text-white/70">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link href="/my-listings">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      My Listings
                    </Button>
                  </Link>
                  <Link href="/packages">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      My Credits
                    </Button>
                  </Link>
                  <Link href="/packages">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Buy Packages
                    </Button>
                  </Link>
                  <Link href="/profile/feedback">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Feedback
                    </Button>
                  </Link>
                  <Link href="/profile/help-feedback">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Feedback
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10"
                    onClick={() => router.push("/settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:bg-red-400/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account Card */}
            <Card className="glass-card border-red-500/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Danger Zone
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* Credits Card */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Your Credits
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Free Ads</span>
                    <span className="text-[#00FFA3] font-semibold">
                      {credits.freeAdsRemaining} / 2
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Ad Credits</span>
                    <span className="text-[#00FFA3] font-semibold">
                      {credits.adsCredits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Featured</span>
                    <span className="text-[#00FFA3] font-semibold">
                      {credits.featuredCredits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Boost</span>
                    <span className="text-[#00FFA3] font-semibold">
                      {credits.boostCredits}
                    </span>
                  </div>
                  <Link href="/packages">
                    <Button className="w-full mt-4 bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black">
                      Buy More Credits
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

