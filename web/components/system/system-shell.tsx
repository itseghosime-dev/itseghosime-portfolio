import type { NavigationItem } from "@/types/home";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const systemNavigation: NavigationItem[] = [
  { href: "/work", label: "Work" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
];

export function SystemHeader() {
  return <SiteHeader navigation={systemNavigation} siteName="ITSEGHOSIME" />;
}

export function SystemFooter() {
  return (
    <SiteFooter
      footerText="Designed and developed by Abdulrahman Itseghosime Bello."
      siteName="ITSEGHOSIME"
    />
  );
}
