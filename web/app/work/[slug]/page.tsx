import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/components/project/project-case-study";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getHomePage } from "@/sanity/lib/home";
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
  const project = await getProjectMetadata(slug);
  if (!project?.title) return {};

  const title = project.seo?.title ?? `${project.title} case study`;
  const description =
    project.seo?.description ??
    project.summary ??
    project.subtitle ??
    undefined;
  const image = project.seo?.image?.url
    ? project.seo.image
    : project.coverImage;

  return {
    description,
    openGraph: {
      description,
      images: image?.url
        ? [
            {
              alt: image.alt ?? project.title,
              height: image.height ?? undefined,
              url: image.url,
              width: image.width ?? undefined,
            },
          ]
        : undefined,
      title,
      type: "article",
    },
    robots: project.seo?.noIndex ? { follow: false, index: false } : undefined,
    title,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [home, data] = await Promise.all([getHomePage(), getProjectPage(slug)]);
  if (!home || !data.project) notFound();

  const nextProject = getNextProject(data.project._id, data.projectNavigation);

  return (
    <>
      <SiteHeader navigation={home.navigation} siteName={home.siteName} />
      <main id="main-content">
        <ProjectCaseStudy nextProject={nextProject} project={data.project} />
      </main>
      <SiteFooter footerText={home.footerText} siteName={home.siteName} />
    </>
  );
}
