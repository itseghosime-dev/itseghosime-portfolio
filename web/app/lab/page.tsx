import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LabView } from "@/components/lab/lab-view";
import { Container } from "@/components/ui/container";
import { getHomePage } from "@/sanity/lib/home";
import { getLabPage } from "@/sanity/lib/lab";
import { getStaticPageSeo } from "@/sanity/lib/seo";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo }, siteSeo] = await Promise.all([
    getLabPage(),
    getStaticPageSeo(),
  ]);
  const title =
    seo?.title ||
    "ITSEGHOSIME / LAB — Experiments in Interaction & Creative Code";
  const description =
    seo?.description ||
    "Small experiments in interaction, interfaces, tactile physics, and creative frontend development by Osi Itseghosime.";

  return createPageMetadata({
    defaultImage: siteSeo.settings?.defaultSeo?.image,
    description,
    image: seo?.image,
    noIndex:
      siteSeo.settings?.indexing !== "allow" || seo?.noIndex === true,
    path: "/lab",
    title,
  });
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
