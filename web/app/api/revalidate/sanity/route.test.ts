import { NextRequest } from 'next/server'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST } from './route'
import * as webhookModule from 'next-sanity/webhook'
import * as cacheModule from 'next/cache'

vi.mock('next-sanity/webhook', () => ({
  parseBody: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Sanity revalidation webhook API route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.SANITY_REVALIDATE_SECRET
  })

  it('returns 503 if SANITY_REVALIDATE_SECRET is not configured', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate/sanity', {
      method: 'POST',
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(503)
    expect(json.error).toBe('Sanity revalidation is not configured.')
  })

  it('returns 401 when webhook signature is invalid', async () => {
    process.env.SANITY_REVALIDATE_SECRET = 'test-secret'
    vi.mocked(webhookModule.parseBody).mockResolvedValueOnce({
      body: {},
      isValidSignature: false,
    } as { body: Record<string, unknown>; isValidSignature: boolean })

    const request = new NextRequest('http://localhost:3000/api/revalidate/sanity', {
      method: 'POST',
      body: JSON.stringify({ _type: 'project' }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Invalid webhook signature.')
    expect(cacheModule.revalidatePath).not.toHaveBeenCalled()
  })

  it('revalidates paths and returns 200 when signature is valid', async () => {
    process.env.SANITY_REVALIDATE_SECRET = 'test-secret'
    vi.mocked(webhookModule.parseBody).mockResolvedValueOnce({
      body: { _type: 'project' },
      isValidSignature: true,
    } as { body: Record<string, unknown>; isValidSignature: boolean })

    const request = new NextRequest('http://localhost:3000/api/revalidate/sanity', {
      method: 'POST',
      body: JSON.stringify({ _type: 'project' }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ revalidated: true, type: 'project' })
    expect(cacheModule.revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(cacheModule.revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
    expect(cacheModule.revalidatePath).toHaveBeenCalledWith('/feed.xml')
  })

  it('never leaks the revalidation secret in error or success responses', async () => {
    process.env.SANITY_REVALIDATE_SECRET = 'super-secret-key-12345'
    vi.mocked(webhookModule.parseBody).mockRejectedValueOnce(new Error('Signature failure'))

    const request = new NextRequest('http://localhost:3000/api/revalidate/sanity', {
      method: 'POST',
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(JSON.stringify(json)).not.toContain('super-secret-key-12345')
  })
})
