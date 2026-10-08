import { absoluteUrl, SITE_NAME } from "./site";

export type RssNote = {
  _updatedAt: string;
  excerpt: string | null;
  publishedAt: string | null;
  slug: string | null;
  title: string | null;
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createNotesRss(notes: RssNote[]): string {
  const validNotes = notes.filter(
    (note) => note.title && note.slug && note.publishedAt,
  );
  const latestDate = validNotes.reduce<Date | null>((latest, note) => {
    const date = new Date(note._updatedAt || note.publishedAt || 0);
    return !latest || date > latest ? date : latest;
  }, null);

  const items = validNotes
    .map((note) => {
      const url = absoluteUrl(`/notes/${note.slug}`);

      return `
    <item>
      <title>${escapeXml(note.title ?? "Technical note")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(note.publishedAt ?? note._updatedAt).toUTCString()}</pubDate>
      <description>${escapeXml(note.excerpt ?? "")}</description>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Technical Notes</title>
    <link>${absoluteUrl("/notes")}</link>
    <description>Practical notes on frontend engineering, interface architecture, accessibility and performance.</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
    ${latestDate ? `<lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>` : ""}${items}
  </channel>
</rss>`;
}
