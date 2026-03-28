/**
 * Central SEO helpers for SportX360 (titles, canonicals, hrefs, JSON-LD).
 * Client-safe: only use getSiteUrl, getListingHref, formatSportLabel in client components.
 */

import type { Metadata } from "next";

/** Public site origin for canonicals, OG URLs, and sitemap (set in production env). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  return "https://sportx360.com";
}

const DEFAULT_OG = "/icon.svg";

export type ListingLike = {
  _id?: string;
  listingType?: string;
  title?: string;
  description?: string;
  sportType?: string;
  location?: { city?: string; state?: string; country?: string; address?: string };
  images?: Array<{ url?: string } | string>;
  pricing?: { amount?: number; currency?: string };
  data?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

/** SEO-friendly path for a listing (keyword-rich URLs for core types). */
export function getListingHref(listing: {
  _id?: string;
  listingType?: string;
}): string {
  const id = String(listing._id ?? "");
  if (!id) return "/sports";
  switch (listing.listingType) {
    case "player":
      return `/player/${id}`;
    case "team":
      return `/team/${id}`;
    case "ground":
      return `/ground/${id}`;
    case "tournament":
      return `/tournament/${id}`;
    default:
      return `/sports/${id}`;
  }
}

export function formatSportLabel(sport?: string): string {
  if (!sport) return "";
  return sport.charAt(0).toUpperCase() + sport.slice(1).replace(/_/g, " ");
}

function listingLocationLine(listing: ListingLike): string {
  const loc = listing.location;
  if (loc?.city) return loc.city;
  const d = listing.data;
  if (d?.city && typeof d.city === "string") return d.city;
  if (d?.location && typeof d.location === "string") return d.location;
  return "";
}

/** Canonical path (pathname + query stripped) for a listing detail page. */
export function getListingCanonicalPath(listing: ListingLike): string {
  return getListingHref(listing);
}

export function buildListingOpenGraph(
  listing: ListingLike,
  canonicalPath: string
): NonNullable<Metadata["openGraph"]> {
  const site = getSiteUrl();
  const title = listing.title || "Listing";
  const desc =
    (listing.description && listing.description.slice(0, 160)) ||
    `${formatSportLabel(listing.sportType)} ${listing.listingType || "listing"} on SportX360 — players, teams, and grounds in Pakistan.`;
  const img =
    (listing.images?.[0] &&
      (typeof listing.images[0] === "string"
        ? listing.images[0]
        : listing.images[0]?.url)) ||
    `${site}${DEFAULT_OG}`;

  return {
    type: "website",
    url: `${site}${canonicalPath}`,
    title: `${title} | SportX360`,
    description: desc,
    siteName: "SportX360",
    locale: "en_PK",
    images: [{ url: img }],
  };
}

