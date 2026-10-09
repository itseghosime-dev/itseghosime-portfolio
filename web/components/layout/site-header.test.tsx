import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './site-header'

describe('SiteHeader component', () => {
  const navigation = [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Lab', href: '/lab' },
    { label: 'Notes', href: '/notes' },
    { label: 'GitHub', href: 'https://github.com/itseghosime' },
  ]

  it('renders site title/logo linking to homepage with accessible name', () => {
    render(<SiteHeader navigation={navigation} siteName="ITSEGHOSIME" />)

    const homeLink = screen.getByRole('link', { name: /ITSEGHOSIME, home/i })
    expect(homeLink).toBeDefined()
    expect(homeLink.getAttribute('href')).toBe('/')
  })

  it('renders primary navigation with accessible label and correct links', () => {
    render(<SiteHeader navigation={navigation} siteName="ITSEGHOSIME" />)

    const nav = screen.getByRole('navigation', { name: /Primary navigation/i })
    expect(nav).toBeDefined()

    expect(screen.getByRole('link', { name: 'Work' }).getAttribute('href')).toBe('/work')
    expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/about')
    expect(screen.getByRole('link', { name: 'Lab' }).getAttribute('href')).toBe('/lab')
    expect(screen.getByRole('link', { name: 'Notes' }).getAttribute('href')).toBe('/notes')
  })

  it('renders external links with target="_blank" and rel="noreferrer"', () => {
    render(<SiteHeader navigation={navigation} siteName="ITSEGHOSIME" />)

    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink.getAttribute('target')).toBe('_blank')
    expect(githubLink.getAttribute('rel')).toBe('noreferrer')
  })

  it('renders the "Get in touch" CTA button', () => {
    render(<SiteHeader contactHref="/contact" navigation={navigation} siteName="ITSEGHOSIME" />)

    const contactLink = screen.getByRole('link', { name: /Get in touch/i })
    expect(contactLink.getAttribute('href')).toBe('/contact')
  })
})

