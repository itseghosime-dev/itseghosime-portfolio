import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './site-footer'

describe('SiteFooter component', () => {
  it('renders copyright with current year and site name', () => {
    const currentYear = new Date().getFullYear()
    render(<SiteFooter siteName="ITSEGHOSIME" />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeDefined()
    expect(screen.getByText(new RegExp(`© ${currentYear} ITSEGHOSIME`))).toBeDefined()
  })

  it('renders default footer text when footerText is not provided', () => {
    render(<SiteFooter siteName="ITSEGHOSIME" />)
    expect(screen.getByText('Built with intent · Accessible by default')).toBeDefined()
  })

  it('renders custom footer text when provided', () => {
    render(<SiteFooter footerText="Custom Crafted Engineering" siteName="ITSEGHOSIME" />)
    expect(screen.getByText('Custom Crafted Engineering')).toBeDefined()
  })
})
