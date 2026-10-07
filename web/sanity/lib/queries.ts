import {defineQuery} from 'next-sanity'

const IMAGE_PROJECTION = `{
  alt,
  caption,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`

export const HOME_PAGE_QUERY = defineQuery(`{
  "profile": *[_id == "profile"][0]{
    fullName,
    professionalTitle,
    introduction,
    location,
    availability,
    availabilityNote,
    targetRoles,
    professionalStrengths,
    workingPrinciples,
    email,
    socialLinks[]{platform, label, url},
    "resume": resume{
      label,
      "url": asset->url
    },
    "biography": biography[]{
      _key,
      _type,
      style,
      children[]{_key, _type, text, marks}
    },
    "portrait": portrait ${IMAGE_PROJECTION}
  },
  "settings": *[_id == "siteSettings"][0]{
    siteName,
    siteDescription,
    canonicalUrl,
    navigation[]{label, destination, externalUrl},
    contactHeading,
    contactMessage,
    contactButtonLabel,
    footerText,
    indexing,
    googleSiteVerification,
    defaultSeo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    }
  },
  "projects": *[
    _type == "project" &&
    featured == true &&
    defined(slug.current)
  ] | order(displayOrder asc, year desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    summary,
    role,
    client,
    year,
    timeline,
    projectType,
    status,
    liveUrl,
    repositoryUrl,
    "coverImage": coverImage ${IMAGE_PROJECTION},
    "supportingImage": supportingImage ${IMAGE_PROJECTION},
    "technologies": technologyStack[]->{name, "slug": slug.current}
  },
  "technologies": *[
    _type == "technology" &&
    name in ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "Sanity", "Git"]
  ] | order(displayOrder asc, name asc){
    _id,
    name,
    summary,
    relationship,
    firstUsedYear
  },
  "labExperiments": *[
    _type == "labExperiment" &&
    featured == true &&
    defined(slug.current)
  ] | order(displayOrder asc, _createdAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    summary,
    status
  }
}`)

export const HOME_METADATA_QUERY = defineQuery(`{
  "profile": *[_id == "profile"][0]{fullName, professionalTitle},
  "settings": *[_id == "siteSettings"][0]{
    siteName,
    siteDescription,
    canonicalUrl,
    indexing,
    googleSiteVerification,
    defaultSeo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    }
  }
}`)

export const ABOUT_PROFILE_QUERY = defineQuery(`{
  "aboutPage": *[_id == "aboutPage"][0]{
    heroEyebrow,
    heroHeading,
    heroIntroduction,
    identityFacts[]{_key, label, value},
    primaryAction{label, href},
    secondaryAction{label, href},
    storyEyebrow,
    quickFacts,
    focusHeading,
    focusLabel,
    focusItems[]{_key, title, description},
    toolsHeading,
    toolsLabel,
    technologyGroups[]{
      _key,
      label,
      technologies[]->{_id, name}
    },
    experienceHeading,
    experienceLabel,
    experienceMilestones[]->{
      _id,
      title,
      milestoneType,
      organisation,
      engagementType,
      location,
      status,
      startDate,
      endDate,
      expectedEndDate,
      summary,
      highlights,
      credentialTitle,
      credentialUrl
    },
    educationHeading,
    learningHeading,
    educationMilestones[]->{
      _id,
      title,
      milestoneType,
      organisation,
      location,
      status,
      startDate,
      endDate,
      expectedEndDate,
      summary,
      highlights,
      credentialTitle,
      credentialUrl
    },
    learningMilestones[]->{
      _id,
      title,
      milestoneType,
      organisation,
      location,
      status,
      startDate,
      endDate,
      expectedEndDate,
      summary,
      highlights,
      credentialTitle,
      credentialUrl
    },
    principlesHeading,
    principlesLabel,
    ctaEyebrow,
    ctaHeading,
    ctaMessage,
    ctaLabel
  },
  "profile": *[_id == "profile"][0]{
    fullName,
    professionalTitle,
    location,
    availability,
    email,
    workingPrinciples,
    "biography": biography[]{
      _key,
      _type,
      style,
      children[]{_key, _type, text, marks}
    },
    "portrait": portrait ${IMAGE_PROJECTION}
  }
}`)

export const WORK_ARCHIVE_QUERY = defineQuery(`{
  "projects": *[
    _type == "project" &&
    defined(slug.current)
  ] | order(displayOrder asc, year desc)[0...8]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    summary,
    role,
    client,
    year,
    timeline,
    projectType,
    status,
    liveUrl,
    repositoryUrl,
    "coverImage": coverImage ${IMAGE_PROJECTION},
    "supportingImage": supportingImage ${IMAGE_PROJECTION},
    "technologies": technologyStack[]->{name}
  },
  "labExperiments": *[
    _type == "labExperiment" &&
    defined(slug.current)
  ] | order(displayOrder asc, _createdAt asc)[0...8]{
    _id,
    title,
    "slug": slug.current,
    summary,
    status,
    startedAt,
    completedAt,
    demoUrl,
    repositoryUrl,
    "coverImage": coverImage ${IMAGE_PROJECTION},
    "technologies": technologies[]->{name}
  }
}`)
