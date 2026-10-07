export type ImageAsset = {
  alt: string;
  blurDataUrl?: string;
  caption?: string;
  height: number;
  url: string;
  width: number;
};

export type NavigationItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  label: string;
  platform: string;
  url: string;
};

export type ProjectSummary = {
  client?: string;
  coverImage: ImageAsset;
  liveUrl?: string;
  repositoryUrl?: string;
  role: string;
  slug: string;
  status: string;
  supportingImage?: ImageAsset;
  subtitle: string;
  summary: string;
  technologies: string[];
  timeline?: string;
  title: string;
  type: string;
  year: number;
};

export type TechnologySummary = {
  firstUsedYear?: number;
  name: string;
  relationship: string;
  summary?: string;
};

export type CapabilitySummary = {
  description: string;
  title: string;
};

export type LabExperimentSummary = {
  slug: string;
  status: string;
  summary: string;
  title: string;
};

export type HomePageModel = {
  about: {
    paragraphs: string[];
    principles: string[];
  };
  capabilities: CapabilitySummary[];
  contact: {
    buttonLabel: string;
    email: string;
    heading: string;
    message: string;
    resume?: {
      label: string;
      url: string;
    };
    socialLinks: SocialLink[];
  };
  footerText?: string;
  hero: {
    availability: string;
    availabilityNote?: string;
    introduction: string;
    location?: string;
    name: string;
    portrait?: ImageAsset;
    professionalTitle: string;
  };
  navigation: NavigationItem[];
  labExperiments: LabExperimentSummary[];
  projects: ProjectSummary[];
  siteName: string;
  targetRoles: string[];
  technologies: TechnologySummary[];
};
