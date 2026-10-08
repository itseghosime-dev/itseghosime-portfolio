import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NotesArchive } from "@/components/notes/notes-archive";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo";
import { getHomePage } from "@/sanity/lib/home";
import { getNotesArchive } from "@/sanity/lib/notes";
import { getStaticPageSeo } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, siteSeo] = await Promise.all([
    getNotesArchive(),
    getStaticPageSeo(),
  ]);
  const title = page.seo?.title || "Technical notes on frontend engineering";
  const description =
    page.seo?.description ||
    "Practical notes on React, Next.js, interface architecture, accessibility, and frontend performance.";
  return createPageMetadata({
    defaultImage: siteSeo.settings?.defaultSeo?.image,
    description,
    image: page.seo?.image,
    noIndex:
      siteSeo.settings?.indexing !== "allow" || page.seo?.noIndex === true,
    path: "/notes",
    title,
  });
}

export default async function NotesPage() {
  const [site, archive] = await Promise.all([getHomePage(), getNotesArchive()]);

  if (!site) notFound();

  return (
    <>
      <SiteHeader navigation={site.navigation} siteName={site.siteName} />
      <main className="py-12 sm:py-16 md:py-20" id="main-content">
        <Container>
          <NotesArchive notes={archive.notes} page={archive.page} />
        </Container>
      </main>
      <SiteFooter footerText={site.footerText} siteName={site.siteName} />
    </>
  );
}
