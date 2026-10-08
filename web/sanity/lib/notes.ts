import type {
  NOTES_ARCHIVE_QUERY_RESULT,
  NOTE_DETAIL_QUERY_RESULT,
  NOTE_METADATA_QUERY_RESULT,
  NOTE_SLUGS_QUERY_RESULT,
} from "@/sanity.types";
import type { ImageAsset } from "@/types/home";
import type {
  NoteBodyBlock,
  NoteCategory,
  NoteDetailData,
  NoteHeading,
  NoteSummary,
  NotesArchiveData,
  NotesPageModel,
} from "@/types/notes";

import { sanityFetch } from "./live";
import { getContentFetchOptions } from "./fetch-options";
import {
  NOTES_ARCHIVE_QUERY,
  NOTE_DETAIL_QUERY,
  NOTE_METADATA_QUERY,
  NOTE_SLUGS_QUERY,
} from "./queries";

const categoryLabels: Record<NoteCategory, string> = {
  accessibility: "Accessibility",
  architecture: "Architecture",
  nextjs: "Next.js",
  performance: "Performance",
  react: "React",
  uiState: "UI & state",
};

const defaultPage: NotesPageModel = {
  eyebrow: "NOTES // TECHNICAL NOTEBOOK",
  heading: "Essays, architectural notes, and field observations.",
  introduction:
    "Notes on frontend engineering, systems architecture, interfaces, and the trade-offs uncovered while shipping software.",
  archiveNote:
    "Every note begins as a practical question and stays open to revision.",
};

const allowedCategories = new Set<NoteCategory>(
  Object.keys(categoryLabels) as NoteCategory[],
);

type ArchiveNote = NOTES_ARCHIVE_QUERY_RESULT["notes"][number];
type DetailNavigationNote = NOTE_DETAIL_QUERY_RESULT["noteNavigation"][number];

function toImage(
  image: {
    alt: string | null;
    caption: string | null;
    height: number | null;
    lqip: string | null;
    url: string | null;
    width: number | null;
  } | null | undefined,
): ImageAsset | undefined {
  if (!image?.url || !image.alt || !image.width || !image.height)
    return undefined;

  return {
    alt: image.alt,
    blurDataUrl: image.lqip ?? undefined,
    caption: image.caption ?? undefined,
    height: image.height,
    url: image.url,
    width: image.width,
  };
}

function toCategory(value: string | null): NoteCategory {
  return value && allowedCategories.has(value as NoteCategory)
    ? (value as NoteCategory)
    : "architecture";
}

function toSummary(
  note: ArchiveNote | DetailNavigationNote,
  index = 0,
): NoteSummary | null {
  if (
    !note._id ||
    !note.title ||
    !note.slug ||
    !note.excerpt ||
    !note.publishedAt
  ) {
    return null;
  }

  const category = toCategory(note.category);
  const featured = "featured" in note ? Boolean(note.featured) : false;
  const coverImage =
    "coverImage" in note ? toImage(note.coverImage) : undefined;

  return {
    category,
    categoryLabel: categoryLabels[category],
    coverImage,
    excerpt: note.excerpt,
    featured,
    id: note._id,
    publishedAt: note.publishedAt,
    preview:
      note.preview?.label && note.preview.summary
        ? {
            code: note.preview.code || undefined,
            label: note.preview.label,
            summary: note.preview.summary,
          }
        : undefined,
    readingTimeMinutes: note.readingTimeMinutes ?? 5,
    slug: note.slug,
    technologies:
      note.technologies?.flatMap((technology) =>
        technology.name ? [technology.name] : [],
      ) ?? [],
    title: note.title,
    topics: note.topics?.filter(Boolean) ?? [],
    volumeNumber: note.volumeNumber ?? index + 1,
  };
}

function toPage(page: NOTES_ARCHIVE_QUERY_RESULT["notesPage"]): NotesPageModel {
  if (!page) return defaultPage;

  return {
    archiveNote: page.archiveNote || defaultPage.archiveNote,
    eyebrow: page.eyebrow || defaultPage.eyebrow,
    heading: page.heading || defaultPage.heading,
    introduction: page.introduction || defaultPage.introduction,
    seo: page.seo
      ? {
          description: page.seo.description || undefined,
          image: toImage(page.seo.image),
          noIndex: page.seo.noIndex || undefined,
          title: page.seo.title || undefined,
        }
      : undefined,
  };
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getHeadings(body: NoteBodyBlock[]): NoteHeading[] {
  const seen = new Map<string, number>();

  return body.flatMap<NoteHeading>((block) => {
    if (
      block._type !== "block" ||
      (block.style !== "h2" && block.style !== "h3") ||
      !block.children
    ) {
      return [];
    }

    const title = block.children
      .map((child) => child.text || "")
      .join("")
      .trim();
    if (!title) return [];

    const base = slugifyHeading(title) || "section";
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);

    return [
      {
        id: occurrence ? `${base}-${occurrence + 1}` : base,
        level: block.style === "h2" ? 2 : 3,
        title,
      },
    ];
  });
}