export function buildListingMetadata(listing: ListingLike | null): Metadata {
  if (!listing?._id) {
    return {
      title: "Listing | SportX360",
      description: "Sports listings on SportX360.",
    };
  }

  const path = getListingCanonicalPath(listing);
  const site = getSiteUrl();
  const url = `${site}${path}`;
  const loc = listingLocationLine(listing);
  const sport = formatSportLabel(listing.sportType);
  const typeLabel = listing.listingType
    ? formatSportLabel(listing.listingType)
    : "Listing";

  const title = `${listing.title || typeLabel} | ${sport} ${typeLabel} | SportX360`;
  const description =
    (listing.description && listing.description.slice(0, 155)) ||
    `Find ${sport.toLowerCase()} ${(listing.listingType || "listings").replace(/_/g, " ")} on SportX360.${loc ? ` Based in ${loc}, Pakistan.` : " Connect with players, teams, tournaments, and grounds across Pakistan and globally."}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: buildListingOpenGraph(listing, path),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        (listing.images?.[0] &&
          (typeof listing.images[0] === "string"
            ? listing.images[0]
            : listing.images[0]?.url)) ||
          `${site}${DEFAULT_OG}`,
      ],
    },
  };
}

/** JSON-LD for listing detail (SportsEvent for tournaments, LocalBusiness for grounds, generic SportsActivity for others). */
export function buildListingJsonLd(listing: ListingLike): Record<string, unknown> {
  const site = getSiteUrl();
  const path = getListingCanonicalPath(listing);
  const url = `${site}${path}`;
  const img =
    listing.images?.[0] &&
    (typeof listing.images[0] === "string"
      ? listing.images[0]
      : listing.images[0]?.url);

  const base = {
    "@context": "https://schema.org",
    name: listing.title,
    description: listing.description || undefined,
    url,
    image: img || undefined,
  };

  if (listing.listingType === "tournament") {
    const data = listing.data || {};
    const start =
      (data.startDate as string) ||
      (data.date as string) ||
      listing.createdAt;
    return {
      ...base,
      "@type": "SportsEvent",
      sport: formatSportLabel(listing.sportType),
      startDate: start || undefined,
      location: listing.location?.address
        ? {
            "@type": "Place",
            name: listing.location.city || listing.location.address,
            address: listing.location.address,
          }
        : listing.location?.city
          ? {
              "@type": "Place",
              name: listing.location.city,
              address: {
                "@type": "PostalAddress",
                addressLocality: listing.location.city,
                addressCountry: listing.location.country || "PK",
              },
            }
          : undefined,
    };
  }

  if (listing.listingType === "ground") {
    return {
      ...base,
      "@type": "LocalBusiness",
      "@id": url,
      priceRange: listing.pricing?.amount
        ? `${listing.pricing.currency || "PKR"} ${listing.pricing.amount}`
        : undefined,
      address: listing.location?.city
        ? {
            "@type": "PostalAddress",
            addressLocality: listing.location.city,
            addressRegion: listing.location.state,
            addressCountry: listing.location.country || "PK",
            streetAddress: listing.location.address,
          }
        : undefined,
    };
  }

  return {
    ...base,
    "@type": "SportsActivity",
    sport: formatSportLabel(listing.sportType),
  };
}

export function buildBlogPostMetadata(
  post: {
    title?: string;
    excerpt?: string;
    slug?: string;
    coverImageUrl?: string;
    authorName?: string;
    publishedAt?: string;
  } | null
): Metadata {
  if (!post?.slug) {
    return { title: "Blog | SportX360" };
  }
  const site = getSiteUrl();
  const path = `/blogs/${post.slug}`;
  const url = `${site}${path}`;
  const title = `${post.title || "Article"} | SportX360 Blog`;
  const description =
    (post.excerpt && post.excerpt.slice(0, 160)) ||
    "Sports news, tips, and updates from SportX360 — players, teams, and tournaments in Pakistan.";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "SportX360",
      locale: "en_PK",
      publishedTime: post.publishedAt,
      authors: post.authorName ? [post.authorName] : undefined,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export function buildBlogArticleJsonLd(post: {
  title?: string;
  description?: string;
  excerpt?: string;
  slug?: string;
  coverImageUrl?: string;
  authorName?: string;
  publishedAt?: string;
}): Record<string, unknown> {
  const site = getSiteUrl();
  const path = `/blogs/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.description,
    image: post.coverImageUrl,
    datePublished: post.publishedAt,
    author: post.authorName
      ? { "@type": "Person", name: post.authorName }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "SportX360",
      url: site,
    },
    mainEntityOfPage: `${site}${path}`,
  };
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SportX360",
    url: site,
    description:
      "Sports marketplace for players, teams, tournaments, grounds, and equipment in Pakistan and worldwide.",
    sameAs: [
      "https://play.google.com/store/apps/details?id=com.sportx360",
      "https://apps.apple.com/pk/app/sportx360/id6759158349",
    ],
  };
}

export function buildMarketplaceAdMetadata(
  ad: {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    category?: string;
    images?: string[];
    _id?: string;
  } | null
): Metadata {
  if (!ad?._id) {
    return {
      title: "Equipment | SportX360",
      description: "Buy and sell sports equipment in Pakistan on SportX360.",
    };
  }
  const site = getSiteUrl();
  const path = `/marketplace/${ad._id}`;
  const url = `${site}${path}`;
  const title = `${ad.title || "Sports equipment"} | Buy in Pakistan | SportX360`;
  const description =
    (ad.description && ad.description.slice(0, 155)) ||
    `Buy sports equipment${ad.category ? ` — ${ad.category}` : ""} on SportX360.${ad.location ? ` ${ad.location}.` : " New and used gear across Pakistan."}`;

  const img = ad.images?.[0] || `${site}${DEFAULT_OG}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "SportX360",
      locale: "en_PK",
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}

export function buildProductJsonLd(ad: {
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  location?: string;
  _id?: string;
}): Record<string, unknown> {
  const site = getSiteUrl();
  const id = String(ad._id ?? "");
  const url = `${site}/marketplace/${id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ad.title,
    description: ad.description,
    image: ad.images?.[0],
    offers: {
      "@type": "Offer",
      price: ad.price,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      url,
    },
    ...(ad.location
      ? {
          areaServed: {
            "@type": "Place",
            name: ad.location,
          },
        }
      : {}),
  };
}
