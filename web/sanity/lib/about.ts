import type {ABOUT_PROFILE_QUERY_RESULT} from '@/sanity.types'
import type {AboutMilestone, AboutMilestoneKind, AboutProfileModel} from '@/types/about'
import type {ImageAsset} from '@/types/home'

import {sanityFetch} from './live'
import {getContentFetchOptions} from './fetch-options'
import {ABOUT_PROFILE_QUERY} from './queries'

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

const availabilityLabels = {
  freelance: 'Available for freelance work',
  open: 'Open to opportunities',
  selective: 'Open to selected projects',
  unavailable: 'Not currently available',
} as const

const milestoneTypeLabels = {
  award: 'Recognition',
  certification: 'Certification',
  community: 'Community',
  education: 'Education',
  employment: 'Employment',
  freelance: 'Independent',
  training: 'Training',
} as const

type QueryMilestone = {
  _id: string
  credentialTitle?: string | null
  credentialUrl?: string | null
  endDate?: string | null
  engagementType?: string | null
  expectedEndDate?: string | null
  highlights?: Array<string | null> | null
  location?: string | null
  milestoneType:
    | 'award'
    | 'certification'
    | 'community'
    | 'education'
    | 'employment'
    | 'freelance'
    | 'training'
    | null
  organisation: string | null
  startDate: string | null
  status?: 'completed' | 'inProgress' | 'upcoming' | null
  summary: string | null
  title: string | null
}

function formatDate(value: string | null): string | undefined {
  if (!value) return undefined
  return monthFormatter.format(new Date(`${value}T00:00:00Z`))
}

function toParagraphs(
  biography: NonNullable<ABOUT_PROFILE_QUERY_RESULT['profile']>['biography'],
): string[] {
  if (!Array.isArray(biography)) return []

  return biography.flatMap((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return []

    const paragraph = block.children
      .map((child) => child.text?.trim())
      .filter((text): text is string => Boolean(text))
      .join(' ')

    return paragraph ? [paragraph] : []
  })
}

function toImage(
  image: NonNullable<ABOUT_PROFILE_QUERY_RESULT['profile']>['portrait'],
): ImageAsset | undefined {
  if (!image?.url || !image.alt || !image.width || !image.height) return undefined

  return {
    alt: image.alt,
    blurDataUrl: image.lqip ?? undefined,
    caption: image.caption ?? undefined,
    height: image.height,
    url: image.url,
    width: image.width,
  }
}

function toMilestones(milestones: Array<QueryMilestone | null> | null): AboutMilestone[] {
  if (!Array.isArray(milestones)) return []

  return milestones.flatMap((milestone) => {
    if (
      !milestone?._id ||
      !milestone.title ||
      !milestone.milestoneType ||
      !milestone.organisation ||
      !milestone.startDate ||
      !milestone.summary
    ) {
      return []
    }

    const start = formatDate(milestone.startDate)
    const end =
      milestone.status === 'inProgress'
        ? milestone.expectedEndDate
          ? `Expected ${formatDate(milestone.expectedEndDate)}`
          : 'Present'
        : formatDate(milestone.endDate ?? null)

    const highlights = (milestone.highlights ?? []).filter((h): h is string => Boolean(h))

    return [
      {
        credentialTitle: milestone.credentialTitle ?? undefined,
        credentialUrl: milestone.credentialUrl ?? undefined,
        dateLabel: [start, end].filter(Boolean).join(' — '),
        highlights,
        id: milestone._id,
        kind: milestone.milestoneType as AboutMilestoneKind,
        location: milestone.location ?? undefined,
        organisation: milestone.organisation,
        status:
          milestone.status === 'inProgress'
            ? 'In progress'
            : milestoneTypeLabels[milestone.milestoneType],
        summary: milestone.summary,
        title: milestone.title,
      },
    ]
  })
}

