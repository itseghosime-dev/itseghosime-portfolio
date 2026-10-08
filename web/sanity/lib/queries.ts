import { defineQuery } from "next-sanity";

const IMAGE_PROJECTION = `{
  alt,
  caption,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`;

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
}`);

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
}`);

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
}`);

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
}`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{"slug": slug.current}
`);

export const PROJECT_METADATA_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    subtitle,
    summary,
    "seo": seo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    },
    "coverImage": coverImage ${IMAGE_PROJECTION}
  }
`);

export const PROJECT_PAGE_QUERY = defineQuery(`{
  "project": *[_type == "project" && slug.current == $slug][0]{
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
    "technologyStack": technologyStack[]->{_id, name},
    "coverImage": coverImage ${IMAGE_PROJECTION},
    "supportingImage": supportingImage ${IMAGE_PROJECTION},
    sections[]{
      _key,
      _type,
      eyebrow,
      heading,
      headline,
      introduction,
      presentation,
      body[]{
        _key,
        _type,
        style,
        listItem,
        level,
        children[]{_key, _type, text, marks},
        markDefs[]{_key, _type, href, openInNewTab}
      },
      "image": image ${IMAGE_PROJECTION},
      items[]{
        _key,
        _type,
        label,
        title,
        description,
        kind,
        value,
        mediaType,
        videoUrl,
        caption,
        displayContext,
        "image": image ${IMAGE_PROJECTION},
        "posterImage": posterImage ${IMAGE_PROJECTION}
      },
      steps[]{
        _key,
        _type,
        phase,
        title,
        description,
        deliverables,
        "image": image ${IMAGE_PROJECTION}
      },
      snippets[]{
        _key,
        _type,
        title,
        filename,
        language,
        code,
        explanation,
        sourceUrl
      },
      embedUrl,
      "fallbackImage": fallbackImage ${IMAGE_PROJECTION},
      fallbackMessage,
      instructions[]{_key, _type, title, description},
      availableViewports,
      initialViewport,
      frameHeight,
      summary,
      closingNote
    }
  },
  "projectNavigation": *[
    _type == "project" &&
    defined(slug.current)
  ] | order(displayOrder asc, year desc){
    _id,
    title,
    "slug": slug.current,
    subtitle,
    projectType,
    "coverImage": coverImage ${IMAGE_PROJECTION}
  }
}`);

export const LAB_PAGE_QUERY = defineQuery(`{
  "labPage": *[_id == "labPage"][0]{
    eyebrow,
    heading,
    introduction,
    activeStudiesLabel,
    surpriseLabel,
    archiveEyebrow,
    archiveHeading,
    archiveNote,
    closingEyebrow,
    closingHeading,
    closingMessage,
    workLinkLabel,
    githubLinkLabel,
    contactLinkLabel,
    seo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    }
  },
  "labExperiments": *[
    _type == "labExperiment" &&
    defined(slug.current)
  ] | order(displayOrder asc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    question,
    status,
    startedAt,
    completedAt,
    demoUrl,
    repositoryUrl,
    featured,
    displayOrder,
    experimentNumber,
    category,
    version,
    presentation,
    "coverImage": coverImage ${IMAGE_PROJECTION},
    "technologies": technologies[]->{name}
  }
}`);

export const NOTES_ARCHIVE_QUERY = defineQuery(`{
  "notesPage": *[_id == "notesPage"][0]{
    eyebrow,
    heading,
    introduction,
    archiveNote,
    backLabel,
    contentsLabel,
    readerLabels{
      sectionCount,
      toolsHeading,
      toolsBadge,
      share,
      copy,
      copied,
      typeface,
      feedback
    },
    relatedHeading,
    feedbackHeading,
    feedbackMessage,
    seo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    }
  },
  "notes": *[
    _type == "note" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(displayOrder asc, publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    preview{label, summary, code},
    publishedAt,
    category,
    volumeNumber,
    readingTimeMinutes,
    topics,
    featured,
    displayOrder,
    "coverImage": coverImage ${IMAGE_PROJECTION},
    "technologies": technologies[]->{_id, name}
  }
}`);

export const NOTE_SLUGS_QUERY = defineQuery(`
  *[
    _type == "note" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ]{"slug": slug.current}
`);

export const NOTE_METADATA_QUERY = defineQuery(`
  *[_type == "note" && slug.current == $slug][0]{
    _updatedAt,
    title,
    excerpt,
    publishedAt,
    preview{label, summary, code},
    editorialContext{
      sectionLabel,
      seriesLabel
    },
    "seo": seo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    },
    "coverImage": coverImage ${IMAGE_PROJECTION}
  }
`);

export const NOTE_DETAIL_QUERY = defineQuery(`{
  "note": *[
    _type == "note" &&
    slug.current == $slug &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    preview{label, summary, code},
    editorialContext{
      sectionLabel,
      seriesLabel
    },
    publishedAt,
    category,
    volumeNumber,
    readingTimeMinutes,
    topics,
    "technologies": technologies[]->{_id, name},
    "coverImage": coverImage ${IMAGE_PROJECTION},
    body[]{
      _key,
      _type,
      style,
      listItem,
      level,
      children[]{_key, _type, text, marks},
      markDefs[]{_key, _type, href, openInNewTab},
      filename,
      language,
      code,
      caption,
      eyebrow,
      title,
      items[]{_key, _type, label, title, description},
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    },
    seo{
      title,
      description,
      noIndex,
      "image": image ${IMAGE_PROJECTION}
    }
  },
  "profile": *[_id == "profile"][0]{fullName, email},
  "notesPage": *[_id == "notesPage"][0]{
    backLabel,
    contentsLabel,
    readerLabels{
      sectionCount,
      toolsHeading,
      toolsBadge,
      share,
      copy,
      copied,
      typeface,
      feedback
    },
    relatedHeading,
    feedbackHeading,
    feedbackMessage
  },
  "noteNavigation": *[
    _type == "note" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(displayOrder asc, publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    preview{label, summary, code},
    publishedAt,
    category,
    volumeNumber,
    readingTimeMinutes,
    topics,
    "technologies": technologies[]->{_id, name}
  }
}`);

export const SITEMAP_QUERY = defineQuery(`{
  "projects": *[
    _type == "project" &&
    defined(slug.current) &&
    seo.noIndex != true
  ]{
    "path": "/work/" + slug.current,
    _updatedAt
  },
  "notes": *[
    _type == "note" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    seo.noIndex != true
  ]{
    "path": "/notes/" + slug.current,
    _updatedAt
  }
}`);
