import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";

import { ConnectivityStatus } from "@/components/system/connectivity-status";
import { SanityLive } from "@/sanity/lib/live";
import { SITE_URL } from "@/lib/site";

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
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ITSEGHOSIME | Frontend Developer Portfolio",
    template: "%s | ITSEGHOSIME",
  },
  description:
    "The portfolio of Abdulrahman Itseghosime Bello, a frontend developer and software engineer building thoughtful digital experiences.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${newsreader.variable}`}
    >
      <body>
        <ConnectivityStatus />
        <a
          className="fixed top-3 left-3 z-[1000] -translate-y-[200%] rounded bg-ink px-4 py-2.5 text-sm font-semibold text-background transition-transform duration-150 focus:translate-y-0 motion-reduce:transition-none"
          href="#main-content"
        >
          Skip to main content
        </a>
        {children}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
