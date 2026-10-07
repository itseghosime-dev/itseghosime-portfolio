import type {HOME_PAGE_QUERY_RESULT} from '@/sanity.types'
import type {
  HomePageModel,
  ImageAsset,
  LabExperimentSummary,
  NavigationItem,
  ProjectSummary,
  SocialLink,
  TechnologySummary,
} from '@/types/home'

import {sanityFetch} from './live'
import {HOME_PAGE_QUERY} from './queries'

type SanityImage = NonNullable<
  NonNullable<HOME_PAGE_QUERY_RESULT['profile']>['portrait']
>

const availabilityLabels = {
  freelance: 'Available for freelance work',
  open: 'Open to opportunities',
  selective: 'Open to selected projects',
  unavailable: 'Not currently available',
} as const

const projectTypeLabels = {
  automation: 'Automation',
  concept: 'Concept project',
  experiment: 'Experiment',
  softwareProduct: 'Software product',
  webApplication: 'Web application',
  website: 'Website',
} as const

const projectStatusLabels = {
  archived: 'Archived',
  concept: 'Concept',
  inProgress: 'In progress',
  live: 'Live',
} as const

const technologyRelationshipLabels = {
  core: 'Core skill',
  exploring: 'Exploring',
  historical: 'Previously used',
  learning: 'Currently learning',
  working: 'Working knowledge',
} as const

const destinationHrefs = {
  capabilities: '/#capabilities',
  contact: '/contact',
  home: '/',
  lab: '/work?filter=experimental',
  profile: '/about',
  projects: '/work',
} as const

const capabilityTitles = [
  'Design implementation',
  'Frontend architecture',
  'Multilingual experiences',
  'Client handover',
  'Technical documentation',
] as const

const labStatusLabels = {
  archived: 'Archived',
  completed: 'Completed',
  exploring: 'Active',
  paused: 'Paused',
  planned: 'Planned',
} as const

function toImage(image: SanityImage | null): ImageAsset | undefined {
  if (!image?.url || !image.alt || !image.width || !image.height) {
    return undefined
  }

  return {
    alt: image.alt,
    blurDataUrl: image.lqip ?? undefined,
    caption: image.caption ?? undefined,
    height: image.height,
    url: image.url,
    width: image.width,
  }
}

function toParagraphs(biography: HOME_PAGE_QUERY_RESULT['profile'] extends infer Profile
  ? Profile extends {biography: infer Biography}
    ? Biography
    : never
  : never): string[] {
  if (!Array.isArray(biography)) {
    return []
  }

  return biography.flatMap((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) {
      return []
    }

    const paragraph = block.children
      .map((child) => child.text?.trim())
      .filter((text): text is string => Boolean(text))
      .join(' ')

    return paragraph ? [paragraph] : []
  })
}

function toNavigation(
  navigation: NonNullable<HOME_PAGE_QUERY_RESULT['settings']>['navigation'],
): NavigationItem[] {
  if (!Array.isArray(navigation)) {
    return []
  }

  return navigation.flatMap((item) => {
    if (!item.label || !item.destination) {
      return []
    }

    if (item.destination === 'external') {
      return item.externalUrl ? [{href: item.externalUrl, label: item.label}] : []
    }

    if (!(item.destination in destinationHrefs)) {
      return []
    }

    const destination = item.destination as keyof typeof destinationHrefs
    return [{href: destinationHrefs[destination], label: item.label}]
  })
}

function toSocialLinks(
  links: NonNullable<HOME_PAGE_QUERY_RESULT['profile']>['socialLinks'],
): SocialLink[] {
  if (!Array.isArray(links)) {
    return []
  }

  return links.flatMap((link) =>
    link.url && link.label && link.platform
      ? [{label: link.label, platform: link.platform, url: link.url}]
      : [],
  )
}

