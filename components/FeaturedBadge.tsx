"use client";

import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  type FeaturedTierId,
  tierMetaForApi,
} from "@/constants/featuredTiers.constants";

/** Maps design-token strings from FEATURED_TIERS to Tailwind gradients. */
const TIER_GRADIENT: Record<
  "featured" | "promoted",
  string
> = {
  featured: "from-amber-500 to-yellow-200 text-black",
  promoted: "from-slate-500 to-slate-400 text-white",
};

export function FeaturedBadge({ tier }: { tier: FeaturedTierId }) {
  if (tier !== "featured" && tier !== "promoted") return null;
  const meta = tierMetaForApi(tier);
  if (!meta) return null;
  const tw = TIER_GRADIENT[tier];
  return (
    <Badge
      title={meta.description}
      className={`bg-gradient-to-r ${tw} border-0 px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-lg`}
    >
      <Star className={`h-3 w-3 ${tier === "featured" ? "fill-black" : "fill-white"}`} />
      {meta.label}
    </Badge>
  );
}
