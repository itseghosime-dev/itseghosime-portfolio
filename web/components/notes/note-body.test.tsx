import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NoteBody } from './note-body'
import type { NoteBodyBlock, NoteHeading } from '@/types/notes'

describe('NoteBody Portable Text component', () => {
  const headings: NoteHeading[] = [
    { id: 'introduction', level: 2, title: 'Introduction' },
    { id: 'performance-impact', level: 3, title: 'Performance Impact' },
  ]

  const sampleBlocks = [
    {
      _key: 'b1',
      _type: 'block',
      children: [{ _key: 'c1', _type: 'span', marks: [], text: 'Introduction' }],
      markDefs: [],
      style: 'h2',
    },
    {
      _key: 'b2',
      _type: 'block',
      children: [
        {
          _key: 'c2',
          _type: 'span',
          marks: [],
          text: 'Layout shifts can cause unexpected visual jumps during font swapping.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _key: 'b3',
      _type: 'block',
      children: [
        {
          _key: 'c3',
          _type: 'span',
          marks: [],
          text: 'Web font optimization is critical for Core Web Vitals.',
        },
      ],
      markDefs: [],
      style: 'blockquote',
    },
    {
      _key: 'b4',
      _type: 'codeBlock',
      code: 'export const font = Inter({ subsets: ["latin"] });',
      filename: 'fonts.ts',
      language: 'typescript',
    },
  ]

  it('renders headings with correct anchor IDs and semantic elements', () => {
    render(<NoteBody body={sampleBlocks as unknown as NoteBodyBlock[]} headings={headings} />)

    const h2 = screen.getByRole('heading', { level: 2, name: 'Introduction' })
    expect(h2).toBeDefined()
    expect(h2.getAttribute('id')).toBe('introduction')
  })

  it('renders normal paragraphs and blockquotes correctly', () => {
    render(<NoteBody body={sampleBlocks as unknown as NoteBodyBlock[]} headings={headings} />)

    expect(
      screen.getByText('Layout shifts can cause unexpected visual jumps during font swapping.'),
    ).toBeDefined()
    expect(
      screen.getByText('Web font optimization is critical for Core Web Vitals.'),
    ).toBeDefined()
  })

  it('renders code blocks with code panel and syntax content', () => {
    render(<NoteBody body={sampleBlocks as unknown as NoteBodyBlock[]} headings={headings} />)

    expect(screen.getByText('fonts.ts')).toBeDefined()
    const preElement = screen.getByRole('button', { name: /Copy code/i }).closest('figure')?.querySelector('pre')
    expect(preElement?.textContent).toContain('export const font = Inter')
  })

  it('handles unknown blocks gracefully without throwing errors', () => {
    const blocksWithUnknown = [
      ...sampleBlocks,
      { _key: 'unknown-1', _type: 'unrecognizedCustomBlockType' },
    ] as unknown as NoteBodyBlock[]

    expect(() => render(<NoteBody body={blocksWithUnknown} headings={headings} />)).not.toThrow()
  })
})
