import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NotesArchive } from "@/components/notes/notes-archive";
import { Container } from "@/components/ui/container";
import { getHomePage } from "@/sanity/lib/home";
import { getNotesArchive } from "@/sanity/lib/notes";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getNotesArchive();
  const title = page.seo?.title || "Technical notes on frontend engineering";
  const description =
    page.seo?.description ||
    "Practical notes on React, Next.js, interface architecture, accessibility, and frontend performance.";

  return {
    title,
    description,
    robots: page.seo?.noIndex ? { follow: false, index: false } : undefined,
    openGraph: {
      title,
      description,
      images: page.seo?.image?.url
        ? [{ alt: page.seo.image.alt, url: page.seo.image.url }]
        : undefined,
    },
  };
}

export default async function NotesPage() {
  const [site, archive] = await Promise.all([
    getHomePage(),
    getNotesArchive(),
  ]);

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
