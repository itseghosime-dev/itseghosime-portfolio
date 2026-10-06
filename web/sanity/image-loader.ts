'use client'

import type {ImageLoaderProps} from 'next/image'

export default function sanityImageLoader({src, width, quality}: ImageLoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io/images/')) {
    return src
  }

  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  url.searchParams.set('q', String(quality ?? 80))
  url.searchParams.set('w', String(width))

  return url.toString()
}
