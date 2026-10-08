import {createClient} from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.',
  )
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-06',
  perspective: 'published',
  // Query Content Lake directly so a cache invalidation never refetches a stale CDN response.
  useCdn: false,
})
