import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NoteDetail } from "@/components/notes/note-detail";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { resolveSocialImage } from "@/lib/seo";
import { getHomePage } from "@/sanity/lib/home";
import { getStaticPageSeo } from "@/sanity/lib/seo";
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
  const [note, siteSeo] = await Promise.all([
    getNoteMetadata(slug),
    getStaticPageSeo(),
  ]);
  if (!note) return {};

  const title = note.seo?.title || note.title || "Technical note";
  const description = note.seo?.description || note.excerpt || undefined;
  const image = resolveSocialImage(
    note.seo?.image || note.coverImage,
    siteSeo.settings?.defaultSeo?.image,
  );
  const canonicalPath = `/notes/${slug}`;
  const shouldIndex =
    siteSeo.settings?.indexing === "allow" && note.seo?.noIndex !== true;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: {
      follow: shouldIndex,
      index: shouldIndex,
      googleBot: { follow: shouldIndex, index: shouldIndex },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      publishedTime: note.publishedAt ?? undefined,
      modifiedTime: note._updatedAt,
      authors: ["Abdulrahman Itseghosime Bello"],
      images: [
        {
          alt: image.alt || title,
          height: image.height,
          url: image.url,
          width: image.width,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
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
    dateModified: data.note.updatedAt,
    description: data.note.excerpt,
    headline: data.note.title,
    image: data.note.socialImage?.url,
    keywords: [...data.note.topics, ...data.note.technologies].join(", "),
    mainEntityOfPage: absoluteUrl(`/notes/${data.note.slug}`),
    publisher: {
      "@type": "Person",
      name: data.note.author,
      url: SITE_URL,
    },
    url: absoluteUrl(`/notes/${data.note.slug}`),
  };

  return (
    <>
      <SiteHeader navigation={site.navigation} siteName={site.siteName} />
      <main className="py-10 sm:py-14 md:py-16" id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <NoteDetail data={data} />
      </main>
      <SiteFooter footerText={site.footerText} siteName={site.siteName} />
    </>
  );
}
