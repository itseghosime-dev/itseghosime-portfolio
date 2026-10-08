import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { sanityClient } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";

type SitemapDocument = {
  _updatedAt: string | null;
  path: string;
};

const staticRoutes = ["/", "/about", "/work", "/lab", "/notes", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await sanityClient.fetch<{
      notes: SitemapDocument[];
      projects: SitemapDocument[];
      staticPages: SitemapDocument[];
    }>(SITEMAP_QUERY);

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => {
      const document = data.staticPages?.find((entry) => entry.path === path);
      return {
        changeFrequency: path === "/" ? "weekly" : "monthly",
        lastModified: document?._updatedAt
          ? new Date(document._updatedAt)
          : undefined,
        priority: path === "/" ? 1 : 0.8,
        url: absoluteUrl(path),
      };
    });

    const contentEntries: MetadataRoute.Sitemap = [
      ...(data.projects ?? []),
      ...(data.notes ?? []),
    ].map((document) => ({
      changeFrequency: "monthly",
      lastModified: document._updatedAt
        ? new Date(document._updatedAt)
        : undefined,
      priority: 0.7,
      url: absoluteUrl(document.path),
    }));

    return [...staticEntries, ...contentEntries];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticRoutes.map((path) => ({
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.8,
      url: absoluteUrl(path),
    }));
  }
}
