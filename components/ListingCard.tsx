"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Star, Rocket } from "lucide-react";
import Image from "next/image";
import { VerifiedBadge } from "@/components/VerifiedBadge";

interface ListingCardProps {
  title: string;
  sport?: string;
  listingType?: string;
  city?: string;
  href: string;
  description?: string;
  userId?: {
    profileImage?: string;
    name?: string;
    fullName?: string;
    isVerified?: boolean;
  };
  createdAt?: string;
  listingData?: Record<string, unknown>; // For generating descriptive subtitles
  location?: Record<string, unknown>; // For location data
  isFeatured?: boolean;
  isBoosted?: boolean;
}

export function ListingCard({
  title,
  sport,
  listingType,
  city,
  href,
  description,
  userId,
  createdAt,
  listingData,
  location,
  isFeatured = false,
  isBoosted = false,
}: ListingCardProps) {
  const formatSport = (sportType?: string) => {
    if (!sportType) return "";
    return (
      sportType.charAt(0).toUpperCase() + sportType.slice(1).replace("_", " ")
    );
  };

  const formatListingType = (type?: string) => {
    if (!type) return "";
    const typeMap: Record<string, string> = {
      player: "Player",
      coach: "Coach",
      team: "Team",
      tournament: "Tournament",
      ground: "Ground",
      umpire: "Umpire",
      referee: "Referee",
      commentator: "Commentator",
      scorer: "Scorer",
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return diffSeconds <= 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
    }
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    }
    if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }
    if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }
    if (diffWeeks < 4) {
      return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
    }
    if (diffMonths < 12) {
      return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    }
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
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
    if (location?.address) return location.address as string;
    if (listingData?.location) return listingData.location as string;
    if (listingData?.address) return listingData.address as string;
    if (listingData?.area && listingData?.city)
      return `${listingData.area}, ${listingData.city}`;
    if (listingData?.city) return listingData.city as string;
    if (location?.city) return location.city as string;
    if (listingData?.region) return listingData.region as string;
    if (city) return city;
    return "";
  };

  const generateDescriptiveSubtitle = () => {
    if (!listingType || !listingData) return description || title;

    const userName = userId?.name || userId?.fullName || "Someone";
    const loc = getLocationString();
    const data = listingData;

    switch (listingType) {
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
          return `${userName} is looking for ${listingType} opportunities${
            loc ? ` in ${loc}` : ""
          }${experience ? ` (${experience})` : ""}`;
        }

        return `${userName} is an experienced ${listingType}${
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
        return description || title;
    }
  };

  const profilePicUrl =
    userId?.profileImage ||
    `https://via.placeholder.com/40?text=${(
      userId?.name?.[0] ||
      userId?.fullName?.[0] ||
      "U"
    ).toUpperCase()}`;
  const name = userId?.name || userId?.fullName || "Anonymous";

  return (
    <Link href={href}>
      <Card className="glass-card border-white/10 hover:border-[#00FFFF]/50 transition-all cursor-pointer group w-full relative">
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="h-3 w-3 fill-black" />
              Featured
            </Badge>
          </div>
        )}

        {/* Boost Badge - Show even if featured, positioned below featured badge */}
        {isBoosted && (
          <div className={`absolute ${isFeatured ? 'top-12 left-3' : 'top-3 left-3'} z-10`}>
            <Badge className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
              <Rocket className="h-3 w-3 fill-white" />
              Boosted
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          {/* Profile Row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={profilePicUrl}
                // alt={name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-white font-bold text-base truncate">{name}</p>
                {userId?.isVerified && <VerifiedBadge size="md" />}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {sport && (
                  <span className="text-[#00FFA3] font-bold text-sm capitalize">
                    {formatSport(sport)}
                  </span>
                )}
                {listingType && (
                  <span className="text-[#00FFA3] font-semibold text-sm">
                    ({formatListingType(listingType)})
                  </span>
                )}
                {city && (
                  <span className="text-white/60 text-sm">· 📍 {city}</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white text-base mb-4 line-clamp-3 leading-relaxed">
            {listingType && listingData
              ? generateDescriptiveSubtitle()
              : description || title}
          </p>

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-white/60 text-sm flex-1">
              {formatDate(createdAt)}
            </span>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-[#00FFA3] flex items-center justify-center hover:bg-[#00FFA3]/10 transition-colors">
                <MessageCircle className="h-5 w-5 text-[#00FFA3]" />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#00FFA3] flex items-center justify-center hover:bg-[#00FFA3]/10 transition-colors">
                <Phone className="h-5 w-5 text-[#00FFA3]" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
