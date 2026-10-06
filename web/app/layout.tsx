import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";

import { SanityLive } from "@/sanity/lib/live";

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
  title: {
    default: "ITSEGHOSIME | Frontend Developer Portfolio",
    template: "%s | ITSEGHOSIME",
  },
  description:
    "The portfolio of Abdulrahman Itseghosime Bello, a frontend developer and software engineer building thoughtful digital experiences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${newsreader.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
