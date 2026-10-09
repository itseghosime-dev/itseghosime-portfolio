import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CopyEmail } from './copy-email'

describe('CopyEmail component', () => {
  it('renders the email address and initial "Click to copy" state', () => {
    render(<CopyEmail email="info.itseghosime@gmail.com" />)

    expect(screen.getByText('info.itseghosime@gmail.com')).toBeDefined()
    expect(screen.getByText('Click to copy')).toBeDefined()
  })

  it('copies the email address to clipboard and displays success feedback', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      configurable: true,
      value: { writeText: writeTextSpy },
    })

    render(<CopyEmail email="info.itseghosime@gmail.com" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(writeTextSpy).toHaveBeenCalledWith('info.itseghosime@gmail.com')

    await waitFor(() => {
      expect(screen.getByText('Email address copied to clipboard.')).toBeDefined()
    })
    expect(screen.getByText(/^Copied/)).toBeDefined()
  })

  it('handles clipboard failure gracefully with accessible error message', async () => {
    const writeTextSpy = vi.fn().mockRejectedValue(new Error('Permission denied'))
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      configurable: true,
      value: { writeText: writeTextSpy },
    })

    render(<CopyEmail email="info.itseghosime@gmail.com" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Copy failed. Use the email link instead.')).toBeDefined()
    })
  })
})
