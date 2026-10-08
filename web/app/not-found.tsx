import type { Metadata } from "next";

import { NotFoundExperience } from "@/components/system/not-found-experience";

export const metadata: Metadata = {
  description: "The requested page could not be found.",
  title: "Nothing lives here",
};

export default function NotFound() {
  return <NotFoundExperience />;
}
