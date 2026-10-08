import type { LAB_PAGE_QUERY_RESULT } from "@/sanity.types";
import type { ImageAsset } from "@/types/home";
import type {
  LabCategory,
  LabExperimentModel,
  LabPageData,
  LabPageModel,
  LabPresentation,
} from "@/types/lab";

import { sanityFetch } from "./live";
import { LAB_PAGE_QUERY } from "./queries";

const defaultLabPage: LabPageModel = {
  eyebrow: "LAB ARCHIVE // EXPERIMENTS IN INTERACTION & CREATIVE CODE",
  heading: "Things I build when I’m curious.",
  introduction:
    "Small experiments in interaction, tactile interfaces, real-time data visualisation, and creative frontend development.",
  activeStudiesLabel: "Active studies",
  surpriseLabel: "Surprise me",
  archiveEyebrow: "Notebook index",
  archiveHeading: "Earlier explorations & micro-tools",
  archiveNote: "Curated selection",
  closingEyebrow: "Status: exploratory",
  closingHeading: "Still experimenting.",
  closingMessage:
    "New things appear here as I learn, break things, and explore the medium.",
  workLinkLabel: "View work",
  githubLinkLabel: "GitHub",
  contactLinkLabel: "Contact",
};

const labStatusLabels: Record<string, string> = {
  archived: "Archived",
  completed: "Completed",
  exploring: "Active experiment",
  paused: "Paused",
  planned: "Planned",
};

const categoryLabels: Record<Exclude<LabCategory, "all">, string> = {
  interaction: "Interaction",
  uiForms: "UI & forms",
  dataViz: "Data & viz",
  threeDShaders: "3D & shaders",
  motion: "Motion",
};

const allowedCategories = new Set<Exclude<LabCategory, "all">>(
  Object.keys(categoryLabels) as Array<Exclude<LabCategory, "all">>,
);

const allowedPresentations = new Set<LabPresentation>([
  "none",
  "spatialDepth",
  "magneticNavigation",
  "kineticTypography",
  "autonomousMicroForm",
  "streamingData",
  "springCarousel",
]);

function getYear(date: string | null | undefined): string | undefined {
  return date?.slice(0, 4);
}

function toCategory(
  value: string | null | undefined,
): Exclude<LabCategory, "all"> {
  return value && allowedCategories.has(value as Exclude<LabCategory, "all">)
    ? (value as Exclude<LabCategory, "all">)
    : "interaction";
}

function inferLegacyCategory(
  title: string,
  summary: string,
  technologies: string[],
): Exclude<LabCategory, "all"> {
  const context = `${title} ${summary} ${technologies.join(" ")}`.toLowerCase();
  if (/shader|three\.js|webgl|glsl|3d/.test(context)) return "threeDShaders";
  if (/motion|animation|gsap|spring|physics/.test(context)) return "motion";
  if (/data|canvas|chart|visuali[sz]ation|worker/.test(context))
    return "dataViz";
  if (/form|validation|input|typography|font|zod/.test(context))
    return "uiForms";
  return "interaction";
}

function toPresentation(value: string | null | undefined): LabPresentation {
  return value && allowedPresentations.has(value as LabPresentation)
    ? (value as LabPresentation)
    : "none";
}

function toPageModel(page: LAB_PAGE_QUERY_RESULT["labPage"]): LabPageModel {
  if (!page) return defaultLabPage;

  return {
    eyebrow: page.eyebrow || defaultLabPage.eyebrow,
    heading: page.heading || defaultLabPage.heading,
    introduction: page.introduction || defaultLabPage.introduction,
    activeStudiesLabel:
      page.activeStudiesLabel || defaultLabPage.activeStudiesLabel,
    surpriseLabel: page.surpriseLabel || defaultLabPage.surpriseLabel,
    archiveEyebrow: page.archiveEyebrow || defaultLabPage.archiveEyebrow,
    archiveHeading: page.archiveHeading || defaultLabPage.archiveHeading,
    archiveNote: page.archiveNote || defaultLabPage.archiveNote,
    closingEyebrow: page.closingEyebrow || defaultLabPage.closingEyebrow,
    closingHeading: page.closingHeading || defaultLabPage.closingHeading,
    closingMessage: page.closingMessage || defaultLabPage.closingMessage,
    workLinkLabel: page.workLinkLabel || defaultLabPage.workLinkLabel,
    githubLinkLabel: page.githubLinkLabel || defaultLabPage.githubLinkLabel,
    contactLinkLabel: page.contactLinkLabel || defaultLabPage.contactLinkLabel,
  };
}

export async function getLabPage(): Promise<LabPageData> {
  const { data } = (await sanityFetch({
    query: LAB_PAGE_QUERY,
    perspective: "published",
    stega: false,
  })) as { data: LAB_PAGE_QUERY_RESULT };

  const experiments = (data?.labExperiments ?? []).flatMap<LabExperimentModel>(
    (experiment, index) => {
      if (
        !experiment._id ||
        !experiment.title ||
        !experiment.slug ||
        !experiment.summary
      )
        return [];

      const technologyNames =
        experiment.technologies?.flatMap((technology) =>
          technology.name ? [technology.name] : [],
        ) ?? [];
      const category = experiment.category
        ? toCategory(experiment.category)
        : inferLegacyCategory(
            experiment.title,
            experiment.summary,
            technologyNames,
          );

      return [
        {
          id: experiment._id,
          number: `LAB ${String(experiment.experimentNumber ?? experiment.displayOrder ?? index + 1).padStart(3, "0")}`,
          title: experiment.title,
          slug: experiment.slug,
          summary: experiment.summary,
          stack: technologyNames.join(" · ") || "Research in progress",
          category,
          categoryLabel: categoryLabels[category],
          presentation: toPresentation(experiment.presentation),
          year: getYear(experiment.completedAt || experiment.startedAt),
          version: experiment.version || undefined,
          status: experiment.status
            ? (labStatusLabels[experiment.status] ?? experiment.status)
            : undefined,
          isActive:
            experiment.status === "exploring" ||
            experiment.status === "completed",
          demoUrl: experiment.demoUrl || undefined,
          sourceUrl: experiment.repositoryUrl || undefined,
          coverImage: experiment.coverImage as ImageAsset | undefined,
        },
      ];
    },
  );

  return {
    page: toPageModel(data?.labPage),
    experiments,
    seo: data?.labPage?.seo
      ? {
          title: data.labPage.seo.title || undefined,
          description: data.labPage.seo.description || undefined,
          noIndex: data.labPage.seo.noIndex || undefined,
          image: data.labPage.seo.image as ImageAsset | undefined,
        }
      : undefined,
  };
}
