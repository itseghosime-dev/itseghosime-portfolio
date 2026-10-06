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
  ] | order(displayOrder asc, year desc){
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
