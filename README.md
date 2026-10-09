# Itseghosime Portfolio

The production portfolio of Abdulrahman Itseghosime Bello, available at [www.itseghosime.com](https://www.itseghosime.com). It combines a responsive Next.js application with a standalone Sanity Studio for projects, technical notes, experiments, profile information and site-wide SEO.

## Workspace

```text
portfolio-design/
├── web/      # Next.js portfolio frontend
└── sanity/   # Sanity Studio and content schemas
```

## Product capabilities

- Structured project documents for portfolio case studies
- Reorderable hero, narrative, contribution, media, process, code, sandbox, and outcome sections
- Notes, lab experiments, and career milestones
- A reusable technology library that connects evidence across the portfolio
- Singleton Profile and Site Settings documents
- Accessible images, reusable rich text, code blocks, navigation, and social links
- Page-specific and default SEO and social-sharing metadata
- A themed Sanity publishing workspace organised into Content, Library, and Settings
- Responsive editorial interfaces for the home, work, project, about, lab, notes and contact routes
- Interactive project case studies with media, code examples and responsive sandbox experiences
- Motion that progressively enhances desktop experiences while respecting reduced-motion preferences and mobile performance
- Draft preview and Visual Editing through Sanity Presentation
- Signed webhook revalidation for published content, sitemap and RSS updates
- Contact delivery and branded acknowledgement email through Resend
- Dynamic canonical metadata, Open Graph and Twitter cards, JSON-LD, sitemap, robots.txt and RSS
- Accessible loading, empty, error, form and not-found states
- Automated unit, integration, component, responsive E2E, accessibility, link, media and Lighthouse checks

## Technology

- Next.js 16 and React 19
- TypeScript and Tailwind CSS
- Sanity Content Lake and Studio
- GSAP and Lenis for progressive motion
- Vitest, Testing Library, Puppeteer, axe-core and Lighthouse

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

The web application expects the public Sanity project ID and dataset. Draft previews additionally require a server-only, read-only Sanity token. Production contact delivery and signed content revalidation require their corresponding server-only secrets; see [`web/.env.example`](./web/.env.example).

## Quality checks

Run the focused suites from the repository root:

```bash
npm run test:unit
npm run test:integration
npm run test:component
npm run test:coverage
npm run test:e2e
npm run test:accessibility
npm run test:quality
npm run test:lighthouse
```

Run the complete verification pipeline—including linting, both TypeScript projects, production builds and all automated suites—with:

```bash
npm run test:all
```

Browser-based suites build and start an isolated production server automatically. Set `TEST_BASE_URL` only when intentionally auditing an already-running deployment. Lighthouse JSON reports are written to `web/test-results/lighthouse/` and remain untracked.

The quality scripts use budgets as regression guards, not as a promise that every external Lighthouse run will always produce the same score. Network conditions, the test device and third-party responses can change individual measurements.

## Content workflow

Editors manage published projects, notes, lab entries, profile data and SEO in the standalone Studio. Sanity Presentation provides draft preview and click-to-edit overlays. Publishing triggers the signed revalidation endpoint so the website, sitemap and RSS feed receive current content without a manual redeploy.

Before publishing, verify titles, dates, technology names and descriptive alternative text. Use a 1200 × 630 social image for reliable link previews, and upload appropriately sized project media rather than original multi-megabyte source files.

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
