import type {WORK_ARCHIVE_QUERY_RESULT} from '@/sanity.types'
import type {ImageAsset} from '@/types/home'
import type {ArchiveCategory, ArchiveEntry} from '@/types/work'

import {sanityFetch} from './live'
import {WORK_ARCHIVE_QUERY} from './queries'

type SanityArchiveImage = NonNullable<
  NonNullable<WORK_ARCHIVE_QUERY_RESULT['projects'][number]>['coverImage']
>

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

const labStatusLabels = {
  archived: 'Archived',
  completed: 'Completed',
  exploring: 'Exploring',
  paused: 'Paused',
  planned: 'Planned',
} as const

function toImage(image: SanityArchiveImage | null): ImageAsset | undefined {
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

function getYear(date: string | null): number | undefined {
  if (!date) {
    return undefined
  }

  const year = Number.parseInt(date.slice(0, 4), 10)
  return Number.isInteger(year) ? year : undefined
}

function getProjectCategories(
  projectType: NonNullable<WORK_ARCHIVE_QUERY_RESULT['projects'][number]>['projectType'],
  client: string | null,
): ArchiveCategory[] {
  const categories: ArchiveCategory[] = []

  if (client) {
    categories.push('client')
  }

  if (projectType === 'website' || projectType === 'webApplication' || projectType === 'softwareProduct') {
    categories.push('web')
  }

  if (projectType === 'automation' || projectType === 'concept' || projectType === 'experiment') {
    categories.push('experimental')
  }

  return categories
}

function toProjectEntries(
  projects: WORK_ARCHIVE_QUERY_RESULT['projects'],
): ArchiveEntry[] {
  return projects.flatMap((project) => {
    if (
      !project._id ||
      !project.title ||
      !project.slug ||
      !project.summary ||
      !project.projectType ||
      !project.status
    ) {
      return []
    }

    return [
      {
        categories: getProjectCategories(project.projectType, project.client),
        client: project.client ?? undefined,
        coverImage: toImage(project.coverImage),
        href: `/work/${project.slug}`,
        id: project._id,
        kind: 'project' as const,
        liveUrl: project.liveUrl ?? undefined,
        repositoryUrl: project.repositoryUrl ?? undefined,
        role: project.role ?? undefined,
        slug: project.slug,
        status: projectStatusLabels[project.status],
        subtitle: project.subtitle ?? project.summary,
        supportingImage: toImage(project.supportingImage),
        technologies:
          project.technologies
            ?.map((technology) => technology.name)
            .filter((name): name is string => Boolean(name)) ?? [],
        timeline: project.timeline ?? undefined,
        title: project.title,
        type: projectTypeLabels[project.projectType],
        year: project.year ?? undefined,
      },
    ]
  })
}

function toLabEntries(
  experiments: WORK_ARCHIVE_QUERY_RESULT['labExperiments'],
): ArchiveEntry[] {
  return experiments.flatMap((experiment) => {
    if (
      !experiment._id ||
      !experiment.title ||
      !experiment.slug ||
      !experiment.summary ||
      !experiment.status
    ) {
      return []
    }

    return [
      {
        categories: ['experimental'] as ArchiveCategory[],
        coverImage: toImage(experiment.coverImage),
        id: experiment._id,
        kind: 'lab' as const,
        liveUrl: experiment.demoUrl ?? undefined,
        repositoryUrl: experiment.repositoryUrl ?? undefined,
        slug: experiment.slug,
        status: labStatusLabels[experiment.status],
        subtitle: experiment.summary,
        technologies:
          experiment.technologies
            ?.map((technology) => technology.name)
            .filter((name): name is string => Boolean(name)) ?? [],
        timeline: experiment.completedAt ?? experiment.startedAt ?? undefined,
        title: experiment.title,
        type: 'Lab experiment',
        year: getYear(experiment.completedAt ?? experiment.startedAt),
      },
    ]
  })
}

export async function getWorkArchive(): Promise<ArchiveEntry[]> {
  const {data} = await sanityFetch({
    query: WORK_ARCHIVE_QUERY,
    perspective: 'published',
    stega: false,
  })

  return [...toProjectEntries(data.projects), ...toLabEntries(data.labExperiments)].slice(0, 8)
}
