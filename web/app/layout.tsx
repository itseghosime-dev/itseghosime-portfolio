import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";

import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { ConnectivityStatus } from "@/components/system/connectivity-status";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { SITE_URL } from "@/lib/site";
import { resolveSocialImage } from "@/lib/seo";
import { HOME_METADATA_QUERY } from "@/sanity/lib/queries";

import "lenis/dist/lenis.css";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: "normal",
  weight: "400",
});

const newsreaderItalic = Newsreader({
  variable: "--font-newsreader-italic",
  subsets: ["latin"],
  display: "swap",
  style: "italic",
  axes: ["opsz"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    perspective: "published",
    query: HOME_METADATA_QUERY,
    stega: false,
  });
  const { settings } = data;
  const title =
    settings?.defaultSeo?.title ||
    "ITSEGHOSIME | Frontend Developer Portfolio";
  const description =
    settings?.defaultSeo?.description ||
    settings?.siteDescription ||
    "The portfolio of Abdulrahman Itseghosime Bello, a frontend developer and software engineer building thoughtful digital experiences.";
  const image = resolveSocialImage(settings?.defaultSeo?.image);
  const shouldIndex =
    settings?.indexing === "allow" && settings.defaultSeo?.noIndex !== true;
  const googleVerification =
    settings?.googleSiteVerification ||
    process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s | ITSEGHOSIME" },
    description,
    alternates: {
      types: { "application/rss+xml": [{ title: "ITSEGHOSIME Notes", url: "/feed.xml" }] },
    },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ alt: image.alt, height: image.height, url: image.url, width: image.width }],
      siteName: settings?.siteName || "ITSEGHOSIME",
      url: "/",
    },
    robots: {
      follow: shouldIndex,
      index: shouldIndex,
      googleBot: { follow: shouldIndex, index: shouldIndex },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    verification: googleVerification ? { google: googleVerification } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${newsreader.variable} ${newsreaderItalic.variable}`}
    >
      <body>
        <ConnectivityStatus />
        <a
          className="fixed top-3 left-3 z-[1000] -translate-y-[200%] rounded bg-ink px-4 py-2.5 text-sm font-semibold text-background transition-transform duration-150 focus:translate-y-0 motion-reduce:transition-none"
          href="#main-content"
        >
          Skip to main content
        </a>
        <SmoothScrollProvider>
          {children}
          <SanityLive includeDrafts={isDraftMode} />
          {isDraftMode ? <VisualEditing /> : null}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
