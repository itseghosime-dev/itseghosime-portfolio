import type { PROJECT_PAGE_QUERY_RESULT } from "@/sanity.types";

export type ProjectPageData = NonNullable<PROJECT_PAGE_QUERY_RESULT["project"]>;
export type ProjectSection = NonNullable<ProjectPageData["sections"]>[number];
export type ProjectNavigationItem =
  PROJECT_PAGE_QUERY_RESULT["projectNavigation"][number];

export type ProjectSectionOf<Type extends ProjectSection["_type"]> = Extract<
  ProjectSection,
  { _type: Type }
>;

export type ProjectImageData = {
  alt: string | null;
  caption: string | null;
  height: number | null;
  lqip: string | null;
  url: string | null;
  width: number | null;
};
