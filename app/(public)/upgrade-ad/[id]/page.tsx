"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { packagesAPI, listingsAPI } from "@/lib/api";
import { authService } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Listing {
  _id: string;
  title: string;
  description?: string;
  isBoosted: boolean;
  isFeatured: boolean;
  boostExpiry?: string;
  featuredAt?: string;
}

interface UserCredits {
  featuredCredits: number;
  boostCredits: number;
}

export default function UpgradeAdPage() {
  const router = useRouter();
  const params = useParams();
  const adId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadData();
  }, [router, adId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listingRes, creditsRes] = await Promise.all([
        listingsAPI.getById(adId),
        packagesAPI.getUserCredits(),
      ]);

      setListing(listingRes.data);
      const userData = creditsRes.data;
      setCredits({
        featuredCredits: userData?.featuredCredits || 0,
        boostCredits: userData?.boostCredits || 0,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load ad");
      router.push("/sports");
    } finally {
      setLoading(false);
    }
  };

  const handleFeature = async () => {
    if (!credits || credits.featuredCredits < 1) {
      toast.error("You don't have featured credits. Buy a package first.");
      router.push("/packages");
      return;
    }

    if (listing?.isFeatured) {
      toast.info("This ad is already featured");
      return;
    }

    try {
      setUpgrading("feature");
      await packagesAPI.useFeature(adId);
      toast.success("Ad featured successfully!");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to feature ad");
    } finally {
      setUpgrading(null);
    }
  };

  const handleBoost = async () => {
    if (!credits || credits.boostCredits < 1) {
      toast.error("You don't have boost credits. Buy a package first.");
      router.push("/packages");
      return;
    }

    const isBoostActive =
      listing?.isBoosted &&
      listing?.boostExpiry &&
      new Date(listing.boostExpiry) > new Date();

    if (isBoostActive) {
      toast.info("This ad is already boosted");
      return;
    }

    try {
      setUpgrading("boost");
      await packagesAPI.useBoost(adId);
      toast.success("Ad boosted successfully for 24 hours!");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to boost ad");
    } finally {
      setUpgrading(null);
    }
  };

  const isBoostActive =
    listing?.isBoosted &&
    listing?.boostExpiry &&
    new Date(listing.boostExpiry) > new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4">Loading ad...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Ad not found</p>
          <Link href="/sports">
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href={`/sports/${adId}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ad
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Upgrade Your Ad
          </h1>
          <p className="text-gray-400 text-lg">{listing.title}</p>
        </div>

        {/* Current Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Featured Status
              </h3>
              {listing.isFeatured ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Featured</span>
                </div>
              ) : (
                <span className="text-gray-400">Not Featured</span>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Featured ads appear at the top of listings for maximum visibility.
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Boost Status
              </h3>
              {isBoostActive ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Boosted</span>
                </div>
              ) : (
                <span className="text-gray-400">Not Boosted</span>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              {isBoostActive
                ? `Expires: ${new Date(listing.boostExpiry!).toLocaleString()}`
                : "Boost your ad to the top for 24 hours."}
            </p>
          </Card>
        </div>

        {/* Upgrade Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Feature Option */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Feature Ad</h3>
              <p className="text-gray-400">
                Make your ad appear at the top of listings
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Permanent featured placement</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Maximum visibility</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Increases engagement</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">
                  Your Credits: {credits?.featuredCredits || 0}
                </div>
                {credits && credits.featuredCredits < 1 && (
                  <Link href="/packages" className="text-cyan-400 hover:underline text-sm">
                    Buy Featured Credits
                  </Link>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              onClick={handleFeature}
              disabled={listing.isFeatured || upgrading === "feature" || (credits?.featuredCredits || 0) < 1}
            >
              {listing.isFeatured ? (
                "Already Featured"
              ) : upgrading === "feature" ? (
                "Processing..."
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Feature This Ad
                </>
              )}
            </Button>
          </Card>

          {/* Boost Option */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Boost Ad</h3>
              <p className="text-gray-400">
                Push your ad to the top for 24 hours
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>24-hour boost period</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Perfect for new listings</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Increases views</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">
                  Your Credits: {credits?.boostCredits || 0}
                </div>
                {credits && credits.boostCredits < 1 && (
                  <Link href="/packages" className="text-cyan-400 hover:underline text-sm">
                    Buy Boost Credits
                  </Link>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={handleBoost}
              disabled={isBoostActive || upgrading === "boost" || (credits?.boostCredits || 0) < 1}
            >
              {isBoostActive ? (
                "Already Boosted"
              ) : upgrading === "boost" ? (
                "Processing..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Boost This Ad
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

