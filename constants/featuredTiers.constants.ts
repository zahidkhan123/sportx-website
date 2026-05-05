/**
 * Display metadata for parallel monetization tiers (IAP vs rewards).
 * Mirror of backend/src/constants/featuredTiers.constants.ts — keep keys in sync.
 */
export const FEATURED_TIERS = {
  FEATURED: {
    id: "featured" as const,
    label: "Featured",
    source: "iap" as const,
    badgeColor: "#gold-value",
    description: "Premium placement — stays featured for 30 days",
  },
  PROMOTED: {
    id: "promoted" as const,
    label: "Promoted",
    source: "rewards" as const,
    badgeColor: "#secondary-color",
    description: "Promoted placement from rewards",
  },
} as const;

export type FeaturedTierId = "featured" | "promoted" | null;

export function tierMetaForApi(tier: FeaturedTierId) {
  if (tier === "featured") return FEATURED_TIERS.FEATURED;
  if (tier === "promoted") return FEATURED_TIERS.PROMOTED;
  return null;
}

export function displayBadgeForTier(tier: FeaturedTierId): {
  label: string;
  variant: "featured" | "promoted";
} | null {
  if (tier === "featured") {
    return { label: FEATURED_TIERS.FEATURED.label, variant: "featured" };
  }
  if (tier === "promoted") {
    return { label: FEATURED_TIERS.PROMOTED.label, variant: "promoted" };
  }
  return null;
}

export function resolveListingFeaturedTier(listing: {
  featuredTier?: FeaturedTierId;
  isFeatured?: boolean;
}): FeaturedTierId {
  if (listing.featuredTier === "featured" || listing.featuredTier === "promoted") {
    return listing.featuredTier;
  }
  if (listing.isFeatured) return "featured";
  return null;
}

export function resolveMarketplaceFeaturedTier(ad: {
  featuredTier?: FeaturedTierId;
  isFeatured?: boolean;
}): FeaturedTierId {
  if (ad.featuredTier === "featured" || ad.featuredTier === "promoted") {
    return ad.featuredTier;
  }
  if (ad.isFeatured) return "featured";
  return null;
}
