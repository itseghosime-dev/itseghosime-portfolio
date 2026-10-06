import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {SiteFooter} from '@/components/layout/site-footer'
import {SiteHeader} from '@/components/layout/site-header'
import {ArchiveContactSection} from '@/components/work/archive-contact-section'
import {WorkArchive} from '@/components/work/work-archive'
import {getHomePage} from '@/sanity/lib/home'
import {getWorkArchive} from '@/sanity/lib/work'
import type {ArchiveFilter} from '@/types/work'

export const metadata: Metadata = {
  title: 'Work Archive',
  description:
    'Selected frontend projects, product work and technical experiments by Abdulrahman Itseghosime Bello.',
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{filter?: string}>
}) {
  const {filter} = await searchParams
  const [page, entries] = await Promise.all([getHomePage(), getWorkArchive()])
  const initialFilter: ArchiveFilter =
    filter === 'client' || filter === 'web' || filter === 'experimental' ? filter : 'all'

  if (!page) {
    notFound()
  }

  const navigation = page.navigation.map((item) =>
    item.href === '/#contact' ? {...item, href: '#contact'} : item,
  )

  return (
    <>
      <SiteHeader contactHref="#contact" navigation={navigation} siteName={page.siteName} />
      <main id="main-content">
        <WorkArchive entries={entries} initialFilter={initialFilter} />
        <ArchiveContactSection contact={page.contact} />
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  )
}
