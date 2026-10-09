import { describe, expect, it } from 'vitest'
import {
  createPageMetadata,
  DEFAULT_SOCIAL_IMAGE,
  resolveSocialImage,
} from './seo'
import { SITE_NAME } from './site'

describe('SEO metadata utilities', () => {
  it('resolves custom social image when provided', () => {
    const customImage = {
      alt: 'Custom Alt',
      height: 630,
      url: 'https://cdn.sanity.io/images/demo.jpg',
      width: 1200,
    }
    const result = resolveSocialImage(customImage)
    expect(result).toEqual({
      alt: 'Custom Alt',
      height: 630,
      url: 'https://cdn.sanity.io/images/demo.jpg',
      width: 1200,
    })
  })

  it('rejects a portrait content image that is unsuitable for a large social card', () => {
    const result = resolveSocialImage({
      alt: 'Portrait article cover',
      height: 920,
      url: 'https://cdn.sanity.io/images/portrait.jpg',
      width: 736,
    })

    expect(result).toEqual(DEFAULT_SOCIAL_IMAGE)
  })

  it('falls back to default image when primary image has no url', () => {
    const defaultImage = {
      alt: 'Default Fallback Alt',
      height: 630,
      url: 'https://cdn.sanity.io/images/fallback.jpg',
      width: 1200,
    }
    const result = resolveSocialImage(null, defaultImage)
    expect(result).toEqual({
      alt: 'Default Fallback Alt',
      height: 630,
      url: 'https://cdn.sanity.io/images/fallback.jpg',
      width: 1200,
    })
  })

  it('returns DEFAULT_SOCIAL_IMAGE when neither primary nor default image has url', () => {
    const result = resolveSocialImage(null, null)
    expect(result).toEqual(DEFAULT_SOCIAL_IMAGE)
    expect(result.url).toBe('https://www.itseghosime.com/opengraph-image')
  })

  it('creates complete page metadata with default indexing', () => {
    const metadata = createPageMetadata({
      description: 'Test page description',
      path: '/about',
      title: 'About — ITSEGHOSIME',
    })

    expect(metadata.title).toBe('About — ITSEGHOSIME')
    expect(metadata.description).toBe('Test page description')
    expect(metadata.alternates).toEqual({ canonical: '/about' })

    expect(metadata.openGraph).toEqual({
      type: 'website',
      title: 'About — ITSEGHOSIME',
      description: 'Test page description',
      siteName: SITE_NAME,
      url: '/about',
      images: [
        {
          alt: DEFAULT_SOCIAL_IMAGE.alt,
          height: DEFAULT_SOCIAL_IMAGE.height,
          url: DEFAULT_SOCIAL_IMAGE.url,
          width: DEFAULT_SOCIAL_IMAGE.width,
        },
      ],
    })

    expect(metadata.robots).toEqual({
      follow: true,
      index: true,
      googleBot: { follow: true, index: true },
    })

    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'About — ITSEGHOSIME',
      description: 'Test page description',
      images: [DEFAULT_SOCIAL_IMAGE.url],
    })
  })

  it('sets robots to false when noIndex is true', () => {
    const metadata = createPageMetadata({
      description: 'Non-indexed preview page',
      noIndex: true,
      path: '/work',
      title: 'Work — ITSEGHOSIME',
    })

    expect(metadata.robots).toEqual({
      follow: false,
      index: false,
      googleBot: { follow: false, index: false },
    })
  })
})
