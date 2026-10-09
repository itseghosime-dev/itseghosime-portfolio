import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MobileNavigation } from './mobile-navigation'

describe('MobileNavigation component', () => {
  const navigation = [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Lab', href: '/lab' },
    { label: 'Notes', href: '/notes' },
    { label: 'Contact', href: '/contact' },
  ]

  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    // Mock matchMedia to handle prefers-reduced-motion: reduce
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    document.body.style.overflow = ''
  })

  it('renders trigger button with accessible label and aria-expanded=false initially', () => {
    render(<MobileNavigation navigation={navigation} siteName="ITSEGHOSIME" />)

    const trigger = screen.getByRole('button', { name: /Open navigation menu/i })
    expect(trigger).toBeDefined()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('opens dialog on trigger click and displays navigation links', async () => {
    const user = userEvent.setup()
    render(<MobileNavigation navigation={navigation} siteName="ITSEGHOSIME" />)

    const trigger = screen.getByRole('button', { name: /Open navigation menu/i })
    await user.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const dialog = screen.getByRole('dialog', { name: /Mobile navigation/i })
    expect(dialog).toBeDefined()

    expect(screen.getByRole('link', { name: /Work/i })).toBeDefined()
    expect(screen.getByRole('link', { name: /About/i })).toBeDefined()
  })

  it('closes dialog and restores body scroll when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileNavigation navigation={navigation} siteName="ITSEGHOSIME" />)

    const trigger = screen.getByRole('button', { name: /Open navigation menu/i })
    await user.click(trigger)

    expect(document.body.style.overflow).toBe('hidden')

    const closeButton = screen.getByRole('button', { name: /Close navigation menu/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Mobile navigation/i })).toBeNull()
    })
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('closes dialog on Escape key press', async () => {
    const user = userEvent.setup()
    render(<MobileNavigation navigation={navigation} siteName="ITSEGHOSIME" />)

    const trigger = screen.getByRole('button', { name: /Open navigation menu/i })
    await user.click(trigger)

    expect(screen.getByRole('dialog', { name: /Mobile navigation/i })).toBeDefined()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Mobile navigation/i })).toBeNull()
    })
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