function toProjects(projects: HOME_PAGE_QUERY_RESULT['projects']): ProjectSummary[] {
  return projects.flatMap((project) => {
    const coverImage = toImage(project.coverImage)

    if (
      !coverImage ||
      !project.title ||
      !project.slug ||
      !project.subtitle ||
      !project.summary ||
      !project.role ||
      !project.year ||
      !project.projectType ||
      !project.status
    ) {
      return []
    }

    return [
      {
        client: project.client ?? undefined,
        coverImage,
        liveUrl: project.liveUrl ?? undefined,
        repositoryUrl: project.repositoryUrl ?? undefined,
        role: project.role,
        slug: project.slug,
        status: projectStatusLabels[project.status],
        supportingImage: toImage(project.supportingImage),
        subtitle: project.subtitle,
        summary: project.summary,
        technologies:
          project.technologies
            ?.map((technology) => technology.name)
            .filter((name): name is string => Boolean(name)) ?? [],
        timeline: project.timeline ?? undefined,
        title: project.title,
        type: projectTypeLabels[project.projectType],
        year: project.year,
      },
    ]
  })
}

function toTechnologies(
  technologies: HOME_PAGE_QUERY_RESULT['technologies'],
): TechnologySummary[] {
  return technologies.flatMap((technology) => {
    if (!technology.name || !technology.relationship) {
      return []
    }

    return [
      {
        firstUsedYear: technology.firstUsedYear ?? undefined,
        name: technology.name,
        relationship: technologyRelationshipLabels[technology.relationship],
        summary: technology.summary ?? undefined,
      },
    ]
  })
}

function toLabExperiments(
  experiments: HOME_PAGE_QUERY_RESULT['labExperiments'],
): LabExperimentSummary[] {
  return experiments.flatMap((experiment) => {
    if (!experiment.title || !experiment.slug || !experiment.summary || !experiment.status) {
      return []
    }

    return [
      {
        slug: experiment.slug,
        status: labStatusLabels[experiment.status],
        summary: experiment.summary,
        title: experiment.title,
      },
    ]
  })
}

export async function getHomePage(): Promise<HomePageModel | null> {
  const {data} = await sanityFetch({
    query: HOME_PAGE_QUERY,
    perspective: 'published',
    stega: false,
  })

  const {profile, settings} = data

  if (
    !profile?.fullName ||
    !profile.professionalTitle ||
    !profile.introduction ||
    !profile.email ||
    !profile.availability ||
    !settings?.siteName ||
    !settings.contactHeading ||
    !settings.contactMessage ||
    !settings.contactButtonLabel
  ) {
    return null
  }

  return {
    about: {
      paragraphs: toParagraphs(profile.biography),
      principles: profile.workingPrinciples?.filter(Boolean) ?? [],
    },
    capabilities:
      profile.professionalStrengths?.filter(Boolean).map((description, index) => ({
        description,
        title: capabilityTitles[index] ?? `Capability ${index + 1}`,
      })) ?? [],
    contact: {
      buttonLabel: settings.contactButtonLabel,
      email: profile.email,
      heading: settings.contactHeading,
      message: settings.contactMessage,
      resume: profile.resume?.url
        ? {
            label: profile.resume.label ?? 'Download résumé',
            url: profile.resume.url,
          }
        : undefined,
      socialLinks: toSocialLinks(profile.socialLinks),
    },
    footerText: settings.footerText ?? undefined,
    hero: {
      availability: availabilityLabels[profile.availability],
      availabilityNote: profile.availabilityNote ?? undefined,
      introduction: profile.introduction,
      location: profile.location ?? undefined,
      name: profile.fullName,
      portrait: toImage(profile.portrait),
      professionalTitle: profile.professionalTitle,
    },
    navigation: toNavigation(settings.navigation),
    labExperiments: toLabExperiments(data.labExperiments),
    projects: toProjects(data.projects),
    siteName: settings.siteName,
    technologies: toTechnologies(data.technologies),
  }
}
