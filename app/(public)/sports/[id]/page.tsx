"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listingsAPI, chatAPI } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GoogleAds from "@/components/GoogleAds";
import {
  MapPin,
  Eye,
  Heart,
  Star,
  MessageCircle,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => listingsAPI.getById(listingId),
  });

  const listing = data?.data;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSport = (sportType?: string) => {
    if (!sportType) return "";
    return (
      sportType.charAt(0).toUpperCase() + sportType.slice(1).replace("_", " ")
    );
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} (${dayName})`;
  };

  const getLocationString = () => {
    if (!listing) return "";
    const location = listing.location || {};
    const data = listing.data || {};
    if (location.address) return location.address as string;
    if (data.location) return data.location as string;
    if (data.address) return data.address as string;
    if (data.area && data.city) return `${data.area}, ${data.city}`;
    if (data.city) return data.city as string;
    if (location.city) return location.city as string;
    if (data.region) return data.region as string;
    if (listing.city) return listing.city as string;
    return "";
  };

  const generateDescriptiveSubtitle = () => {
    if (!listing || !listing.listingType || !listing.data) {
      return listing?.description || listing?.title || "";
    }

    const user = listing.userId || {};
    const userName = (user.name || user.fullName || "Someone") as string;
    const loc = getLocationString();
    const data = listing.data;

    switch (listing.listingType) {
      case "player": {
        const playerName = (data.playerName || data.name || userName) as string;
        const position = (data.position ||
          data.preferredPosition ||
          data.role ||
          "Player") as string;
        const bowlingStyle = (data.bowlingStyle ||
          data.bowlingType ||
          "") as string;
        const battingStyle = (data.battingStyle ||
          data.battingType ||
          "") as string;
        let positionStr = position;

        if (
          bowlingStyle &&
          (position.includes("Bowler") || position === "Bowler")
        ) {
          positionStr = `${position} (${bowlingStyle})`;
        } else if (
          battingStyle &&
          (position.includes("Batsman") || position === "Batsman")
        ) {
          positionStr = `${position} (${battingStyle})`;
        } else if (
          bowlingStyle &&
          (position === "All-rounder" || position.includes("All-rounder"))
        ) {
          positionStr = `All-rounder (${bowlingStyle})`;
        }

        const lookingForTeam =
          data.lookingForTeam !== undefined
            ? data.lookingForTeam
            : data.available !== undefined
            ? !data.available
            : true;

        if (lookingForTeam) {
          return `${playerName} is looking for a Team to join as a ${positionStr}${
            loc ? ` in ${loc}` : ""
          }`;
        }
        return `${playerName} is available as a ${positionStr}${
          loc ? ` in ${loc}` : ""
        }`;
      }
      case "team": {
        const teamName = (data.teamName || data.name || "their team") as string;
        const lookingForOpponent = (data.lookingForOpponent ||
          false) as boolean;
        const lookingForPlayers =
          data.lookingForPlayers !== undefined ? data.lookingForPlayers : true;
        const position = (data.lookingForPosition ||
          data.position ||
          data.lookingFor ||
          "players") as string;

        if (lookingForOpponent) {
          const matchDate =
            data.matchDate || data.date
              ? formatDateForDisplay((data.matchDate || data.date) as string)
              : "";
          return `${userName}'s team (${teamName}) is looking for an opponent to play a Match${
            loc ? ` in ${loc}` : ""
          }${matchDate ? ` on ${matchDate}` : ""}`;
        }

        if (lookingForPlayers && position && position !== "players") {
          const bowlingStyle = (data.bowlingStyle || "") as string;
          const battingStyle = (data.battingStyle || "") as string;
          let positionStr = position;

          if (
            bowlingStyle &&
            (position.includes("Bowler") || position === "Bowler")
          ) {
            positionStr = `${position} (${bowlingStyle})`;
          } else if (
            battingStyle &&
            (position.includes("Batsman") || position === "Batsman")
          ) {
            positionStr = `${position} (${battingStyle})`;
          } else if (bowlingStyle && position === "All-rounder") {
            positionStr = `All-rounder (${bowlingStyle})`;
          }

          return `${userName}'s team (${teamName}) is looking for a ${positionStr} to join his team${
            loc ? ` in ${loc}` : ""
          }`;
        }

        return `${userName}'s team (${teamName})${loc ? ` in ${loc}` : ""}`;
      }
      case "tournament": {
        const tournamentName = (data.tournamentName ||
          data.name ||
          "Tournament") as string;
        const startDate =
          data.startDate || data.date
            ? formatDateForDisplay((data.startDate || data.date) as string)
            : "";
        const playingDays = (data.playingDays ||
          data.availableDays ||
          data.playingOn ||
          "") as string;

        if (data.lookingForUmpire !== undefined && data.lookingForUmpire) {
          return `${userName} is looking for an Umpire${
            loc ? ` on ${loc}` : ""
          } for Tournament${startDate ? ` on ${startDate}` : ""}`;
        }

        if (data.lookingForScorer !== undefined && data.lookingForScorer) {
          return `${userName} is looking for a Scorer${
            loc ? ` on ${loc}` : ""
          } for Tournament${startDate ? ` on ${startDate}` : ""}`;
        }

        if (data.lookingForTeam !== undefined && data.lookingForTeam) {
          return `${userName} is an Organizer and is looking for a Team for their Tournament${
            loc ? ` in ${loc}` : ""
          }${
            startDate
              ? `. The tournament begins on ${startDate}${
                  playingDays ? ` it will be played on ${playingDays}` : ""
                }`
              : ""
          }`;
        }

        return `${userName} is organizing ${tournamentName}${
          loc ? ` in ${loc}` : ""
        }${startDate ? ` starting ${startDate}` : ""}`;
      }
      case "ground": {
        const groundName = (data.groundName ||
          data.name ||
          "a ground") as string;
        const lookingForBooking =
          data.lookingForBooking !== undefined ? data.lookingForBooking : true;
        const bookingDate = data.bookingDate
          ? formatDateForDisplay(data.bookingDate as string)
          : "";

        if (lookingForBooking) {
          return `${userName} is looking for ${groundName} to play${
            loc ? ` in ${loc}` : ""
          }${bookingDate ? ` on ${bookingDate}` : ""}`;
        }

        return `${groundName} is available${loc ? ` in ${loc}` : ""}`;
      }
      case "coach": {
        const coachName = (data.coachName || data.name || userName) as string;
        const coachingType = (data.coachingType ||
          data.serviceType ||
          "Coaching") as string;
        const availableDays = (data.availableDays ||
          data.playingDays ||
          "") as string;
        const experience = data.experience
          ? ` with ${data.experience} years experience`
          : "";

        const coachingTypeStr = Array.isArray(coachingType)
          ? coachingType.join(", ")
          : coachingType;

        return `${coachName} is offering ${coachingTypeStr}${
          loc ? ` in ${loc}` : ""
        }${experience}${availableDays ? ` (${availableDays})` : ""}`;
      }
      case "umpire":
      case "referee": {
        const lookingForWork =
          data.lookingForWork !== undefined ? data.lookingForWork : true;
        const experience = data.experience
          ? `${data.experience} years experience`
          : "";

        if (lookingForWork) {
          return `${userName} is looking for ${
            listing.listingType
          } opportunities${loc ? ` in ${loc}` : ""}${
            experience ? ` (${experience})` : ""
          }`;
        }

        return `${userName} is an experienced ${listing.listingType}${
          loc ? ` in ${loc}` : ""
        }${experience ? ` (${experience})` : ""}`;
      }
      case "scorer": {
        const lookingForWork =
          data.lookingForWork !== undefined ? data.lookingForWork : true;
        const experience = data.experience
          ? `${data.experience} years experience`
          : "";

        if (lookingForWork) {
          return `${userName} is looking for Scorer opportunities${
            loc ? ` in ${loc}` : ""
          }${experience ? ` (${experience})` : ""}`;
        }

        return `${userName} is an experienced Scorer${loc ? ` in ${loc}` : ""}${
          experience ? ` (${experience})` : ""
        }`;
      }
      case "commentator": {
        const lookingForWork =
          data.lookingForWork !== undefined ? data.lookingForWork : true;
        const experience = data.experience
          ? `${data.experience} years experience`
          : "";

        if (lookingForWork) {
          return `${userName} is looking for Commentator opportunities${
            loc ? ` in ${loc}` : ""
          }${experience ? ` (${experience})` : ""}`;
        }

        return `${userName} is an experienced Commentator${
          loc ? ` in ${loc}` : ""
        }${experience ? ` (${experience})` : ""}`;
      }
      default:
        return listing.description || listing.title || "";
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

  if (!listing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Listing not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const user = listing.userId || {};

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
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
          <h1 className="text-lg font-bold text-white">Post Details</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            {listing.images && listing.images.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={
                      listing.images[currentImageIndex]?.url ||
                      listing.images[currentImageIndex]
                    }
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Thumbnail Scroll */}
                {listing.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {listing.images.map(
                      (image: { url?: string } | string, index: number) => {
                        const imageUrl =
                          typeof image === "string" ? image : image?.url || "";
                        return (
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
                              src={imageUrl}
                              alt={`${listing.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                <p className="text-white/50">No images</p>
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {listing.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {listing.sportType && (
                  <Badge className="bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black border-0 px-3 py-1.5 font-bold">
                    {formatSport(listing.sportType)}
                  </Badge>
                )}
                {listing.listingType && (
                  <Badge className="bg-white/10 text-white border-white/20">
                    {formatSport(listing.listingType)}
                  </Badge>
                )}
              </div>

              {/* Descriptive Subtitle */}
              <p className="text-white/80 text-lg mb-4 leading-relaxed">
                {generateDescriptiveSubtitle()}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 py-4 border-y border-white/10 mb-4">
                <div className="text-center">
                  <Eye className="h-5 w-5 text-[#00FFA3] mx-auto mb-1" />
                  <p className="text-white font-bold">{listing.views || 0}</p>
                  <p className="text-xs text-white/70">Views</p>
                </div>
                <div className="text-center">
                  <Heart className="h-5 w-5 text-[#00FFA3] mx-auto mb-1" />
                  <p className="text-white font-bold">
                    {listing.favorites?.length || 0}
                  </p>
                  <p className="text-xs text-white/70">Favorites</p>
                </div>
                <div className="text-center">
                  <Star className="h-5 w-5 text-[#00FFA3] mx-auto mb-1" />
                  <p className="text-white font-bold">
                    {listing.rating?.toFixed(1) || "0.0"}
                  </p>
                  <p className="text-xs text-white/70">Rating</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-5 w-5 text-[#00FFA3] mx-auto mb-1" />
                  <p className="text-white font-bold">
                    {listing.reviews?.length || 0}
                  </p>
                  <p className="text-xs text-white/70">Reviews</p>
                </div>
              </div>
            </div>

            {/* Specific Details */}
            {listing.data && (
              <Card className="glass-card border-white/10">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {listing.listingType === "player" && "Player Details"}
                    {listing.listingType === "coach" && "Coach Details"}
                    {listing.listingType === "team" && "Team Details"}
                    {listing.listingType === "tournament" &&
                      "Tournament Details"}
                    {listing.listingType === "ground" && "Ground Details"}
                    {!listing.listingType && "Details"}
                  </h3>
                  <div className="space-y-0">
                    {listing.data.location &&
                      renderDetailRow(
                        <MapPin className="h-5 w-5" />,
                        "Location",
                        listing.data.location
                      )}
                    {listing.data.city &&
                      renderDetailRow(
                        <MapPin className="h-5 w-5" />,
                        "City",
                        listing.data.city
                      )}
                    {listing.data.matchDate &&
                      renderDetailRow(
                        <Calendar className="h-5 w-5" />,
                        "Match Date",
                        formatDate(listing.data.matchDate)
                      )}
                    {listing.data.startDate &&
                      renderDetailRow(
                        <Calendar className="h-5 w-5" />,
                        "Start Date",
                        formatDate(listing.data.startDate)
                      )}
                    {listing.data.endDate &&
                      renderDetailRow(
                        <Calendar className="h-5 w-5" />,
                        "End Date",
                        formatDate(listing.data.endDate)
                      )}
                    {listing.data.price &&
                      renderDetailRow(
                        <span className="text-[#00FFA3]">$</span>,
                        "Price",
                        `$${listing.data.price}`
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posted By */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">Posted By</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#39FF14] flex items-center justify-center text-black font-bold text-lg">
                    {user.fullName?.charAt(0).toUpperCase() ||
                      user.name?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">
                        {user.fullName || user.name || "Unknown User"}
                      </p>
                      {user.isVerified && (
                        <CheckCircle className="h-4 w-4 text-[#00FFA3]" />
                      )}
                    </div>
                    {/* <p className="text-white/70 text-sm">
                      {user.email || "No email provided"}
                    </p> */}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/profile/${user._id || listing.userId}`)
                    }
                    className="text-white hover:text-[#00FFFF]"
                  >
                    View →
                  </Button>
                </div>
                {currentUser &&
                  (user._id || listing.userId)?.toString() !==
                    (currentUser._id || currentUser.id)?.toString() && (
                    <Button
                      onClick={async () => {
                        setChatLoading(true);
                        try {
                          const res = await chatAPI.getOrCreateChat(
                            "LISTING",
                            listingId
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
                      {chatLoading ? "Opening..." : "Chat with owner"}
                    </Button>
                  )}
              </CardContent>
            </Card>

            {/* Post Information */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">
                  Post Information
                </h3>
                <div className="space-y-0">
                  {renderDetailRow(
                    <Calendar className="h-5 w-5" />,
                    "Created",
                    formatDate(listing.createdAt)
                  )}
                  {renderDetailRow(
                    <Clock className="h-5 w-5" />,
                    "Last Updated",
                    formatDate(listing.updatedAt)
                  )}
                  {renderDetailRow(
                    <CheckCircle className="h-5 w-5" />,
                    "Status",
                    listing.status?.toUpperCase() || "ACTIVE"
                  )}
                </div>
              </CardContent>
            </Card>
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
