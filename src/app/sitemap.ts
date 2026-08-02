import type { MetadataRoute } from "next";
import { SITEMAP_ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITEMAP_ROUTES.map((route) => ({
    ...route,
    lastModified,
  }));
}
