import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
} from "lucide-react";
import Link from "next/link";

import type { NoteDetailData, NoteSummary } from "@/types/notes";

import { Container } from "@/components/ui/container";

import { NoteBody } from "./note-body";
import { formatNoteDate, formatVolumeNumber } from "./note-format";
import { NoteImage } from "./note-image";
import { NoteDetailMotion } from "./note-detail-motion";
import { NoteReadingProgress } from "./note-reading-progress";
import { NoteReadingTools } from "./note-reading-tools";
import { NoteShareActions } from "./note-share-actions";
import { NoteTableOfContents } from "./note-table-of-contents";

function RelatedNoteCard({ note }: { note: NoteSummary }) {
  return (
    <Link
      className="group border-b border-r border-black/[0.09] bg-surface p-6 no-underline transition-colors hover:bg-surface-layer sm:min-h-64"
      href={`/notes/${note.slug}`}
    >
      <div className="flex h-full flex-col justify-between gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.09em] text-accent">
            Note {formatVolumeNumber(note.volumeNumber)} · {note.categoryLabel}
          </p>
          <h3 className="mt-5 font-serif text-2xl leading-[1.08] tracking-[-0.025em]">
            {note.title}
          </h3>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">
            {note.excerpt}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold">
          Read note
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
            size={14}
          />
        </span>
      </div>
    </Link>
  );
}

export function NoteDetail({ data }: { data: NoteDetailData }) {
  if (!data.note) return null;
  const { note } = data;
  const readingBodyId = "note-reading-body";

  return (
    <NoteDetailMotion>
      <NoteReadingProgress />
      <Container>
        <div className="mx-auto max-w-[73rem]">
          <Link
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-muted no-underline transition-colors hover:text-ink"
            href="/notes"
          >
            <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.8} />
            {data.labels.back}
          </Link>

          <div className="mt-8 grid gap-10 border-t border-black/[0.09] pt-8 lg:grid-cols-12 lg:gap-12 xl:gap-16" data-note-detail-intro>
            <aside className="hidden lg:order-1 lg:col-span-3 lg:block lg:pr-2">
              <div className="lg:sticky lg:top-28">
                <NoteTableOfContents
                  headings={note.headings}
                  label={data.labels.contents}
                  sectionCountLabel={data.labels.reader.sectionCount}
                />
                <div className="mt-10">
                  <NoteReadingTools
                    articleId={readingBodyId}
                    email={note.authorEmail}
                    labels={data.labels.reader}
                    title={note.title}
                  />
                </div>
              </div>
            </aside>

            <article className="order-1 min-w-0 lg:order-2 lg:col-span-9 lg:mx-auto lg:w-full lg:max-w-[46.25rem]">
              <header className="border-b border-black/[0.09] pb-10 sm:pb-12 space-y-5">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em]">
                  <span className="font-medium text-ink">
                    {note.editorialContext.sectionLabel}
                  </span>
                  <span className="text-ink-muted">/</span>
                  <span className="font-semibold text-accent">
                    {note.editorialContext.seriesLabel}
                    {" // Vol "}
                    {formatVolumeNumber(note.volumeNumber)}
                  </span>
                </div>
                <h1 className="mt-5 max-w-[44rem] font-serif text-[clamp(2.75rem,5.2vw,3.25rem)] leading-[1.08] tracking-[-0.035em] text-ink">
                  {note.title}
                </h1>
                <p className="mt-6 max-w-[42rem] font-serif text-xl italic leading-8 text-ink-soft sm:text-2xl sm:leading-9">
                  {note.excerpt}
                </p>

                <div className="mt-8 border-y border-black/[0.09] py-4">
                  <dl className="grid gap-x-8 gap-y-3 text-xs text-ink-muted sm:grid-cols-3">
                    <div>
                      <dt className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.08em]">
                        <CalendarDays aria-hidden="true" size={13} /> Published
                      </dt>
                      <dd className="mt-1.5 text-ink">
                        {formatNoteDate(note.publishedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.08em]">
                        <Clock3 aria-hidden="true" size={13} /> Reading time
                      </dt>
                      <dd className="mt-1.5 text-ink">
                        {note.readingTimeMinutes} minutes
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.08em]">
                        Written by
                      </dt>
                      <dd className="mt-1.5 text-ink">{note.author}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-5 lg:hidden">
                  <NoteShareActions title={note.title} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[...note.technologies, ...note.topics]
                    .slice(0, 6)
                    .map((item) => (
                      <span
                        className="border border-black/10 bg-surface px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.06em] text-ink-muted"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                </div>
              </header>

              {note.coverImage ? (
                <NoteImage image={note.coverImage} priority variant="cover" />
              ) : null}

              <div
                className={note.coverImage ? "pt-2 sm:pt-4" : "pt-10 sm:pt-12"}
                id={readingBodyId}
              >
                <NoteBody body={note.body} headings={note.headings} />
              </div>
            </article>
          </div>

          <section className="mt-20 border-y border-black/[0.09] py-8 sm:mt-24 sm:py-10" data-note-detail-section>
            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-2xl flex flex-col gap-4">
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent">
                  Working note / open conversation
                </p>
                <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.035em]">
                  {data.labels.feedbackHeading}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">
                  {data.labels.feedbackMessage}
                </p>
              </div>
              <Link
                className="inline-flex min-h-11 w-fit items-center gap-2 bg-ink px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-accent"
                href="/contact"
              >
                <Mail aria-hidden="true" size={16} /> Start a conversation
              </Link>
            </div>
          </section>

          <nav
            aria-label="Adjacent notes"
            className="mt-10 grid border-l border-t border-black/[0.09] sm:grid-cols-2"
            data-note-detail-section
          >
            {data.adjacent.previous ? (
              <Link
                className="group border-b border-r border-black/[0.09] bg-surface p-6 no-underline transition-colors hover:bg-surface-layer"
                href={`/notes/${data.adjacent.previous.slug}`}
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
                  Previous note
                </span>
                <span className="mt-3 flex items-start gap-3 font-serif text-2xl leading-tight group-hover:text-accent">
                  <ArrowLeft
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                    size={17}
                  />
                  {data.adjacent.previous.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {data.adjacent.next ? (
              <Link
                className="group border-b border-r border-black/[0.09] bg-surface p-6 no-underline text-right transition-colors hover:bg-surface-layer"
                href={`/notes/${data.adjacent.next.slug}`}
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
                  Next note
                </span>
                <span className="mt-3 flex items-start justify-end gap-3 font-serif text-2xl leading-tight group-hover:text-accent">
                  {data.adjacent.next.title}
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                    size={17}
                  />
                </span>
              </Link>
            ) : null}
          </nav>

          {data.related.length ? (
            <section className="py-16 sm:py-20" data-note-detail-section>
              <div className="mb-8 flex items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent">
                    Related notes
                  </p>
                  <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[-0.04em]">
                    {data.labels.relatedHeading}
                  </h2>
                </div>
                <Link
                  className="hidden text-xs font-semibold no-underline hover:text-accent sm:block"
                  href="/notes"
                >
                  Full archive →
                </Link>
              </div>
              <div className="grid border-l border-t border-black/[0.09] sm:grid-cols-2">
                {data.related.map((relatedNote) => (
                  <RelatedNoteCard key={relatedNote.id} note={relatedNote} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </Container>
    </NoteDetailMotion>
  );
}
