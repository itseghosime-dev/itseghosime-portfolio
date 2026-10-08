"use client";

import gsap from "gsap";
import { Check, Copy, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  NoteCategory,
  NoteSummary,
  NotesPageModel,
} from "@/types/notes";

import { NoteArchiveRow } from "./note-archive-row";

type NoteFilter = "all" | NoteCategory;

const categoryLabels: Record<NoteFilter, string> = {
  all: "All notes",
  accessibility: "Accessibility",
  architecture: "Architecture",
  nextjs: "Next.js",
  performance: "Performance",
  react: "React",
  uiState: "UI & state",
};

const categoryOrder: NoteFilter[] = [
  "all",
  "react",
  "nextjs",
  "performance",
  "uiState",
  "architecture",
  "accessibility",
];

export function NotesArchive({
  notes,
  page,
}: {
  notes: NoteSummary[];
  page: NotesPageModel;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<NoteFilter>("all");
  const [copied, setCopied] = useState(false);

  const counts = useMemo(
    () =>
      categoryOrder.reduce<Record<NoteFilter, number>>(
        (result, category) => ({
          ...result,
          [category]:
            category === "all"
              ? notes.length
              : notes.filter((note) => note.category === category).length,
        }),
        {
          all: 0,
          accessibility: 0,
          architecture: 0,
          nextjs: 0,
          performance: 0,
          react: 0,
          uiState: 0,
        },
      ),
    [notes],
  );

  const visibleCategories = categoryOrder.filter(
    (category) => category === "all" || counts[category] > 0,
  );
  const visibleNotes = notes.filter(
    (note) => activeFilter === "all" || note.category === activeFilter,
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rows = root.querySelectorAll<HTMLElement>("[data-note-row]");
    gsap.fromTo(
      rows,
      { opacity: 0, y: 16 },
      {
        duration: 0.5,
        ease: "power3.out",
        opacity: 1,
        stagger: 0.04,
        y: 0,
      },
    );
  }, [activeFilter]);

  async function copyArchiveLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function focusArchive() {
    archiveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-[70rem]" ref={rootRef}>
      <header className="border-b border-black/[0.09] pb-10 pt-2 sm:pb-12 sm:pt-4">
        <div className="flex flex-col gap-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.11em] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-accent">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            {page.eyebrow}
          </p>
          <p className="text-ink-muted">Index 2024–2026 · Updated as ideas develop</p>
        </div>

        <h1 className="mt-10 max-w-[50rem] font-serif text-[clamp(2.75rem,5vw,3.375rem)] leading-[1.02] tracking-[-0.035em] text-ink">
          {page.heading}
        </h1>
        <p className="mt-6 max-w-[45rem] text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
          {page.introduction}
        </p>

        <dl className="mt-10 grid border-y border-black/[0.09] sm:grid-cols-3">
          <div className="border-b border-black/[0.09] py-4 sm:border-b-0 sm:border-r sm:pr-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">Published</dt>
            <dd className="mt-1 font-serif text-2xl">{String(notes.length).padStart(2, "0")} notes</dd>
          </div>
          <div className="border-b border-black/[0.09] py-4 sm:border-b-0 sm:border-r sm:px-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">Core disciplines</dt>
            <dd className="mt-1 font-serif text-2xl">Frontend systems</dd>
          </div>
          <div className="py-4 sm:pl-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">Format</dt>
            <dd className="mt-1 font-serif text-2xl">Working notebook</dd>
          </div>
        </dl>
      </header>

      <section className="scroll-mt-24 py-8 sm:py-10" ref={archiveRef}>
        <nav aria-label="Note categories" className="overflow-x-auto border-b border-black/[0.09]">
          <div className="flex min-w-max gap-2 pb-4">
            {visibleCategories.map((category) => {
              const isActive = category === activeFilter;
              return (
                <button
                  aria-pressed={isActive}
                  className={`inline-flex min-h-10 items-center gap-3 border px-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.06em] transition-colors ${isActive ? "border-ink bg-ink text-white" : "border-black/10 bg-surface text-ink-muted hover:border-black/30 hover:text-ink"}`}
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  type="button"
                >
                  {categoryLabels[category]}
                  <span className={isActive ? "text-white/65" : "text-accent"}>
                    {String(counts[category]).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div aria-live="polite">
          {visibleNotes.map((note) => (
            <NoteArchiveRow key={note.id} note={note} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 border border-black/[0.09] bg-surface p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6">
          <span className="grid size-10 place-items-center border border-black/10 bg-white font-serif text-xl text-accent">i</span>
          <div>
            <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.09em] text-accent">Editorial curation</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{page.archiveNote}</p>
          </div>
          <Link className="text-xs font-semibold underline decoration-black/20 underline-offset-4 hover:text-accent" href="/about">
            About this notebook
          </Link>
        </div>
      </section>

      <section className="border-t border-black/[0.09] py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent">Interaction system</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.035em]">Small signals that make an editorial archive feel responsive.</h2>
          <p className="mt-4 text-sm leading-6 text-ink-muted">The states below are the same quiet feedback patterns used throughout the portfolio.</p>
        </div>

        <div className="mt-9 grid border-l border-t border-black/[0.09] sm:grid-cols-2 lg:grid-cols-4">
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">01 / Link</p>
            <Link className="mt-14 inline-block font-serif text-xl underline decoration-accent/40 underline-offset-8 transition-[text-underline-offset] hover:underline-offset-[12px]" href="/about">Read the profile</Link>
          </article>
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">02 / Filter</p>
            <button className="mt-12 inline-flex min-h-11 items-center gap-2 border border-black/15 px-4 text-xs font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-white" onClick={focusArchive} type="button"><SlidersHorizontal aria-hidden="true" size={15} /> Browse topics</button>
          </article>
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">03 / Quick command</p>
            <button className="mt-12 inline-flex min-h-11 items-center gap-2 border-b border-black/20 text-sm font-medium hover:border-accent hover:text-accent" onClick={focusArchive} type="button"><Search aria-hidden="true" size={15} /> Find a note <kbd className="ml-2 border border-black/10 bg-surface px-1.5 py-0.5 font-mono text-[0.625rem]">N</kbd></button>
          </article>
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">04 / Feedback</p>
            <button className="mt-12 inline-flex min-h-11 items-center gap-2 bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-accent" onClick={copyArchiveLink} type="button">{copied ? <Check aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={15} />}{copied ? "Link copied" : "Copy archive link"}</button>
          </article>
        </div>
      </section>
    </div>
  );
}
