"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketplaceAPI, packagesAPI, chatAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GoogleAds from "@/components/GoogleAds";
import {
  MapPin,
  Eye,
  Heart,
  Phone,
  MessageCircle,
  Flag,
  CheckCircle,
  ArrowLeft,
  Star,
  Clock,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function MarketplaceAdDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const adId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const queryClient = useQueryClient();

  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    }
  }, []);

  // Fetch user credits
  const { data: creditsData } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const response = await packagesAPI.getUserCredits();
      const user = response.data?.user || response.data;
      return {
        boostCredits: user?.boostCredits || 0,
        featuredCredits: user?.featuredCredits || 0,
      };
    },
    enabled: !!currentUser,
  });

  const credits = creditsData || {
    boostCredits: 0,
    featuredCredits: 0,
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["marketplace-ad", adId],
    queryFn: () => marketplaceAPI.getById(adId),
  });

  const ad = data?.data;

  const isOwner =
    currentUser &&
    ad &&
    (currentUser._id === ad.userId?._id ||
      currentUser._id === ad.sellerId?._id ||
      currentUser._id === ad.userId ||
      currentUser._id === ad.sellerId);

  // Boost mutation
  const boostMutation = useMutation({
    mutationFn: () => marketplaceAPI.boostAd(adId),
    onSuccess: () => {
      toast.success("Ad boosted successfully!");
      queryClient.invalidateQueries({ queryKey: ["marketplace-ad", adId] });
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
      refetch();
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

  const handleBoost = () => {
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
      boostMutation.mutate();
    }
  };

  useEffect(() => {
    if (ad) {
      setIsWishlisted(ad.isWishlisted || false);
    }
  }, [ad]);

  const handleWishlist = async () => {
    try {
      await marketplaceAPI.toggleWishlist(adId);
      setIsWishlisted(!isWishlisted);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleCall = () => {
    if (ad?.contactNumber) {
      window.location.href = `tel:${ad.contactNumber}`;
    }
  };

  const handleWhatsApp = () => {
    if (!ad?.contactNumber) return;
    const phoneNumber = ad.contactNumber.replace(/[^0-9]/g, "");
    if (!phoneNumber) return;
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const handleReport = () => {
    if (confirm("Are you sure you want to report this ad?")) {
      // Implement report functionality
      toast.info("Report submitted");
    }
  };

  const renderDetailRow = (
    icon: React.ReactNode,
    label: string,
    value: string | number
  ) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b border-white/10">
        <div className="text-[#00FFA3] mt-0.5">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-white/70 mb-1">{label}</p>
          <p className="text-white">{value}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Ad not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isAdOwner =
    currentUser &&
    (currentUser._id === ad.userId?._id ||
      currentUser._id === ad.sellerId?._id ||
      currentUser._id === ad.userId ||
      currentUser._id === ad.sellerId);

  return (
    <div className="min-h-screen bg-black">
      {/* Header (same style as listings) */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:text-[#00FFFF]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-white">Ad Details</h1>
          <Button
            variant="ghost"
            onClick={handleWishlist}
            className="text-white hover:text-[#FF3B5C]"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-[#FF3B5C] text-[#FF3B5C]" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Layout (aligned with listings detail) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {ad.images && ad.images.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={ad.images[currentImageIndex]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {ad.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {ad.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? "border-[#00FFA3]"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${ad.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                <p className="text-white/50">No images</p>
              </div>
            )}
          </div>

          {/* Right Side - Details (mirroring listings) */}
          <div className="space-y-6">
            {/* Title, price, badges */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{ad.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-[#00FFA3]">
                  Rs {ad.price?.toLocaleString()}
                </span>
                {ad.isFeatured && (
                  <Badge className="bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black border-0 flex items-center gap-1 px-3 py-1">
                    <Star className="h-3 w-3 fill-black" />
                    Featured
                  </Badge>
                )}
                {ad.category && (
                  <Badge className="bg-white/10 text-white border-white/20">
                    {ad.category}
                  </Badge>
                )}
              </div>

              {/* Location */}
              {ad.location && (
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-white/60" />
                  <span className="text-white/80">{ad.location}</span>
                </div>
              )}

              {/* Stats (views, wishlist) */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mb-4">
                <div className="text-center">
                  <Eye className="h-5 w-5 text-[#00FFA3] mx-auto mb-1" />
                  <p className="text-white font-bold">{ad.viewsCount || 0}</p>
                  <p className="text-xs text-white/70">Views</p>
                </div>
                <div className="text-center">
                  <Heart className="h-5 w-5 text-[#00FFA3] mx-auto mb-1" />
                  <p className="text-white font-bold">
                    {ad.wishlistCount || 0}
                  </p>
                  <p className="text-xs text-white/70">Saved</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {ad.description && (
              <Card className="glass-card border-white/10">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-3">
                    About this item
                  </h3>
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {ad.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Posted By + contact actions (same pattern as listings) */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">Posted By</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#39FF14] flex items-center justify-center text-black font-bold text-lg">
                    {ad.sellerId?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">
                        {ad.sellerId?.fullName || "Unknown Seller"}
                      </p>
                      {ad.sellerId?.isVerified && (
                        <CheckCircle className="h-4 w-4 text-[#00FFA3]" />
                      )}
                    </div>
                    {ad.sellerId?.city && (
                      <p className="text-white/70 text-sm">{ad.sellerId.city}</p>
                    )}
                  </div>
                </div>

                {/* {!isAdOwner && ( */}
                  <>
                    <Button
                      onClick={async () => {
                        if (!currentUser) {
                          router.push(`/login?redirect=/marketplace/${adId}`);
                          return;
                        }
                        try {
                          setChatLoading(true);
                          const res = await chatAPI.getOrCreateChat(
                            "PRODUCT",
                            adId
                          );
                          const chat = res?.data?.chat;
                          if (chat) router.push(`/chats/${chat._id}`);
                        } catch (e: any) {
                          toast.error(
                            e?.response?.data?.message || "Could not start chat"
                          );
                        } finally {
                          setChatLoading(false);
                        }
                      }}
                      disabled={chatLoading}
                      className="mt-3 w-full bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {chatLoading ? "Opening..." : "Chat with seller"}
                    </Button>

                    {ad.contactNumber && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* <Button
                          onClick={handleCall}
                          className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button> */}
                        {/* <Button
                          onClick={handleWhatsApp}
                          className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button> */}
                      </div>
                    )}
                  </>
                {/* )} */}
              </CardContent>
            </Card>

            {/* Owner-only actions: boost status */}
            {/* {isAdOwner && (
              <Card className="glass-card border-white/10">
                <CardContent className="p-4 space-y-3">
                  {!ad.isBoosted ? (
                    <Button
                      onClick={handleBoost}
                      disabled={
                        boostMutation.isPending || credits.boostCredits < 1
                      }
                      className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white hover:from-[#FF6B6B]/90 hover:to-[#FF8E53]/90 h-12 text-sm font-semibold"
                    >
                      <Rocket className="h-5 w-5 mr-2" />
                      {boostMutation.isPending
                        ? "Boosting..."
                        : `Boost Ad (${credits.boostCredits} credits)`}
                    </Button>
                  ) : (
                    <div className="w-full bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black p-3 rounded-lg text-center text-sm font-semibold flex items-center justify-center gap-2">
                      <Rocket className="h-4 w-4" />
                      <span>Ad is Boosted</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )} */}

            {/* Post Information (basic) */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">
                  Ad Information
                </h3>
                <div className="space-y-0">
                  {renderDetailRow(
                    <Clock className="h-5 w-5" />,
                    "Created",
                    ad.createdAt
                      ? new Date(ad.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""
                  )}
                  {renderDetailRow(
                    <Clock className="h-5 w-5" />,
                    "Last Updated",
                    ad.updatedAt
                      ? new Date(ad.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""
                  )}
                  {renderDetailRow(
                    <CheckCircle className="h-5 w-5" />,
                    "Status",
                    ad.status?.toUpperCase?.() || "ACTIVE"
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report button */}
            <Button
              variant="outline"
              onClick={handleReport}
              className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 h-12"
            >
              <Flag className="h-5 w-5 mr-2" />
              Report Ad
            </Button>
          </div>
        </div>

        {/* Google Ads at Bottom */}
        <div className="mb-8">
          <GoogleAds
            adSlot="3814764721"
            adFormat="auto"
            fullWidthResponsive={true}
            className="w-full"
            minHeight="250px"
          />
        </div>
      </div>
    </div>
  );
}
