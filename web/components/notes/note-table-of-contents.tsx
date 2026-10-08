"use client";

import { useEffect, useState } from "react";

import type { NoteHeading } from "@/types/notes";

export function NoteTableOfContents({
  headings,
  label,
  sectionCountLabel,
}: {
  headings: NoteHeading[];
  label: string;
  sectionCountLabel: string;
}) {
  const [activeId, setActiveId] = useState(headings.at(0)?.id ?? "");

  useEffect(() => {
    const sections = headings.flatMap((heading) => {
      const element = document.getElementById(heading.id);
      return element ? [element] : [];
    });
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -70%", threshold: [0, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="border-y border-black/[0.09] py-5 lg:border-y-0 lg:py-0"
    >
      <div className="mb-4 flex items-center justify-between border-b border-black/[0.09] pb-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-[0.625rem]">
          {headings.length} {sectionCountLabel}
        </span>
      </div>
      <ol className="m-0 grid list-none gap-2 p-0">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                aria-current={isActive ? "location" : undefined}
                className={`block border-l py-1 pr-2 text-xs leading-5 no-underline transition-colors ${heading.level === 3 ? "pl-5" : "pl-2.5"} ${isActive ? "border-accent font-medium text-ink" : "border-transparent text-ink-muted hover:border-accent hover:text-ink"}`}
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
