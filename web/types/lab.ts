import type { ImageAsset } from "./home";

export type LabCategory =
  "all" | "interaction" | "uiForms" | "dataViz" | "threeDShaders" | "motion";

export type LabPresentation =
  | "none"
  | "spatialDepth"
  | "magneticNavigation"
  | "kineticTypography"
  | "autonomousMicroForm"
  | "streamingData"
  | "springCarousel";

export type LabPageModel = {
  eyebrow: string;
  heading: string;
  introduction: string;
  activeStudiesLabel: string;
  surpriseLabel: string;
  archiveEyebrow: string;
  archiveHeading: string;
  archiveNote?: string;
  closingEyebrow: string;
  closingHeading: string;
  closingMessage: string;
  workLinkLabel: string;
  githubLinkLabel: string;
  contactLinkLabel: string;
};

export type LabExperimentModel = {
  id: string;
  number: string;
  title: string;
  slug: string;
  summary: string;
  stack: string;
  category: Exclude<LabCategory, "all">;
  categoryLabel: string;
  presentation: LabPresentation;
  year?: string;
  version?: string;
  status?: string;
  isActive: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  coverImage?: ImageAsset;
};

export type LabPageData = {
  page: LabPageModel;
  experiments: LabExperimentModel[];
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    image?: ImageAsset;
  };
};
