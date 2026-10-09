import { describe, expect, it } from 'vitest'
import { absoluteUrl, SITE_NAME, SITE_URL } from './site'

describe('site utilities', () => {
  it('exports correct site name and url constants', () => {
    expect(SITE_NAME).toBe('ITSEGHOSIME')
    expect(SITE_URL).toBe('https://www.itseghosime.com')
  })

  it('constructs absolute URLs for root and nested paths', () => {
    expect(absoluteUrl('/')).toBe('https://www.itseghosime.com/')
    expect(absoluteUrl('/work')).toBe('https://www.itseghosime.com/work')
    expect(absoluteUrl('/work/skinny-cans')).toBe('https://www.itseghosime.com/work/skinny-cans')
    expect(absoluteUrl('/notes/multilingual-routing-next-intl')).toBe(
      'https://www.itseghosime.com/notes/multilingual-routing-next-intl',
    )
  })

  it('handles paths with query parameters and hash anchors', () => {
    expect(absoluteUrl('/work?filter=web')).toBe('https://www.itseghosime.com/work?filter=web')
    expect(absoluteUrl('/#contact')).toBe('https://www.itseghosime.com/#contact')
  })

  it('handles relative paths without leading slash cleanly', () => {
    expect(absoluteUrl('about')).toBe('https://www.itseghosime.com/about')
  })
})

