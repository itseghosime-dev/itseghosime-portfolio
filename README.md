# Itseghosime Portfolio

The source for Abdulrahman Itseghosime Bello's developer portfolio. The project combines a Next.js frontend with a standalone Sanity Studio and a modular case-study content model.

## Workspace

```text
portfolio-design/
├── web/      # Next.js portfolio frontend
└── sanity/   # Sanity Studio and content schemas
```

## Current scope

- Structured project documents for portfolio case studies
- Reorderable hero, narrative, contribution, media, process, code, sandbox, and outcome sections
- Notes, lab experiments, and career milestones
- A reusable technology library that connects evidence across the portfolio
- Singleton Profile and Site Settings documents
- Accessible images, reusable rich text, code blocks, navigation, and social links
- Page-specific and default SEO and social-sharing metadata
- A themed Sanity publishing workspace organised into Content, Library, and Settings
- Next.js frontend foundation

## Local development

Install dependencies from the repository root:

```bash
npm install
```

Start the frontend:

```bash
npm run dev:web
```

Start Sanity Studio in a separate terminal:

```bash
npm run dev:studio
```

Local environment files are intentionally excluded from version control. Create the required `.env.local` files locally and never commit authentication tokens or API secrets.

### Contact delivery

The contact form posts to a server-only Next.js route and uses Resend's batch endpoint to send the
portfolio notification and a fixed acknowledgement email to the visitor together. Copy
`web/.env.example` to `web/.env.local`, then provide:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL` using a sender on a domain verified in Resend
- `CONTACT_TO_EMAIL` for the private inbox that should receive submissions

Without these values, the form remains visible, but real submissions return a
service-unavailable response instead of displaying a false success.

## Copyright and permitted access

This repository is public so recruiters and other developers can inspect the author's work and technical approach. It is not an open-source template and does not grant permission to reproduce, redistribute, sell, deploy, or publish a substantially similar portfolio.

See [LICENSE](./LICENSE) for the full notice.
