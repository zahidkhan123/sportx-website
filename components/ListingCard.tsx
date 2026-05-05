"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Rocket } from "lucide-react";
import Image from "next/image";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { generateDescriptiveSubtitle as buildListingSubtitle } from "@/lib/listingDescriptiveSubtitle";
import { FeaturedBadge } from "@/components/FeaturedBadge";
import {
  type FeaturedTierId,
  resolveListingFeaturedTier,
} from "@/constants/featuredTiers.constants";

export type ListingImageEntry = { url?: string } | string;

function firstListingImageUrl(
  images?: ListingImageEntry[] | null
): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  if (typeof first === "string" && first.trim()) return first;
  if (first && typeof first === "object" && typeof first.url === "string" && first.url.trim())
    return first.url;
  return null;
}

interface ListingCardProps {
  title: string;
  sport?: string;
  listingType?: string;
  city?: string;
  href: string;
  description?: string;
  /** Post photos from API — shown in a circle beside text (fallback: profile avatar). */
  images?: ListingImageEntry[] | null;
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
  /** From API — preferred over isFeatured for IAP vs rewards tier */
  featuredTier?: FeaturedTierId;
  isBoosted?: boolean;
}

export function ListingCard({
  title,
  sport,
  listingType,
  city,
  href,
  description,
  images,
  userId,
  createdAt,
  listingData,
  location,
  isFeatured = false,
  featuredTier: featuredTierProp,
  isBoosted = false,
}: ListingCardProps) {
  const placementTier = resolveListingFeaturedTier({
    featuredTier: featuredTierProp,
    isFeatured,
  });
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

  /** Same sentences as SportsHub `utils/listingDescriptiveSubtitle.js` (intent + sport type). */
  const cardSubtitle =
    listingType && listingData != null
      ? buildListingSubtitle({
          listingType,
          data: listingData,
          userId: userId ?? {},
          location: location ?? {},
          description,
          title,
        } as Record<string, unknown>)
      : description || title;

  const name = userId?.name || userId?.fullName || "Anonymous";
  const profilePicUrl =
    userId?.profileImage ||
    `https://via.placeholder.com/40?text=${(
      userId?.name?.[0] ||
      userId?.fullName?.[0] ||
      "U"
    ).toUpperCase()}`;
  const listingPhotoUrl = firstListingImageUrl(images ?? null);
  const circleImageSrc = listingPhotoUrl || profilePicUrl;
  const circleImageAlt = listingPhotoUrl ? title : name;

  const imgUnoptimized =
    typeof circleImageSrc === "string" &&
    circleImageSrc.startsWith("http") &&
    !circleImageSrc.includes("localhost");

  return (
    <Link href={href}>
      <Card className="glass-card border-white/10 hover:border-[#00FFFF]/50 transition-all cursor-pointer group w-full relative">
        {placementTier && (
          <div className="absolute top-3 left-3 z-10">
            <FeaturedBadge tier={placementTier} />
          </div>
        )}

        {/* Boost Badge - Show even if featured, positioned below featured badge */}
        {isBoosted && (
          <div className={`absolute ${placementTier ? 'top-12 left-3' : 'top-3 left-3'} z-10`}>
            <Badge className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
              <Rocket className="h-3 w-3 fill-white" />
              Boosted
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          {/* Listing photo in circle + meta (no full-width image above text) */}
          <div className="flex items-start gap-4 mb-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/5 ring-2 ring-black/20">
              <Image
                src={circleImageSrc as string}
                alt={circleImageAlt}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized={imgUnoptimized}
              />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
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
            {cardSubtitle}
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
