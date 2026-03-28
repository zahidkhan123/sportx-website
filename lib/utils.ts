import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Marketplace list endpoints may inject native-ad placeholders (`insertNativeAds` on the API).
 * Those entries are not real products — strip them so grids only show sellable items.
 */
export function filterRealMarketplaceItems<T extends Record<string, unknown>>(
  items: T[] | undefined | null
): T[] {
  if (!Array.isArray(items) || items.length === 0) return []
  return items.filter((item) => {
    if (item.isNativeAd === true) return false
    if (item.adType === "native") return false
    const id = item._id
    if (typeof id === "string" && id.startsWith("native-ad-")) return false
    return true
  })
}

/** Short location/subtitle for listing mini cards (matches mobile DashboardHomeScreen). */
export function getListingLocationSubtitle(listing: Record<string, unknown>): string {
  const location = (listing.location as Record<string, unknown>) || {}
  const data = (listing.data as Record<string, unknown>) || {}
  if (location.address) return String(location.address)
  if (data.location) return String(data.location)
  if (data.address) return String(data.address)
  if (data.area && data.city) return `${data.area}, ${data.city}`
  if (data.city) return String(data.city)
  if (location.city) return String(location.city)
  if (data.region) return String(data.region)
  if (listing.region) return String(listing.region)
  return "Nearby"
}
