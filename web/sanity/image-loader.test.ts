import { describe, expect, it } from 'vitest'
import sanityImageLoader from './image-loader'

describe('Sanity image loader', () => {
  it('formats sanity CDN URLs with auto, fit, quality, and width parameters', () => {
    const src = 'https://cdn.sanity.io/images/s3e4rrk9/production/abcd1234-1280x800.png'
    const result = sanityImageLoader({
      quality: 85,
      src,
      width: 1080,
    })

    const url = new URL(result)
    expect(url.origin).toBe('https://cdn.sanity.io')
    expect(url.pathname).toBe('/images/s3e4rrk9/production/abcd1234-1280x800.png')
    expect(url.searchParams.get('auto')).toBe('format')
    expect(url.searchParams.get('fit')).toBe('max')
    expect(url.searchParams.get('q')).toBe('85')
    expect(url.searchParams.get('w')).toBe('1080')
  })

  it('uses default quality 80 when quality is omitted or undefined', () => {
    const src = 'https://cdn.sanity.io/images/s3e4rrk9/production/abcd1234-1280x800.png'
    const result = sanityImageLoader({
      src,
      width: 640,
    })

    const url = new URL(result)
    expect(url.searchParams.get('q')).toBe('80')
    expect(url.searchParams.get('w')).toBe('640')
  })

  it('returns non-sanity image URLs unaltered', () => {
    const localSrc = '/images/local-asset.png'
    expect(sanityImageLoader({ src: localSrc, width: 400 })).toBe(localSrc)

    const externalSrc = 'https://example.com/other-image.jpg'
    expect(sanityImageLoader({ src: externalSrc, width: 800 })).toBe(externalSrc)
  })
})
