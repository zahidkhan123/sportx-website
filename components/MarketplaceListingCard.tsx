"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Star, Rocket } from "lucide-react";
import { useState } from "react";

interface MarketplaceListingCardProps {
  id: string;
  title: string;
  description?: string;
  /** Omitted or invalid when API returns no price — avoid crashing on toLocaleString */
  price?: number | null;
  image?: string;
  location?: string;
  category?: string;
  condition?: "New" | "Used";
  viewsCount?: number;
  isFeatured?: boolean;
  isBoosted?: boolean;
  isWishlisted?: boolean;
  href: string;
  status?: "active" | "sold" | "expired";
  onWishlistToggle?: (id: string) => void;
}

export function MarketplaceListingCard({
  id,
  title,
  description,
  price,
  image,
  location,
  category,
  condition,
  viewsCount,
  isFeatured = false,
  isBoosted = false,
  isWishlisted = false,
  href,
  status,
  onWishlistToggle,
}: MarketplaceListingCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const priceDisplay =
    typeof price === "number" && !Number.isNaN(price)
      ? `Rs ${price.toLocaleString()}`
      : "—";

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onWishlistToggle?.(id);
  };

  return (
    <Link href={href}>
      <Card className="glass-card border-white/10 hover:border-[#00FFFF]/50 transition-all cursor-pointer group overflow-hidden w-full bg-transparent">
        {/* Image Container - Airbnb style with rounded corners */}
        <div className="relative h-[240px] w-full overflow-hidden rounded-t-lg">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <span className="text-white/50 text-sm">No Image</span>
            </div>
          )}

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
            <div className={`absolute ${isFeatured ? "top-12 left-3" : "top-3 left-3"} z-10`}>
              <Badge className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
                <Rocket className="h-3 w-3 fill-white" />
                Boosted
              </Badge>
            </div>
          )}

          {/* Wishlist Button - Airbnb style */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-white transition-all shadow-md hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 ${
                wishlisted ? "fill-[#FF3B5C] text-[#FF3B5C]" : "text-gray-800"
              }`}
            />
          </button>
        </div>

        {/* Content - Airbnb style minimal design */}
        <CardContent className="p-4">
          {/* Title and Price - Airbnb style */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white text-[15px] flex-1 line-clamp-1 group-hover:text-[#00FFFF] transition-colors leading-tight truncate min-w-0">
              {title}
            </h3>
            <div className="flex items-baseline gap-1 flex-shrink-0">
              <span className="text-[#00FFA3] font-bold text-base whitespace-nowrap">
                {priceDisplay}
              </span>
            </div>
          </div>

          {/* Location - Airbnb style */}
          {location && (
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-3.5 w-3.5 text-white/60 flex-shrink-0" />
              <span className="text-sm text-white/70 truncate">{location}</span>
            </div>
          )}

          {/* Category and Condition - Airbnb style badges */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {category && (
              <Badge className="bg-white/10 text-white/90 border-white/20 text-xs px-2 py-0.5 font-medium">
                {category}
              </Badge>
            )}
            {condition && (
              <Badge
                className={`text-xs px-2 py-0.5 font-medium ${
                  condition === "New"
                    ? "bg-[#00FFA3]/20 text-[#00FFA3] border-[#00FFA3]/30"
                    : "bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30"
                }`}
              >
                {condition}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
