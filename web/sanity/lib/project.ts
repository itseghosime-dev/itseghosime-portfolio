import type { PROJECT_PAGE_QUERY_RESULT } from "@/sanity.types";

import { sanityFetch } from "./live";
import {
  PROJECT_METADATA_QUERY,
  PROJECT_PAGE_QUERY,
  PROJECT_SLUGS_QUERY,
} from "./queries";

export async function getProjectPage(
  slug: string,
): Promise<PROJECT_PAGE_QUERY_RESULT> {
  const { data } = await sanityFetch({
    params: { slug },
    perspective: "published",
    query: PROJECT_PAGE_QUERY,
    stega: false,
  });

  return data;
}

export async function getProjectMetadata(slug: string) {
  const { data } = await sanityFetch({
    params: { slug },
    perspective: "published",
    query: PROJECT_METADATA_QUERY,
    stega: false,
  });

  return data;
}

export async function getProjectSlugs() {
  const { data } = await sanityFetch({
    perspective: "published",
    query: PROJECT_SLUGS_QUERY,
    stega: false,
  });

  return data.flatMap((item) => (item.slug ? [{ slug: item.slug }] : []));
}

export function getNextProject(
  projectId: string,
  projects: PROJECT_PAGE_QUERY_RESULT["projectNavigation"],
) {
  const currentIndex = projects.findIndex(
    (project) => project._id === projectId,
  );
  if (currentIndex < 0 || projects.length < 2) return null;
  return projects[(currentIndex + 1) % projects.length] ?? null;
}