export async function getNotesArchive(): Promise<NotesArchiveData> {
  const fetchOptions = await getContentFetchOptions();
  const { data } = (await sanityFetch({
    ...fetchOptions,
    query: NOTES_ARCHIVE_QUERY,
  })) as { data: NOTES_ARCHIVE_QUERY_RESULT };

  return {
    notes: data.notes.flatMap((note, index) => {
      const summary = toSummary(note, index);
      return summary ? [summary] : [];
    }),
    page: toPage(data.notesPage),
  };
}

export async function getNoteSlugs(): Promise<string[]> {
  const { data } = (await sanityFetch({
    query: NOTE_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  })) as { data: NOTE_SLUGS_QUERY_RESULT };

  return data.flatMap((item) => (item.slug ? [item.slug] : []));
}

export async function getNoteMetadata(
  slug: string,
): Promise<NOTE_METADATA_QUERY_RESULT> {
  const { data } = (await sanityFetch({
    query: NOTE_METADATA_QUERY,
    params: { slug },
    perspective: "published",
    stega: false,
  })) as { data: NOTE_METADATA_QUERY_RESULT };

  return data;
}

export async function getNoteDetail(slug: string): Promise<NoteDetailData> {
  const fetchOptions = await getContentFetchOptions();
  const { data } = (await sanityFetch({
    ...fetchOptions,
    query: NOTE_DETAIL_QUERY,
    params: { slug },
  })) as { data: NOTE_DETAIL_QUERY_RESULT };

  const summaries = data.noteNavigation.flatMap((note, index) => {
    const summary = toSummary(note, index);
    return summary ? [summary] : [];
  });
  const currentIndex = summaries.findIndex((note) => note.slug === slug);
  const currentSummary =
    currentIndex >= 0 ? summaries[currentIndex] : undefined;
  const body = data.note?.body ?? [];

  const related = currentSummary
    ? summaries
        .filter(
          (note) =>
            note.slug !== currentSummary.slug &&
            (note.category === currentSummary.category ||
              note.topics.some((topic) =>
                currentSummary.topics.includes(topic),
              )),
        )
        .slice(0, 4)
    : [];

  return {
    adjacent: {
      next: currentIndex >= 0 ? summaries[currentIndex + 1] : undefined,
      previous: currentIndex > 0 ? summaries[currentIndex - 1] : undefined,
    },
    labels: {
      back: data.notesPage?.backLabel || "Back to notes",
      contents: data.notesPage?.contentsLabel || "In this note",
      feedbackHeading:
        data.notesPage?.feedbackHeading || "Have a different approach?",
      feedbackMessage:
        data.notesPage?.feedbackMessage ||
        "I write these notes to make the work clearer. If you see another angle, I would like to hear it.",
      reader: {
        copied: data.notesPage?.readerLabels?.copied || "Copied",
        copy: data.notesPage?.readerLabels?.copy || "Copy link",
        feedback: data.notesPage?.readerLabels?.feedback || "Send feedback",
        sectionCount: data.notesPage?.readerLabels?.sectionCount || "sections",
        share: data.notesPage?.readerLabels?.share || "Share",
        toolsBadge: data.notesPage?.readerLabels?.toolsBadge || "Tools",
        toolsHeading:
          data.notesPage?.readerLabels?.toolsHeading || "Reading tools",
        typeface: data.notesPage?.readerLabels?.typeface || "Typeface",
      },
      relatedHeading: data.notesPage?.relatedHeading || "Continue reading",
    },
    note:
      data.note && currentSummary
        ? {
            ...currentSummary,
            author: data.profile?.fullName || "Abdulrahman Itseghosime Bello",
            authorEmail: data.profile?.email || undefined,
            body,
            coverImage: toImage(data.note.coverImage),
            editorialContext: {
              sectionLabel:
                data.note.editorialContext?.sectionLabel ||
                currentSummary.categoryLabel,
              seriesLabel:
                data.note.editorialContext?.seriesLabel || "Architecture notes",
            },
            headings: getHeadings(body),
            socialImage:
              toImage(data.note.seo?.image) || toImage(data.note.coverImage),
            updatedAt: data.note._updatedAt,
          }
        : null,
    related:
      related.length > 0
        ? related
        : summaries.filter((note) => note.slug !== slug).slice(0, 4),
  };
}