export async function getAboutProfile(): Promise<AboutProfileModel | null> {
  const fetchOptions = await getContentFetchOptions()
  const {data} = await sanityFetch({
    ...fetchOptions,
    query: ABOUT_PROFILE_QUERY,
  })
  const {aboutPage, profile} = data

  if (
    !aboutPage?.heroEyebrow ||
    !aboutPage.heroHeading ||
    !aboutPage.heroIntroduction ||
    !aboutPage.primaryAction?.label ||
    !aboutPage.primaryAction.href ||
    !aboutPage.secondaryAction?.label ||
    !aboutPage.secondaryAction.href ||
    !aboutPage.storyEyebrow ||
    !aboutPage.focusHeading ||
    !aboutPage.focusLabel ||
    !aboutPage.toolsHeading ||
    !aboutPage.toolsLabel ||
    !aboutPage.experienceHeading ||
    !aboutPage.experienceLabel ||
    !aboutPage.educationHeading ||
    !aboutPage.learningHeading ||
    !aboutPage.principlesHeading ||
    !aboutPage.principlesLabel ||
    !aboutPage.ctaEyebrow ||
    !aboutPage.ctaHeading ||
    !aboutPage.ctaMessage ||
    !aboutPage.ctaLabel ||
    !profile?.fullName ||
    !profile.availability
  ) {
    return null
  }

  return {
    cta: {
      eyebrow: aboutPage.ctaEyebrow,
      heading: aboutPage.ctaHeading,
      label: aboutPage.ctaLabel,
      message: aboutPage.ctaMessage,
    },
    development: {
      education: toMilestones(aboutPage.educationMilestones),
      educationHeading: aboutPage.educationHeading,
      learning: toMilestones(aboutPage.learningMilestones),
      learningHeading: aboutPage.learningHeading,
    },
    experience: {
      heading: aboutPage.experienceHeading,
      label: aboutPage.experienceLabel,
      milestones: toMilestones(aboutPage.experienceMilestones),
    },
    focus: {
      heading: aboutPage.focusHeading,
      items:
        aboutPage.focusItems?.flatMap((item) =>
          item._key && item.title && item.description
            ? [{description: item.description, id: item._key, title: item.title}]
            : [],
        ) ?? [],
      label: aboutPage.focusLabel,
    },
    hero: {
      availability: availabilityLabels[profile.availability],
      eyebrow: aboutPage.heroEyebrow,
      heading: aboutPage.heroHeading,
      identityFacts:
        aboutPage.identityFacts?.flatMap((fact) =>
          fact._key && fact.label && fact.value
            ? [{id: fact._key, label: fact.label, value: fact.value}]
            : [],
        ) ?? [],
      introduction: aboutPage.heroIntroduction,
      location: profile.location ?? undefined,
      primaryAction: {
        href: aboutPage.primaryAction.href,
        label: aboutPage.primaryAction.label,
      },
      secondaryAction: {
        href: aboutPage.secondaryAction.href,
        label: aboutPage.secondaryAction.label,
      },
    },
    principles: {
      heading: aboutPage.principlesHeading,
      items: profile.workingPrinciples?.filter(Boolean) ?? [],
      label: aboutPage.principlesLabel,
    },
    story: {
      eyebrow: aboutPage.storyEyebrow,
      fullName: profile.fullName,
      location: profile.location ?? undefined,
      paragraphs: toParagraphs(profile.biography),
      portrait: toImage(profile.portrait),
      quickFacts: aboutPage.quickFacts?.filter(Boolean) ?? [],
    },
    tools: {
      groups:
        aboutPage.technologyGroups?.flatMap((group) => {
          const technologies =
            group.technologies
              ?.map((technology) => technology?.name)
              .filter((name): name is string => Boolean(name)) ?? []

          return group._key && group.label && technologies.length > 0
            ? [{id: group._key, label: group.label, technologies}]
            : []
        }) ?? [],
      heading: aboutPage.toolsHeading,
      label: aboutPage.toolsLabel,
    },
  }
}
