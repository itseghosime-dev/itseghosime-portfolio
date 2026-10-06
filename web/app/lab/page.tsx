import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {SiteFooter} from '@/components/layout/site-footer'
import {SiteHeader} from '@/components/layout/site-header'
import {Container} from '@/components/ui/container'
import {getHomePage} from '@/sanity/lib/home'

export const metadata: Metadata = {
  title: 'Lab | ITSEGHOSIME',
  description: 'Planned and active interface, automation and software experiments by Osi Itseghosime.',
}

export default async function LabPage() {
  const page = await getHomePage()
  if (!page) {
    notFound()
  }

  return (
    <>
      <SiteHeader navigation={page.navigation} siteName={page.siteName} />
      <main id="main-content">
        <Container className="grid gap-16 py-20 md:py-28">
          <header className="grid max-w-3xl gap-5">
            <p className="label-sm text-accent">Experiments &amp; R&amp;D</p>
            <h1 className="display-hero">Things I build when I&apos;m curious.</h1>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            {page.labExperiments.map((experiment, index) => (
              <article
                className="flex min-h-72 flex-col justify-between rounded-lg border border-black/[0.08] bg-surface-container p-6"
                key={experiment.slug}
              >
                <div className="flex justify-between gap-4 text-xs">
                  <span className="font-mono text-ink-muted">
                    EXP / {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-semibold text-accent">{experiment.status}</span>
                </div>
                <div>
                  <h2 className="font-serif text-2xl">{experiment.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{experiment.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  )
}
