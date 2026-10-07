import {createHash} from 'node:crypto'

import {NextResponse, type NextRequest} from 'next/server'

import {buildContactEmailBatch} from '@/lib/email/contact-emails'

type ContactPayload = {
  category?: unknown
  company?: unknown
  email?: unknown
  fullName?: unknown
  message?: unknown
  website?: unknown
}

const limits = {
  category: 50,
  company: 120,
  email: 254,
  fullName: 100,
  message: 4000,
} as const

const contactCategories = new Set([
  'Collaboration',
  'Freelance / Contract',
  'Job opportunity',
  'Other',
  'Project',
])

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload

  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return NextResponse.json({ok: true})
  }

  const category = clean(payload.category, limits.category)
  const company = clean(payload.company, limits.company)
  const email = clean(payload.email, limits.email)
  const fullName = clean(payload.fullName, limits.fullName)
  const message = clean(payload.message, limits.message)

  if (
    fullName.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    message.length < 20 ||
    !contactCategories.has(category)
  ) {
    return NextResponse.json({error: 'Please complete all required fields.'}, {status: 422})
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !fromEmail || !toEmail) {
    return NextResponse.json({error: 'Contact delivery is not configured.'}, {status: 503})
  }

  const idempotencyKey = createHash('sha256')
    .update(`${new Date().toISOString().slice(0, 10)}\0${email}\0${category}\0${message}`)
    .digest('hex')
  const emails = buildContactEmailBatch(
    {category, company, email, fullName, message},
    {
      fromEmail,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin,
      toEmail,
    },
  )

  let response: Response

  try {
    response = await fetch('https://api.resend.com/emails/batch', {
      body: JSON.stringify(emails),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `portfolio-contact/${idempotencyKey}`,
      },
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return NextResponse.json({error: 'Message delivery timed out.'}, {status: 504})
  }

  if (!response.ok) {
    return NextResponse.json({error: 'Message delivery failed.'}, {status: 502})
  }

  return NextResponse.json({ok: true})
}
