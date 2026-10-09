"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Copy, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { NoteCategory, NoteSummary, NotesPageModel } from "@/types/notes";

import { useSmoothScroll } from "@/components/motion/smooth-scroll-provider";
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
  const filterRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { scrollTo } = useSmoothScroll();
  const [activeFilter, setActiveFilter] = useState<NoteFilter>("all");
  const [query, setQuery] = useState("");
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
  const visibleNotes = notes.filter((note) => {
    const matchesCategory =
      activeFilter === "all" || note.category === activeFilter;
    const normalizedQuery = query.trim().toLowerCase();
    const searchable = [
      note.title,
      note.excerpt,
      note.categoryLabel,
      ...(note.technologies ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      (!normalizedQuery || searchable.includes(normalizedQuery))
    );
  });

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
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
  }, [activeFilter, query]);

  useEffect(() => {
    function handleQuickFind(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (
        event.key.toLowerCase() !== "n" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isTyping
      ) {
        return;
      }

      event.preventDefault();
      focusSearch();
    }

    window.addEventListener("keydown", handleQuickFind);
    return () => window.removeEventListener("keydown", handleQuickFind);
  });

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const intro = root.querySelector<HTMLElement>("[data-notes-intro]");
      if (intro) {
        gsap.fromTo(
          intro.children,
          { opacity: 0, y: 20 },
          {
            duration: 0.7,
            ease: "power3.out",
            opacity: 1,
            stagger: 0.06,
            y: 0,
          },
        );
      }

      root
        .querySelectorAll<HTMLElement>("[data-notes-section]")
        .forEach((section, index) => {
          gsap.fromTo(
            section,
            { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
            {
              duration: 0.78,
              ease: "power3.out",
              opacity: 1,
              scrollTrigger: {
                once: true,
                start: "top 89%",
                trigger: section,
              },
              x: 0,
            },
          );
        });
    }, root);

    return () => context.revert();
  }, []);

  async function copyArchiveLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function focusFilters() {
    if (!archiveRef.current) return;
    scrollTo(archiveRef.current);
    window.setTimeout(() => filterRef.current?.focus(), 500);
  }

  function focusSearch() {
    if (!archiveRef.current) return;
    scrollTo(archiveRef.current);
    window.setTimeout(() => searchRef.current?.focus(), 500);
  }

  return (
    <div className="mx-auto max-w-[70rem]" ref={rootRef}>
      <header
        className="border-b border-black/[0.09] pb-10 pt-2 sm:pb-12 sm:pt-4 space-y-8"
        data-notes-intro
      >
        <div className="flex flex-col gap-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.11em] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-accent-text">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            {page.eyebrow}
          </p>
          <p className="text-ink-muted">· Updated as ideas develop</p>
        </div>

        <h1 className="mt-10 max-w-[50rem] font-serif text-[clamp(2.75rem,5vw,3.375rem)] leading-[1.02] tracking-[-0.035em] text-ink">
          {page.heading}
        </h1>
        <p className="mt-6 max-w-[45rem] text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
          {page.introduction}
        </p>

        <dl className="mt-10 grid border-y border-black/[0.09] sm:grid-cols-3">
          <div className="border-b border-black/[0.09] py-4 sm:border-b-0 sm:border-r sm:pr-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              Published
            </dt>
            <dd className="mt-1 font-serif text-2xl">
              {String(notes.length).padStart(2, "0")} notes
            </dd>
          </div>
          <div className="border-b border-black/[0.09] py-4 sm:border-b-0 sm:border-r sm:px-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              Core disciplines
            </dt>
            <dd className="mt-1 font-serif text-2xl">Frontend systems</dd>
          </div>
          <div className="py-4 sm:pl-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              Format
            </dt>
            <dd className="mt-1 font-serif text-2xl">Working notebook</dd>
          </div>
        </dl>
      </header>

      <section
        className="scroll-mt-24 py-8 sm:py-10"
        data-notes-section
        ref={archiveRef}
      >
        <div className="mb-5 grid gap-3 border border-black/[0.09] bg-surface p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <label className="relative block">
            <span className="sr-only">Search notes</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              size={16}
            />
            <input
              className="min-h-11 w-full border border-black/10 bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, topics or technologies"
              ref={searchRef}
              type="search"
              value={query}
            />
          </label>
          <p
            aria-live="polite"
            className="px-2 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted"
          >
            {String(visibleNotes.length).padStart(2, "0")} results
          </p>
        </div>

        <nav
          aria-label="Note categories"
          className="overflow-x-auto border-b border-black/[0.09]"
        >
          <div className="flex min-w-max gap-2 pb-4">
            {visibleCategories.map((category) => {
              const isActive = category === activeFilter;
              return (
                <button
                  aria-pressed={isActive}
                  className={`inline-flex min-h-10 items-center gap-3 border px-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.06em] transition-colors ${isActive ? "border-ink bg-ink text-white" : "border-black/10 bg-surface text-ink-muted hover:border-black/30 hover:text-ink"}`}
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  ref={category === "all" ? filterRef : undefined}
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
          {visibleNotes.length === 0 ? (
            <div className="grid min-h-48 place-items-center border-b border-black/[0.09] py-12 text-center">
              <div>
                <p className="font-serif text-2xl">No matching notes.</p>
                <button
                  className="mt-4 text-xs font-semibold text-accent underline underline-offset-4"
                  onClick={() => {
                    setActiveFilter("all");
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                  type="button"
                >
                  Clear search and filters
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-5 border border-black/[0.09] bg-surface p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6">
          <span className="grid size-10 place-items-center border border-black/10 bg-white font-serif text-xl text-accent">
            i
          </span>
          <div>
            <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.09em] text-accent-text">
              Editorial curation
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              {page.archiveNote}
            </p>
          </div>
          <Link
            className="text-xs font-semibold underline decoration-black/20 underline-offset-4 hover:text-accent"
            href="/about"
          >
            About this notebook
          </Link>
        </div>
      </section>

      <section
        className="border-t border-black/[0.09] py-16 sm:py-20"
        data-notes-section
      >
        <div className="max-w-2xl">
          <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent-text">
            Interaction system
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.035em]">
            Small signals that make an editorial archive feel responsive.
          </h2>
          <p className="mt-4 text-sm leading-6 text-ink-muted">
            The states below are the same quiet feedback patterns used
            throughout the portfolio.
          </p>
        </div>

        <div className="mt-9 grid border-l border-t border-black/[0.09] sm:grid-cols-2 lg:grid-cols-4">
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              01 / Link
            </p>
            <Link
              className="mt-14 inline-block font-serif text-xl underline decoration-accent/40 underline-offset-8 transition-[text-underline-offset] hover:underline-offset-[12px]"
              href="/about"
            >
              Read the profile
            </Link>
          </article>
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              02 / Filter
            </p>
            <button
              className="mt-12 inline-flex min-h-11 items-center gap-2 border border-black/15 px-4 text-xs font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-white"
              onClick={focusFilters}
              type="button"
            >
              <SlidersHorizontal aria-hidden="true" size={15} /> Browse topics
            </button>
          </article>
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              03 / Quick command
            </p>
            <button
              className="mt-12 inline-flex min-h-11 items-center gap-2 border-b border-black/20 text-sm font-medium hover:border-accent hover:text-accent"
              onClick={focusSearch}
              type="button"
            >
              <Search aria-hidden="true" size={15} /> Find a note{" "}
              <kbd className="ml-2 border border-black/10 bg-surface px-1.5 py-0.5 font-mono text-[0.625rem]">
                N
              </kbd>
            </button>
          </article>
          <article className="min-h-48 border-b border-r border-black/[0.09] p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.09em] text-ink-muted">
              04 / Feedback
            </p>
            <button
              className="mt-12 inline-flex min-h-11 items-center gap-2 bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-accent"
              onClick={copyArchiveLink}
              type="button"
            >
              {copied ? (
                <Check aria-hidden="true" size={15} />
              ) : (
                <Copy aria-hidden="true" size={15} />
              )}
              {copied ? "Link copied" : "Copy archive link"}
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}
