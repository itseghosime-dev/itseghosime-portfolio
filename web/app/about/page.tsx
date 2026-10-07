import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutProfile } from "@/components/about/about-profile";
import { getAboutProfile } from "@/sanity/lib/about";
import { getHomePage } from "@/sanity/lib/home";

export const metadata: Metadata = {
  title: { absolute: "About | ITSEGHOSIME" },
  description:
    "Background, working principles and professional focus of Osi Itseghosime.",
};

export default async function AboutPage() {
  const [page, dossier] = await Promise.all([getHomePage(), getAboutProfile()]);
  if (!page || !dossier) {
    notFound();
  }

  return (
    <>
      <SiteHeader navigation={page.navigation} siteName={page.siteName} />
      <main id="main-content">
        <AboutProfile dossier={dossier} page={page} />
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  );
}
