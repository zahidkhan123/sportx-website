import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-otp",
        "/interests",
        "/complete-profile",
        "/chats",
        "/create-listing",
        "/add-listing",
        "/profile",
        "/my-listings",
        "/my-credits",
      ],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
