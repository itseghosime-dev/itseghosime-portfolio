import { describe, expect, it } from 'vitest'
import { buildContactEmailBatch, type ContactEmailInput } from './contact-emails'

describe('contact email batch builder', () => {
  const sampleInput: ContactEmailInput = {
    category: 'Job opportunity',
    company: 'Acme Design Corp',
    email: 'recruiter@acme.com',
    fullName: 'Jane Recruiter',
    message: 'We are looking for a senior creative frontend engineer for a key design system initiative.',
  }

  const addresses = {
    fromEmail: 'ITSEGHOSIME Portfolio <contact@itseghosime.com>',
    siteUrl: 'https://www.itseghosime.com',
    toEmail: 'info.itseghosime@gmail.com',
  }

  it('builds owner notification and visitor acknowledgement emails', () => {
    const [ownerEmail, visitorEmail] = buildContactEmailBatch(sampleInput, addresses)

    // Owner notification assertions
    expect(ownerEmail.from).toBe(addresses.fromEmail)
    expect(ownerEmail.to).toEqual([addresses.toEmail])
    expect(ownerEmail.reply_to).toBe(sampleInput.email)
    expect(ownerEmail.subject).toBe('Job opportunity: message from Jane Recruiter')
    expect(ownerEmail.html).toContain('Jane Recruiter')
    expect(ownerEmail.html).toContain('recruiter@acme.com')
    expect(ownerEmail.html).toContain('Acme Design Corp')
    expect(ownerEmail.text).toContain(sampleInput.message)

    // Visitor acknowledgement assertions
    expect(visitorEmail.from).toBe(addresses.fromEmail)
    expect(visitorEmail.to).toEqual([sampleInput.email])
    expect(visitorEmail.reply_to).toBe(addresses.toEmail)
    expect(visitorEmail.subject).toBe('Thanks for reaching out — ITSEGHOSIME')
    expect(visitorEmail.html).toContain('Thank you for reaching out, Jane.')
    expect(visitorEmail.text).toContain('Hi Jane,')
  })

  it('handles submission without company name cleanly', () => {
    const inputWithoutCompany: ContactEmailInput = {
      ...sampleInput,
      company: '',
    }

    const [ownerEmail] = buildContactEmailBatch(inputWithoutCompany, addresses)
    expect(ownerEmail.subject).toBe('Job opportunity: message from Jane Recruiter')
    expect(ownerEmail.html).toContain('Not supplied')
  })

  it('properly escapes HTML special characters in inputs to prevent injection', () => {
    const maliciousInput: ContactEmailInput = {
      category: 'Other',
      company: '<script>alert("company")</script>',
      email: 'hacker@example.com',
      fullName: 'Evil <User> & Co',
      message: '<img src=x onerror=alert(1)> & "test" \'quotes\'',
    }

    const [ownerEmail, visitorEmail] = buildContactEmailBatch(maliciousInput, addresses)

    expect(ownerEmail.html).not.toContain('<script>')
    expect(ownerEmail.html).toContain('&lt;script&gt;')
    expect(ownerEmail.html).toContain('Evil &lt;User&gt; &amp; Co')
    expect(ownerEmail.html).toContain('&lt;img src=x onerror=alert(1)&gt;')

    // Visitor email addresses visitor by first name ('Evil')
    expect(visitorEmail.html).toContain('Thank you for reaching out, Evil.')
  })
})
