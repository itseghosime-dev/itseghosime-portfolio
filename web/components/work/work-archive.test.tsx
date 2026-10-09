import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WorkArchive } from './work-archive'
import type { ArchiveEntry } from '@/types/work'

describe('WorkArchive component', () => {
  const sampleEntries: ArchiveEntry[] = [
    {
      id: 'proj-1',
      kind: 'project',
      slug: 'skinny-cans',
      title: 'Skinny Cans',
      subtitle: 'Accessible e-commerce experience',
      href: '/work/skinny-cans',
      categories: ['client', 'web'],
      type: 'E-commerce & Web',
      year: 2025,
      status: 'Live',
      role: 'Lead Frontend Engineer',
      technologies: ['React', 'Next.js', 'Tailwind CSS'],
    },
    {
      id: 'proj-2',
      kind: 'project',
      slug: 'rawlab-ventures',
      title: 'Rawlab Ventures',
      subtitle: 'Brand and digital presence',
      href: '/work/rawlab-ventures',
      categories: ['web'],
      type: 'Corporate Website',
      year: 2024,
      status: 'Live',
      role: 'Creative Engineer',
      technologies: ['TypeScript', 'GSAP'],
    },
    {
      id: 'exp-1',
      kind: 'lab',
      slug: 'kinetic-typography',
      title: 'Kinetic Typography',
      subtitle: 'WebGL type simulation',
      href: '/lab#kinetic-typography',
      categories: ['experimental'],
      type: 'Creative Interaction',
      year: 2025,
      status: 'Experiment',
      role: 'Creative Technologist',
      technologies: ['Canvas API', 'WebGL'],
    },
  ]

  it('renders all archive entries initially under "All" filter', () => {
    render(<WorkArchive entries={sampleEntries} />)

    expect(screen.getByText('Skinny Cans')).toBeDefined()
    expect(screen.getByText('Rawlab Ventures')).toBeDefined()
    expect(screen.getByText('Kinetic Typography')).toBeDefined()
  })

  it('filters entries when a category button is clicked', async () => {
    const user = userEvent.setup()
    render(<WorkArchive entries={sampleEntries} />)

    const clientFilter = screen.getByRole('button', { name: /Client work/i })
    await user.click(clientFilter)

    expect(screen.getByText('Skinny Cans')).toBeDefined()
    expect(screen.queryByText('Rawlab Ventures')).toBeNull()
    expect(screen.queryByText('Kinetic Typography')).toBeNull()
  })

  it('switches between Visual and Index views', async () => {
    const user = userEvent.setup()
    render(<WorkArchive entries={sampleEntries} />)

    const indexButtons = screen.getAllByRole('button', { name: /^index$/i })
    await user.click(indexButtons[0])

    // In Index view, case study links appear
    const caseStudyLinks = screen.getAllByRole('link', { name: /Full case study/i })
    expect(caseStudyLinks.length).toBeGreaterThan(0)
  })

  it('filters entries via search input and shows empty state when no match is found', async () => {
    const user = userEvent.setup()
    render(<WorkArchive entries={sampleEntries} />)

    const searchInput = screen.getByPlaceholderText('Search work...')
    await user.type(searchInput, 'NonExistentTech')

    await waitFor(() => {
      expect(screen.getByText('Nothing here yet.')).toBeDefined()
      expect(screen.getByRole('button', { name: /Clear filters/i })).toBeDefined()
    })

    // Clear filters button restores entries
    const clearButton = screen.getByRole('button', { name: /Clear filters/i })
    await user.click(clearButton)

    expect(screen.getByText('Skinny Cans')).toBeDefined()
  })
})
