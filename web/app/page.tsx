import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutSection } from "@/components/home/about-section";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { ContactSection } from "@/components/home/contact-section";
import { HeroSection } from "@/components/home/hero-section";
import { HomeMotion } from "@/components/home/home-motion";
import { LabSection } from "@/components/home/lab-section";
import { TechnologiesSection } from "@/components/home/technologies-section";
import { WorkSection } from "@/components/home/work-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getHomePage } from "@/sanity/lib/home";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_METADATA_QUERY } from "@/sanity/lib/queries";
import { resolveSocialImage } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

function safeUrl(value: string | null | undefined): URL | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: HOME_METADATA_QUERY,
    perspective: "published",
    stega: false,
  });

  const { profile, settings } = data;
  const title =
    settings?.defaultSeo?.title ??
    (profile?.professionalTitle && settings?.siteName
      ? `${settings.siteName} | ${profile.professionalTitle}`
      : settings?.siteName);
  const description =
    settings?.defaultSeo?.description ?? settings?.siteDescription;
  const metadataBase = safeUrl(settings?.canonicalUrl) ?? new URL(SITE_URL);
  const shouldIndex =
    settings?.indexing === "allow" && settings.defaultSeo?.noIndex !== true;
  const socialImage = resolveSocialImage(settings?.defaultSeo?.image);

  return {
    metadataBase,
    title: title ? { absolute: title } : undefined,
    description: description ?? undefined,
    alternates: metadataBase ? { canonical: "/" } : undefined,
    openGraph: {
      type: "website",
      title: title ?? undefined,
      description: description ?? undefined,
      siteName: settings?.siteName ?? undefined,
      url: metadataBase,
      images: [
        {
          alt: socialImage.alt,
          height: socialImage.height,
          url: socialImage.url,
          width: socialImage.width,
        },
      ],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: [socialImage.url],
    },
    verification: settings?.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
  };
}

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    notFound();
  }

  return (
    <>
      <SiteHeader navigation={page.navigation} siteName={page.siteName} />
      <main id="main-content">
        <HeroSection />
        <WorkSection projects={page.projects} />
        <CapabilitiesSection capabilities={page.capabilities} />
        <TechnologiesSection technologies={page.technologies} />
        <LabSection experiments={page.labExperiments} />
        <AboutSection />
        <ContactSection contact={page.contact} />
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
      <HomeMotion />
    </>
  );
}
