import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArchiveContactSection } from "@/components/work/archive-contact-section";
import { WorkArchive } from "@/components/work/work-archive";
import { getHomePage } from "@/sanity/lib/home";
import { getWorkArchive } from "@/sanity/lib/work";
import { getStaticPageSeo } from "@/sanity/lib/seo";
import { createPageMetadata } from "@/lib/seo";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import type { ArchiveFilter } from "@/types/work";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageSeo();
  const seo = data.workPage?.seo;

  return createPageMetadata({
    defaultImage: data.settings?.defaultSeo?.image,
    description:
      seo?.description ||
      "Selected frontend projects, product work and technical experiments by Abdulrahman Itseghosime Bello.",
    image: seo?.image,
    noIndex: data.settings?.indexing !== "allow" || seo?.noIndex === true,
    path: "/work",
    title: seo?.title || "Work Archive",
  });
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const [page, entries] = await Promise.all([getHomePage(), getWorkArchive()]);
  const initialFilter: ArchiveFilter =
    filter === "client" || filter === "web" || filter === "experimental"
      ? filter
      : "all";

  if (!page) {
    notFound();
  }

  const navigation = page.navigation.map((item) =>
    item.href === "/#contact" ? { ...item, href: "#contact" } : item,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ITSEGHOSIME Work Archive",
    description:
      "Selected frontend projects, product work and technical experiments by Abdulrahman Itseghosime Bello.",
    isPartOf: { "@type": "WebSite", name: "ITSEGHOSIME", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: entries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: entry.href ? absoluteUrl(entry.href) : undefined,
      })),
    },
    url: absoluteUrl("/work"),
  };

  return (
    <>
      <SiteHeader
        contactHref="#contact"
        navigation={navigation}
        siteName={page.siteName}
      />
      <main id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <WorkArchive entries={entries} initialFilter={initialFilter} />
        <ArchiveContactSection contact={page.contact} />
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  );
}
