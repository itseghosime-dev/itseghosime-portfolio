import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ContactForm } from './contact-form'

describe('ContactForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields with labels and submit button', () => {
    render(<ContactForm email="test@example.com" />)

    expect(screen.getByLabelText(/Full name/i)).toBeDefined()
    expect(screen.getByLabelText(/Email address/i)).toBeDefined()
    expect(screen.getByLabelText(/Organization/i)).toBeDefined()
    expect(screen.getByLabelText(/^Message/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Send dispatch/i })).toBeDefined()
  })

  it('validates required fields before submitting', async () => {
    const user = userEvent.setup()
    render(<ContactForm email="test@example.com" />)

    const submitButton = screen.getByRole('button', { name: /Send dispatch/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Enter at least two characters.')).toBeDefined()
      expect(screen.getByText('Enter a valid email address.')).toBeDefined()
      expect(screen.getByText('Add at least 20 characters so I have enough context.')).toBeDefined()
    })
  })

  it('submits form successfully and displays success feedback without sending real emails', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    global.fetch = mockFetch

    render(<ContactForm email="test@example.com" />)

    await user.type(screen.getByLabelText(/Full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/Email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/Organization/i), 'Design Studio')
    await user.type(
      screen.getByLabelText(/^Message/i),
      'We would love to discuss a prospective senior frontend design system engineering contract with your team.',
    )

    const submitButton = screen.getByRole('button', { name: /Send dispatch/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      expect(screen.getByText('Message sent.')).toBeDefined()
      expect(screen.getByText(/Thanks for reaching out/i)).toBeDefined()
    })
  })

  it('handles server errors and retains form entries for retry', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Service temporarily unavailable' }),
    })
    global.fetch = mockFetch

    render(<ContactForm email="test@example.com" />)

    await user.type(screen.getByLabelText(/Full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/Email address/i), 'jane@example.com')
    await user.type(
      screen.getByLabelText(/^Message/i),
      'We would love to discuss a prospective senior frontend engineering contract.',
    )

    const submitButton = screen.getByRole('button', { name: /Send dispatch/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('That didn’t go through.')).toBeDefined()
      expect(screen.getByRole('button', { name: /Try again/i })).toBeDefined()
    })

    // Click retry to verify form entries are restored
    const retryButton = screen.getByRole('button', { name: /Try again/i })
    await user.click(retryButton)

    expect(screen.getByDisplayValue('Jane Doe')).toBeDefined()
    expect(screen.getByDisplayValue('jane@example.com')).toBeDefined()
  })
})
