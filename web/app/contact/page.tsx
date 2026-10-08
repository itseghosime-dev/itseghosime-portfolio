import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactExperience } from "@/components/contact/contact-experience";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getHomePage } from "@/sanity/lib/home";
import { getStaticPageSeo } from "@/sanity/lib/seo";
import { createPageMetadata } from "@/lib/seo";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageSeo();
  const seo = data.contactPage?.seo;

  return createPageMetadata({
    defaultImage: data.settings?.defaultSeo?.image,
    description:
      seo?.description ||
      "Contact Abdulrahman Itseghosime Bello about frontend development, software engineering and selected web projects.",
    image: seo?.image,
    noIndex: data.settings?.indexing !== "allow" || seo?.noIndex === true,
    path: "/contact",
    title: seo?.title || "Contact Abdulrahman Itseghosime Bello",
  });
}

export default async function ContactPage() {
  const page = await getHomePage();

  if (!page) {
    notFound();
  }

  const navigation = page.navigation.map((item) =>
    item.href === "/#contact" ? { ...item, href: "/contact" } : item,
  );
  const contactUrl = absoluteUrl("/contact");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Abdulrahman Itseghosime Bello",
    description: page.contact.message,
    isPartOf: { "@type": "WebSite", name: "ITSEGHOSIME", url: SITE_URL },
    mainEntity: {
      "@id": `${SITE_URL}/#person`,
      "@type": "Person",
      email: `mailto:${page.contact.email}`,
      jobTitle: page.hero.professionalTitle,
      name: page.hero.name,
      sameAs: page.contact.socialLinks.map((link) => link.url),
      url: SITE_URL,
    },
    url: contactUrl,
  };

  return (
    <>
      <SiteHeader
        contactHref="#contact-form"
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
        <ContactExperience
          capabilities={page.capabilities}
          contact={page.contact}
          hero={page.hero}
          technologies={page.technologies}
        />
      </main>
      <SiteFooter footerText={page.footerText} siteName={page.siteName} />
    </>
  );
}
