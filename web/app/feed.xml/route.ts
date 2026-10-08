import { createNotesRss, type RssNote } from "@/lib/rss";
import { sanityClient } from "@/sanity/lib/client";
import { RSS_NOTES_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const notes = await sanityClient.fetch<RssNote[]>(RSS_NOTES_QUERY);

  return new Response(createNotesRss(notes), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
