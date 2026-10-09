import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { NoteSummary } from "@/types/notes";

import { formatNoteYear, formatVolumeNumber } from "./note-format";

export function NoteArchiveRow({ note }: { note: NoteSummary }) {
  const focus = note.technologies.slice(0, 2).join(" · ") || note.categoryLabel;
  const preview = note.preview ?? {
    label: note.categoryLabel,
    summary: note.excerpt,
  };

  return (
    <article
      className="group relative -mx-4 border-b border-black/[0.09] px-4 py-8 transition-colors duration-200 hover:bg-surface sm:py-9"
      data-note-row
    >
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex max-w-[48rem] items-start gap-5 sm:gap-9">
          <span className="mt-2 shrink-0 font-mono text-[0.6875rem] font-semibold tracking-[0.08em] text-accent-text">
            {formatVolumeNumber(note.volumeNumber)}
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-[clamp(1.55rem,2.7vw,1.9rem)] leading-[1.15] tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
              <Link
                className="no-underline after:absolute after:inset-0"
                href={`/notes/${note.slug}`}
              >
                {note.title}
              </Link>
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-2 font-medium text-ink">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {note.categoryLabel} / {focus}
              </span>
              <span aria-hidden="true" className="text-black/20">•</span>
              <span className="font-mono text-[0.6875rem]">{note.readingTimeMinutes} min read</span>
              <span aria-hidden="true" className="text-black/20">•</span>
              <span className="font-mono text-[0.6875rem]">Published {formatNoteYear(note.publishedAt)}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 self-start pl-10 sm:pl-[4.35rem] lg:self-center lg:pl-0">
          <span className="hidden font-mono text-[0.6875rem] text-ink-muted sm:inline">
            {formatNoteYear(note.publishedAt)}
          </span>
          <span className="grid size-9 place-items-center rounded-full border border-black/15 text-ink transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.7} />
          </span>
        </div>
      </div>

      <aside
        aria-hidden="true"
        className="pointer-events-none absolute right-14 top-1/2 z-20 hidden w-80 -translate-y-[46%] scale-[0.985] border border-black/15 bg-white p-5 opacity-0 shadow-[0_24px_70px_-30px_rgba(15,18,24,0.45)] transition-[opacity,transform] duration-200 ease-out group-hover:-translate-y-1/2 group-hover:scale-100 group-hover:opacity-100 group-focus-within:-translate-y-1/2 group-focus-within:scale-100 group-focus-within:opacity-100 xl:block"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.09] pb-3">
          <span className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.09em] text-accent-text">
            Preview // {formatVolumeNumber(note.volumeNumber)}
          </span>
          <span className="truncate font-mono text-[0.625rem] text-ink-muted">
            {preview.label}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-soft">{preview.summary}</p>
        {preview.code ? (
          <pre className="mt-4 overflow-hidden border border-black/[0.08] bg-surface-container p-3 font-mono text-[0.625rem] leading-5 text-ink">
            <code>{preview.code}</code>
          </pre>
        ) : null}
      </aside>
    </article>
  );
}
