/**
 * Server-only fetch helpers for SEO (metadata, sitemap). Uses public GET endpoints; no auth.
 */

import { getSiteUrl } from "@/lib/seo";

export function getServerApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }
  return "https://sportxapi.playlio.co";
}

async function parseJson<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type ApiListing = Record<string, unknown> & {
  _id?: string;
  listingType?: string;
  title?: string;
  description?: string;
  sportType?: string;
  location?: { city?: string; state?: string; country?: string; address?: string };
  images?: Array<{ url?: string } | string>;
  pricing?: { amount?: number; currency?: string };
  data?: Record<string, unknown>;
  status?: string;
};

export async function fetchListingById(
  id: string,
  revalidateSeconds = 120
): Promise<ApiListing | null> {
  const base = getServerApiBaseUrl();
  const res = await fetch(`${base}/api/listings/${encodeURIComponent(id)}`, {
    next: { revalidate: revalidateSeconds },
    headers: { Accept: "application/json" },
  });
  const body = await parseJson<{ success?: boolean; data?: ApiListing }>(res);
  return body?.data ?? null;
}

export async function fetchListingsPage(params: {
  page?: number;
  limit?: number;
  sport?: string;
  type?: string;
  city?: string;
}): Promise<{ data: ApiListing[]; pagination?: { pages: number; page: number; total: number } }> {
  const base = getServerApiBaseUrl();
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.sport) sp.set("sport", params.sport);
  if (params.type) sp.set("type", params.type);
  if (params.city) sp.set("city", params.city);
  const res = await fetch(`${base}/api/listings?${sp.toString()}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
  const body = await parseJson<{
    data?: ApiListing[];
    pagination?: { pages: number; page: number; total: number };
  }>(res);
  return {
    data: body?.data ?? [],
    pagination: body?.pagination,
  };
}

export type BlogPostPayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  authorName?: string;
  publishedAt?: string;
};

export async function fetchBlogBySlug(
  slug: string
): Promise<BlogPostPayload | null> {
  const base = getServerApiBaseUrl();
  const res = await fetch(
    `${base}/api/blogs/slug/${encodeURIComponent(slug)}`,
    {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    }
  );
  const body = await parseJson<{ data?: BlogPostPayload }>(res);
  return body?.data ?? null;
}

export async function fetchPublishedBlogSlugs(
  maxPages = 5
): Promise<string[]> {
  const slugs: string[] = [];
  const base = getServerApiBaseUrl();
  for (let page = 1; page <= maxPages; page++) {
    const res = await fetch(
      `${base}/api/blogs?page=${page}&limit=50`,
      { next: { revalidate: 600 }, headers: { Accept: "application/json" } }
    );
    const body = await parseJson<{
      data?: Array<{ slug?: string }>;
    }>(res);
    const batch = body?.data ?? [];
    if (batch.length === 0) break;
    for (const p of batch) {
      if (p.slug) slugs.push(p.slug);
    }
    if (batch.length < 50) break;
  }
  return slugs;
}

export type MarketplaceAdPayload = {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  location?: string;
  category?: string;
  condition?: string;
};

export async function fetchMarketplaceById(
  id: string
): Promise<MarketplaceAdPayload | null> {
  const base = getServerApiBaseUrl();
  const res = await fetch(`${base}/api/marketplace/${encodeURIComponent(id)}`, {
    next: { revalidate: 120 },
    headers: { Accept: "application/json" },
  });
  const body = await parseJson<{ data?: MarketplaceAdPayload }>(res);
  return body?.data ?? null;
}

/** Absolute URL for sitemap entries */
export function absoluteUrl(pathname: string): string {
  const site = getSiteUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${site}${path}`;
}
