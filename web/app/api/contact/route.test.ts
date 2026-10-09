import { NextRequest } from 'next/server'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST } from './route'

describe('Contact API route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.CONTACT_FROM_EMAIL = 'ITSEGHOSIME <contact@itseghosime.com>'
    process.env.CONTACT_TO_EMAIL = 'info.itseghosime@gmail.com'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.itseghosime.com'
  })

  it('rejects malformed json body with 400', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: 'invalid-json-content',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toBe('Invalid request body.')
  })

  it('silently ignores honeypot spam submissions with ok: true and no external call', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Bot User',
        email: 'bot@example.com',
        category: 'Project',
        message: 'This is an automated spam message that filled the hidden field.',
        website: 'https://spam-link.com',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.ok).toBe(true)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns 422 for invalid email or short message', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane',
        email: 'not-an-email',
        category: 'Job opportunity',
        message: 'Too short',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(422)
    const json = await response.json()
    expect(json.error).toBe('Please complete all required fields.')
  })

  it('returns 503 when email delivery service is unconfigured', async () => {
    delete process.env.RESEND_API_KEY

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        category: 'Job opportunity',
        message: 'Valid message exceeding minimum character requirements.',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(503)
  })

  it('delivers valid contact message through Resend batch API mock', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ id: 'email-1' }, { id: 'email-2' }] }),
    })
    global.fetch = mockFetch

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        category: 'Job opportunity',
        company: 'Innovate Design',
        message: 'We are very impressed by your portfolio and would love to connect about an opportunity.',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.ok).toBe(true)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails/batch',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-resend-key',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('returns 504 on delivery timeout', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Timeout'))

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        category: 'Job opportunity',
        message: 'Valid message exceeding minimum character requirements.',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(504)
    const json = await response.json()
    expect(json.error).toBe('Message delivery timed out.')
  })
})
