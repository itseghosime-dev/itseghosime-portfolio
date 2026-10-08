import type { NOTE_DETAIL_QUERY_RESULT } from "@/sanity.types";
import type { ImageAsset } from "@/types/home";

export type NoteCategory =
  | "accessibility"
  | "architecture"
  | "nextjs"
  | "performance"
  | "react"
  | "uiState";

export type NoteBodyBlock = NonNullable<
  NonNullable<NOTE_DETAIL_QUERY_RESULT["note"]>["body"]
>[number];

export type NoteSummary = {
  category: NoteCategory;
  categoryLabel: string;
  excerpt: string;
  featured: boolean;
  id: string;
  publishedAt: string;
  preview?: {
    code?: string;
    label: string;
    summary: string;
  };
  readingTimeMinutes: number;
  slug: string;
  technologies: string[];
  title: string;
  topics: string[];
  volumeNumber: number;
  coverImage?: ImageAsset;
};

export type NotesPageModel = {
  archiveNote: string;
  eyebrow: string;
  heading: string;
  introduction: string;
  seo?: {
    description?: string;
    image?: ImageAsset;
    noIndex?: boolean;
    title?: string;
  };
};

export type NotesArchiveData = {
  notes: NoteSummary[];
  page: NotesPageModel;
};

export type NoteHeading = {
  id: string;
  level: 2 | 3;
  title: string;
};

export type NoteDetailModel = NoteSummary & {
  author: string;
  authorEmail?: string;
  body: NoteBodyBlock[];
  editorialContext: {
    sectionLabel: string;
    seriesLabel: string;
  };
  headings: NoteHeading[];
  socialImage?: ImageAsset;
  updatedAt: string;
};

export type NoteReaderLabels = {
  copied: string;
  copy: string;
  feedback: string;
  sectionCount: string;
  share: string;
  toolsBadge: string;
  toolsHeading: string;
  typeface: string;
};

export type NoteDetailData = {
  adjacent: {
    next?: NoteSummary;
    previous?: NoteSummary;
  };
  labels: {
    back: string;
    contents: string;
    feedbackHeading: string;
    feedbackMessage: string;
    reader: NoteReaderLabels;
    relatedHeading: string;
  };
  note: NoteDetailModel | null;
  related: NoteSummary[];
};
