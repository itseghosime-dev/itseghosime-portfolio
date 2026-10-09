import { describe, expect, it, vi } from 'vitest'

vi.mock('./live', () => ({
  sanityFetch: vi.fn(),
  SanityLive: () => null,
}))

import { getNextProject } from './project'

describe('project navigation helper', () => {
  const sampleNavigation: Parameters<typeof getNextProject>[1] = [
    { _id: 'proj-1', title: 'Skinny Cans', slug: 'skinny-cans', subtitle: null, projectType: 'website', coverImage: null },
    { _id: 'proj-2', title: 'Rawlab Ventures', slug: 'rawlab-ventures', subtitle: null, projectType: 'website', coverImage: null },
    { _id: 'proj-3', title: 'Genius Hub', slug: 'genius-hub', subtitle: null, projectType: 'website', coverImage: null },
  ]

  it('returns the next project in the list', () => {
    const next = getNextProject('proj-1', sampleNavigation)
    expect(next?._id).toBe('proj-2')
    expect(next?.slug).toBe('rawlab-ventures')
  })

  it('loops back to the first project when at the end of the list', () => {
    const next = getNextProject('proj-3', sampleNavigation)
    expect(next?._id).toBe('proj-1')
    expect(next?.slug).toBe('skinny-cans')
  })

  it('returns null when the projectId is not found', () => {
    const next = getNextProject('unknown-id', sampleNavigation)
    expect(next).toBeNull()
  })

  it('returns null when there are fewer than 2 projects', () => {
    const single: Parameters<typeof getNextProject>[1] = [
      { _id: 'proj-1', title: 'Skinny Cans', slug: 'skinny-cans', subtitle: null, projectType: 'website', coverImage: null },
    ]
    expect(getNextProject('proj-1', single)).toBeNull()
    expect(getNextProject('proj-1', [])).toBeNull()
  })
})
