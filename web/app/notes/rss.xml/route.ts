import { permanentRedirect } from "next/navigation";

import { absoluteUrl } from "@/lib/site";

export function GET() {
  permanentRedirect(absoluteUrl("/feed.xml"));
}
