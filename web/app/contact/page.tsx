import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactExperience } from "@/components/contact/contact-experience";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getHomePage } from "@/sanity/lib/home";

export const metadata: Metadata = {
  title: { absolute: "Contact | ITSEGHOSIME" },
  description:
    "Contact Abdulrahman Itseghosime Bello about frontend development, software engineering and selected web projects.",
};

export default async function ContactPage() {
  const page = await getHomePage();

  if (!page) {
    notFound();
  }

  const navigation = page.navigation.map((item) =>
    item.href === "/#contact" ? { ...item, href: "/contact" } : item,
  );

  return (
    <>
      <SiteHeader
        contactHref="#contact-form"
        navigation={navigation}
        siteName={page.siteName}
      />
      <main id="main-content">
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
