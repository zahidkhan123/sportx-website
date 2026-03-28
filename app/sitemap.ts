import type { MetadataRoute } from "next";
import { fetchListingsPage, fetchPublishedBlogSlugs } from "@/lib/server-api";
import { DISCOVER_SEO_SLUGS } from "@/lib/seo-location";
import { getListingHref, getSiteUrl } from "@/lib/seo";

/**
 * Dynamic sitemap: static marketing URLs, discover landings, blog posts, and listing detail URLs.
 * Listing pages are capped to avoid oversized XML if the catalog grows; raise limits as needed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = [
    "/",
    "/home",
    "/sports",
    "/players",
    "/teams",
    "/grounds",
    "/tournaments",
    "/equipment",
    "/marketplace",
    "/blogs",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/packages",
    "/verification",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" || path === "/home" ? 1 : 0.85,
  }));

  for (const slug of DISCOVER_SEO_SLUGS) {
    entries.push({
      url: `${base}/discover/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  try {
    const blogSlugs = await fetchPublishedBlogSlugs(8);
    for (const slug of blogSlugs) {
      entries.push({
        url: `${base}/blogs/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }
  } catch {
    /* API unavailable at build — skip blog URLs */
  }

  try {
    let page = 1;
    const maxPages = 20;
    while (page <= maxPages) {
      const { data, pagination } = await fetchListingsPage({
        page,
        limit: 100,
      });
      for (const row of data) {
        const path = getListingHref({
          _id: String(row._id),
          listingType: row.listingType as string,
        });
        entries.push({
          url: `${base}${path}`,
          lastModified: now,
          changeFrequency: "daily",
          priority: 0.55,
        });
      }
      if (!pagination || page >= (pagination.pages ?? 1)) break;
      page += 1;
    }
  } catch {
    /* skip listings if API down */
  }

  return entries;
}
