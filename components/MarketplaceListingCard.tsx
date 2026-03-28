"use client";

import Link from "next/link";
import Image from "next/image";
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

  const imgUnoptimized =
    !!image &&
    image.startsWith("http") &&
    !image.includes("localhost");

  return (
    <Link href={href}>
      <Card className="glass-card border-white/10 hover:border-[#00FFFF]/50 transition-all cursor-pointer group relative w-full bg-transparent overflow-hidden">
        {isFeatured && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gradient-to-r from-[#00FFA3] to-[#00CFFF] text-black border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="h-3 w-3 fill-black" />
              Featured
            </Badge>
          </div>
        )}

        {isBoosted && (
          <div
            className={`absolute z-10 ${isFeatured ? "top-10 left-2" : "top-2 left-2"}`}
          >
            <Badge className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
              <Rocket className="h-3 w-3 fill-white" />
              Boosted
            </Badge>
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex gap-3 items-start">
            {/* Circular product image beside text (not full-width above) */}
            <div className="relative shrink-0">
              <div className="relative h-[88px] w-[88px] sm:h-[100px] sm:w-[100px] overflow-hidden rounded-full border border-white/15 bg-white/5 ring-2 ring-black/30">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 88px, 100px"
                    unoptimized={imgUnoptimized}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                    <span className="text-white/45 text-xs text-center px-2">
                      No image
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleWishlistClick}
                className="absolute bottom-0 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/80 shadow-md backdrop-blur-sm hover:bg-black/90 hover:scale-105 transition-all"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${
                    wishlisted
                      ? "fill-[#FF3B5C] text-[#FF3B5C]"
                      : "text-white/90"
                  }`}
                />
              </button>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-semibold text-white text-[15px] flex-1 line-clamp-2 group-hover:text-[#00FFFF] transition-colors leading-snug min-w-0">
                  {title}
                </h3>
                <span className="text-[#00FFA3] font-bold text-sm whitespace-nowrap shrink-0">
                  {priceDisplay}
                </span>
              </div>

              {location && (
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-white/60 flex-shrink-0" />
                  <span className="text-sm text-white/70 truncate">{location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
