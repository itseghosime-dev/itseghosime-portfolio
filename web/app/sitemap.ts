import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { sanityClient } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";

type SitemapDocument = {
  _updatedAt: string;
  path: string;
};

const staticRoutes = ["/", "/about", "/work", "/lab", "/notes", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
    url: absoluteUrl(path),
  }));

  try {
    const data = await sanityClient.fetch<{
      notes: SitemapDocument[];
      projects: SitemapDocument[];
    }>(SITEMAP_QUERY);

    const contentEntries: MetadataRoute.Sitemap = [
      ...(data.projects ?? []),
      ...(data.notes ?? []),
    ].map((document) => ({
      changeFrequency: "monthly",
      lastModified: new Date(document._updatedAt),
      priority: 0.7,
      url: absoluteUrl(document.path),
    }));

    return [...staticEntries, ...contentEntries];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticEntries;
  }
}
