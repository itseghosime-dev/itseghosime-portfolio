"use client";

import { ListTree } from "lucide-react";
import { useEffect, useState } from "react";

import type { NoteHeading } from "@/types/notes";

export function NoteTableOfContents({
  headings,
  label,
}: {
  headings: NoteHeading[];
  label: string;
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
    <nav aria-label="Table of contents" className="border-y border-black/[0.09] py-5 lg:border-y-0 lg:py-0">
      <div className="mb-4 flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink">
        <ListTree aria-hidden="true" className="text-accent" size={15} strokeWidth={1.8} />
        {label}
      </div>
      <ol className="m-0 grid list-none gap-1.5 p-0">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                aria-current={isActive ? "location" : undefined}
                className={`block border-l py-1.5 pr-2 text-[0.78rem] leading-5 no-underline transition-colors ${heading.level === 3 ? "pl-6" : "pl-3"} ${isActive ? "border-accent text-ink" : "border-black/10 text-ink-muted hover:border-black/35 hover:text-ink"}`}
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
