import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
