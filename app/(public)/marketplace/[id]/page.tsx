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
  ChevronLeft,
  ChevronRight,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

export default function MarketplaceAdDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const adId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (ad?.images && ad.images.length > 1) {
        if (e.key === "ArrowLeft" && currentImageIndex > 0) {
          prevImage();
        } else if (
          e.key === "ArrowRight" &&
          currentImageIndex < ad.images.length - 1
        ) {
          nextImage();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentImageIndex, ad?.images]);

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
    if (ad?.contactNumber) {
      const phoneNumber = ad.contactNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }
  };

  const handleReport = () => {
    if (confirm("Are you sure you want to report this ad?")) {
      // Implement report functionality
      toast.info("Report submitted");
    }
  };

  const nextImage = () => {
    if (ad?.images && currentImageIndex < ad.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
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

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Header - Airbnb style */}
      {showStickyHeader && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:text-[#00FFFF]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
            <h1 className="text-lg font-semibold text-white truncate max-w-md">
              {ad.title}
            </h1>
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
      )}

      {/* Floating Header Buttons */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-3">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-10 h-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </Button>
        <Button
          variant="ghost"
          onClick={handleWishlist}
          className="w-10 h-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg"
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted ? "fill-[#FF3B5C] text-[#FF3B5C]" : "text-black"
            }`}
          />
        </Button>
      </div>

      {/* Image Gallery - Airbnb style with Slider */}
      {ad.images && ad.images.length > 0 && (
        <div className="relative w-full h-[60vh] bg-black overflow-hidden">
          {/* Image Slider Container */}
          <div className="relative w-full h-full overflow-hidden">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
                width: `${ad.images.length * 100}%`,
              }}
            >
              {ad.images.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0"
                  style={{ width: `${100 / ad.images.length}%` }}
                >
                  <img
                    src={image}
                    alt={`${ad.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Only show if more than 1 image */}
          {ad.images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-black" />
                </button>
              )}
              {currentImageIndex < ad.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-black" />
                </button>
              )}
            </>
          )}

          {/* Image Indicators - Only show if more than 1 image */}
          {ad.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {ad.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 hover:bg-white/80 ${
                    currentImageIndex === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Image Counter - Only show if more than 1 image */}
                {ad.images.length > 1 && (
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-10">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {ad.images.length}
              </span>
            </div>
          )}

          {/* Thumbnail Strip - Optional, show at bottom for quick navigation */}
          {ad.images.length > 1 && ad.images.length <= 6 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 z-10">
              <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide">
                {ad.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                        ? "border-[#00FFA3] scale-110"
                        : "border-white/30 hover:border-white/60"
                        }`}
                      >
                        <img
                          src={image}
                      alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
              </div>
            )}
          </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Title and Price Section */}
            <div>
              <h1 className="text-4xl font-semibold text-white mb-4">
                {ad.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#00FFA3]">
                  Rs {ad.price?.toLocaleString()}
                  </span>
                </div>
                {ad.isFeatured && (
                  <Badge className="bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black border-0 flex items-center gap-1 px-3 py-1">
                    <Star className="h-3 w-3 fill-black" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-white/60" />
                <span className="text-white/80">{ad.location}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-8" />

              {/* Seller Section - Airbnb style */}
              <div className="flex items-center gap-4 pb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#39FF14] flex items-center justify-center text-black font-bold text-xl">
                  {ad.sellerId?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-white">
                      {ad.sellerId?.fullName || "Unknown Seller"}
                    </h3>
                    {ad.sellerId?.isVerified && (
                      <CheckCircle className="h-5 w-5 text-[#00FFA3]" />
                    )}
                  </div>
                  {ad.sellerId?.city && (
                    <p className="text-white/70">{ad.sellerId.city}</p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-8" />

              {/* Description Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  About this item
                </h2>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <p className="text-sm text-white/60 mb-2">Category</p>
                    <p className="text-lg font-semibold text-white">
                    {ad.category}
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <p className="text-sm text-white/60 mb-2">Condition</p>
                    <p
                      className={`text-lg font-semibold ${
                      ad.condition === "New"
                          ? "text-[#00FFA3]"
                          : "text-[#FFC107]"
                      }`}
                  >
                    {ad.condition}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-white/60" />
                  <span className="text-white/80">
                    {ad.viewsCount || 0} views
                  </span>
                  </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-white/60" />
                  <span className="text-white/80">
                    {ad.wishlistCount || 0} saved
                  </span>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Contact Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="glass-card border-white/10 p-6">
              <div className="space-y-6">
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#00FFA3]">
                      Rs {ad.price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>{ad.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOwner && !ad?.isBoosted && (
                <Button
                  onClick={handleBoost}
                  disabled={boostMutation.isPending || credits.boostCredits < 1}
                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white hover:from-[#FF6B6B]/90 hover:to-[#FF8E53]/90 h-14 text-lg font-semibold"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  {boostMutation.isPending
                    ? "Boosting..."
                    : `Boost Ad (${credits.boostCredits} credits)`}
                </Button>
              )}
              {isOwner && ad?.isBoosted && (
                <div className="w-full bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black p-4 rounded-lg text-center font-semibold">
                  <Rocket className="h-5 w-5 mx-auto mb-2" />
                  Ad is Boosted
                </div>
              )}
              {!isOwner && (
                <>
                  <Button
                    onClick={async () => {
                      setChatLoading(true);
                      try {
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
                    className="w-full bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90 h-14 text-lg font-semibold"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {chatLoading ? "Opening..." : "Chat with Seller"}
                  </Button>
                  <Button
                    onClick={handleCall}
                    className="w-full bg-white/10 text-white hover:bg-white/20 h-14 text-lg font-semibold border border-white/20"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90 h-14 text-lg font-semibold"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleReport}
                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 h-12"
              >
                <Flag className="h-5 w-5 mr-2" />
                Report Ad
              </Button>
            </div>

                {/* Seller Info Card */}
                {ad.sellerId && (
                  <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#39FF14] flex items-center justify-center text-black font-bold">
                      {ad.sellerId?.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                      <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                          <p className="text-white font-semibold truncate">
                          {ad.sellerId?.fullName || "Unknown"}
                        </p>
                        {ad.sellerId?.isVerified && (
                            <CheckCircle className="h-4 w-4 text-[#00FFA3] flex-shrink-0" />
                          )}
                        </div>
                        {ad.sellerId?.city && (
                          <p className="text-white/70 text-sm truncate">
                            {ad.sellerId.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </Card>
          </div>
        </div>

        {/* Google Ads */}
        <div className="mt-12 mb-8">
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
