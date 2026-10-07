export type AboutMilestoneKind =
  | "award"
  | "certification"
  | "community"
  | "education"
  | "employment"
  | "freelance"
  | "training";

export type AboutMilestone = {
  credentialTitle?: string;
  credentialUrl?: string;
  dateLabel: string;
  highlights: string[];
  id: string;
  kind: AboutMilestoneKind;
  location?: string;
  organisation: string;
  status?: string;
  summary: string;
  title: string;
};

import type {ImageAsset} from './home'

export type AboutTechnologyGroup = {
  id: string
  label: string;
  technologies: string[];
};

export type AboutAction = {
  href: string
  label: string
}

export type AboutProfileModel = {
  cta: {
    eyebrow: string
    heading: string
    label: string
    message: string
  }
  development: {
    education: AboutMilestone[]
    educationHeading: string
    learning: AboutMilestone[]
    learningHeading: string
  }
  experience: {
    heading: string
    label: string
    milestones: AboutMilestone[]
  }
  focus: {
    heading: string
    items: Array<{description: string; id: string; title: string}>
    label: string
  }
  hero: {
    availability: string
    eyebrow: string
    heading: string
    identityFacts: Array<{id: string; label: string; value: string}>
    introduction: string
    location?: string
    primaryAction: AboutAction
    secondaryAction: AboutAction
  }
  principles: {
    heading: string
    items: string[]
    label: string
  }
  story: {
    eyebrow: string
    fullName: string
    location?: string
    paragraphs: string[]
    portrait?: ImageAsset
    quickFacts: string[]
  }
  tools: {
    groups: AboutTechnologyGroup[]
    heading: string
    label: string
  }
};
