import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LabView } from "@/components/lab/lab-view";
import { Container } from "@/components/ui/container";
import { getHomePage } from "@/sanity/lib/home";
import { getLabPage } from "@/sanity/lib/lab";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLabPage();
  const title =
    seo?.title ||
    "ITSEGHOSIME / LAB — Experiments in Interaction & Creative Code";
  const description =
    seo?.description ||
    "Small experiments in interaction, interfaces, tactile physics, and creative frontend development by Osi Itseghosime.";

  return {
    title,
    description,
    robots: seo?.noIndex ? { follow: false, index: false } : undefined,
    openGraph: {
      title,
      description,
      images: seo?.image?.url
        ? [{ alt: seo.image.alt, url: seo.image.url }]
        : undefined,
    },
  };
}

export default async function LabPage() {
  const [page, lab] = await Promise.all([getHomePage(), getLabPage()]);

  if (!page) {
    notFound();
  }

  return (
    <>
      <SiteHeader navigation={page.navigation} siteName={page.siteName} />
      <main className="py-12 sm:py-16 md:py-20" id="main-content">
        <Container>
          <LabView experiments={lab.experiments} page={lab.page} />
        </Container>
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  );
}
