import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NoteDetail } from "@/components/notes/note-detail";
import { getHomePage } from "@/sanity/lib/home";
import {
  getNoteDetail,
  getNoteMetadata,
  getNoteSlugs,
} from "@/sanity/lib/notes";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteMetadata(slug);
  if (!note) return {};

  const title = note.seo?.title || note.title || "Technical note";
  const description = note.seo?.description || note.excerpt || undefined;
  const image = note.seo?.image || note.coverImage;

  return {
    title,
    description,
    robots: note.seo?.noIndex ? { follow: false, index: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      images: image?.url ? [{ alt: image.alt || title, url: image.url }] : undefined,
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const [site, data] = await Promise.all([getHomePage(), getNoteDetail(slug)]);

  if (!site || !data.note) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { "@type": "Person", name: data.note.author },
    datePublished: data.note.publishedAt,
    description: data.note.excerpt,
    headline: data.note.title,
    keywords: [...data.note.topics, ...data.note.technologies].join(", "),
  };

  return (
    <>
      <SiteHeader navigation={site.navigation} siteName={site.siteName} />
      <main className="py-10 sm:py-14 md:py-16" id="main-content">
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
          type="application/ld+json"
        />
        <NoteDetail data={data} />
      </main>
      <SiteFooter footerText={site.footerText} siteName={site.siteName} />
    </>
  );
}
