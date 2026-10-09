import { describe, expect, it } from 'vitest'
import { createNotesRss, type RssNote } from './rss'

describe('RSS feed generator', () => {
  it('generates valid RSS XML structure with valid notes', () => {
    const notes: RssNote[] = [
      {
        _updatedAt: '2026-03-01T12:00:00Z',
        excerpt: 'Understanding layout shifts caused by web fonts in Next.js.',
        publishedAt: '2026-02-15T10:00:00Z',
        slug: 'font-layout-shift-nextjs',
        title: 'Font Layout Shifts in Next.js',
      },
    ]

    const xml = createNotesRss(notes)

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
    expect(xml).toContain('<title>ITSEGHOSIME — Technical Notes</title>')
    expect(xml).toContain('<link>https://www.itseghosime.com/notes</link>')
    expect(xml).toContain('<title>Font Layout Shifts in Next.js</title>')
    expect(xml).toContain('<link>https://www.itseghosime.com/notes/font-layout-shift-nextjs</link>')
    expect(xml).toContain(
      '<guid isPermaLink="true">https://www.itseghosime.com/notes/font-layout-shift-nextjs</guid>',
    )
    expect(xml).toContain('Understanding layout shifts caused by web fonts in Next.js.')
  })

  it('filters out notes missing title, slug, or publishedAt', () => {
    const notes: RssNote[] = [
      {
        _updatedAt: '2026-03-01T12:00:00Z',
        excerpt: 'Missing slug note',
        publishedAt: '2026-02-15T10:00:00Z',
        slug: null,
        title: 'Draft Note Without Slug',
      },
      {
        _updatedAt: '2026-03-01T12:00:00Z',
        excerpt: 'Missing title note',
        publishedAt: '2026-02-15T10:00:00Z',
        slug: 'missing-title',
        title: null,
      },
      {
        _updatedAt: '2026-03-01T12:00:00Z',
        excerpt: 'Unpublished note',
        publishedAt: null,
        slug: 'unpublished-note',
        title: 'Unpublished Note',
      },
    ]

    const xml = createNotesRss(notes)

    expect(xml).not.toContain('<item>')
    expect(xml).not.toContain('Draft Note Without Slug')
    expect(xml).not.toContain('Unpublished Note')
  })

  it('escapes XML special characters in titles, descriptions, and excerpts', () => {
    const notes: RssNote[] = [
      {
        _updatedAt: '2026-03-01T12:00:00Z',
        excerpt: 'A & B <test> "quotes" \'apostrophe\'',
        publishedAt: '2026-02-15T10:00:00Z',
        slug: 'xml-escaping-test',
        title: 'React & Next.js: <Component> "Patterns"',
      },
    ]

    const xml = createNotesRss(notes)

    expect(xml).toContain('React &amp; Next.js: &lt;Component&gt; &quot;Patterns&quot;')
    expect(xml).toContain('A &amp; B &lt;test&gt; &quot;quotes&quot; &apos;apostrophe&apos;')
  })

  it('handles empty notes list without crashing', () => {
    const xml = createNotesRss([])
    expect(xml).toContain('<title>ITSEGHOSIME — Technical Notes</title>')
    expect(xml).not.toContain('<item>')
  })
})

