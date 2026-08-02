import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW_ROUTES, SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...ROBOTS_DISALLOW_ROUTES],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
