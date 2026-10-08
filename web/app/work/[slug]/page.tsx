import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/components/project/project-case-study";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getHomePage } from "@/sanity/lib/home";
import { createPageMetadata, resolveSocialImage } from "@/lib/seo";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { getStaticPageSeo } from "@/sanity/lib/seo";
import {
  getNextProject,
  getProjectMetadata,
  getProjectPage,
  getProjectSlugs,
} from "@/sanity/lib/project";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [project, siteSeo] = await Promise.all([
    getProjectMetadata(slug),
    getStaticPageSeo(),
  ]);
  if (!project?.title) return {};

  const title = project.seo?.title ?? `${project.title} case study`;
  const description =
    project.seo?.description ??
    project.summary ??
    project.subtitle ??
    undefined;
  const image = project.seo?.image?.url ? project.seo.image : project.coverImage;
  const metadata = createPageMetadata({
    defaultImage: siteSeo.settings?.defaultSeo?.image,
    description: description || `${project.title} frontend development case study.`,
    image,
    noIndex:
      siteSeo.settings?.indexing !== "allow" || project.seo?.noIndex === true,
    path: `/work/${slug}`,
    title,
  });

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article" },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [home, data] = await Promise.all([getHomePage(), getProjectPage(slug)]);
  if (!home || !data.project) notFound();

  const nextProject = getNextProject(data.project._id, data.projectNavigation);
  const canonicalUrl = absoluteUrl(`/work/${data.project.slug}`);
  const socialImage = resolveSocialImage(data.project.coverImage);
  const relatedLinks = [data.project.liveUrl, data.project.repositoryUrl].filter(
    (url): url is string => Boolean(url),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${SITE_URL}/#person`,
        "@type": "Person",
        name: home.hero.name,
        jobTitle: home.hero.professionalTitle,
        url: SITE_URL,
      },
      {
        "@id": `${canonicalUrl}#project`,
        "@type": "CreativeWork",
        name: data.project.title,
        description: data.project.summary || data.project.subtitle,
        creator: { "@id": `${SITE_URL}/#person` },
        dateCreated: String(data.project.year),
        image: socialImage.url,
        keywords: (data.project.technologyStack ?? [])
          .map((technology) => technology.name)
          .filter(Boolean),
        sameAs: relatedLinks.length > 0 ? relatedLinks : undefined,
        url: canonicalUrl,
      },
      {
        "@id": canonicalUrl,
        "@type": "WebPage",
        name: `${data.project.title} case study`,
        description: data.project.summary || data.project.subtitle,
        isPartOf: { "@type": "WebSite", name: "ITSEGHOSIME", url: SITE_URL },
        mainEntity: { "@id": `${canonicalUrl}#project` },
        url: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <SiteHeader navigation={home.navigation} siteName={home.siteName} />
      <main id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <ProjectCaseStudy nextProject={nextProject} project={data.project} />
      </main>
      <SiteFooter footerText={home.footerText} siteName={home.siteName} />
    </>
  );
}
