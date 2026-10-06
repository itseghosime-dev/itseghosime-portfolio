import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {SiteFooter} from '@/components/layout/site-footer'
import {SiteHeader} from '@/components/layout/site-header'
import {Container} from '@/components/ui/container'
import {getHomePage} from '@/sanity/lib/home'

export const metadata: Metadata = {
  title: 'About | ITSEGHOSIME',
  description: 'Background, working principles and professional focus of Osi Itseghosime.',
}

export default async function AboutPage() {
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
            <p className="label-sm text-accent">About</p>
            <h1 className="display-hero">I&apos;m Osi.</h1>
          </header>

          <div className="grid max-w-3xl gap-7">
            {page.about.paragraphs.map((paragraph) => (
              <p className="font-serif text-2xl leading-relaxed text-ink-soft md:text-3xl" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {page.about.principles.length > 0 ? (
            <section className="grid max-w-3xl gap-6 border-t border-black/[0.08] pt-12">
              <h2 className="headline-md">Working principles</h2>
              <ul className="m-0 grid list-none gap-0 p-0">
                {page.about.principles.map((principle) => (
                  <li className="border-b border-black/[0.08] py-5 text-ink-soft" key={principle}>
                    {principle}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  )
}
