import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Everything but the API routes, which aren't pages; and where the sitemap is, on www. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
