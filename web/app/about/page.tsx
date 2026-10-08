import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutProfile } from "@/components/about/about-profile";
import { getAboutProfile } from "@/sanity/lib/about";
import { getHomePage } from "@/sanity/lib/home";
import { getStaticPageSeo } from "@/sanity/lib/seo";
import { createPageMetadata } from "@/lib/seo";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageSeo();
  const seo = data.aboutPage?.seo;

  return createPageMetadata({
    defaultImage: data.settings?.defaultSeo?.image,
    description:
      seo?.description ||
      "Background, experience, working principles and professional focus of Abdulrahman Itseghosime Bello.",
    image: seo?.image,
    noIndex: data.settings?.indexing !== "allow" || seo?.noIndex === true,
    path: "/about",
    title: seo?.title || "About Abdulrahman Itseghosime Bello",
  });
}

export default async function AboutPage() {
  const [page, dossier] = await Promise.all([getHomePage(), getAboutProfile()]);
  if (!page || !dossier) {
    notFound();
  }

  const profileUrl = absoluteUrl("/about");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${SITE_URL}/#person`,
        "@type": "Person",
        name: dossier.story.fullName,
        jobTitle: page.hero.professionalTitle,
        description: page.hero.introduction,
        address: dossier.hero.location
          ? { "@type": "PostalAddress", addressLocality: dossier.hero.location }
          : undefined,
        knowsAbout: page.technologies.map((technology) => technology.name),
        sameAs: page.contact.socialLinks.map((link) => link.url),
        url: profileUrl,
      },
      {
        "@id": profileUrl,
        "@type": "ProfilePage",
        name: `About ${dossier.story.fullName}`,
        mainEntity: { "@id": `${SITE_URL}/#person` },
        url: profileUrl,
      },
    ],
  };

  return (
    <>
      <SiteHeader navigation={page.navigation} siteName={page.siteName} />
      <main id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <AboutProfile dossier={dossier} page={page} />
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  );
}
