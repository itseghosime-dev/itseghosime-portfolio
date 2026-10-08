"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Files, MousePointerClick } from "lucide-react";

import type { ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { CodeBlock } from "./code-block";
import { SectionHeading } from "./section-heading";

export function CodeShowcaseSection({
  section,
}: {
  section: ProjectSectionOf<"codeShowcaseSection">;
}) {
  const snippets =
    section.snippets?.filter((snippet) => snippet.title && snippet.code) ?? [];
  const [activeKey, setActiveKey] = useState(snippets[0]?._key ?? "");
  const [copied, setCopied] = useState(false);
  if (!section.heading || snippets.length === 0) return null;

  const active =
    snippets.find((snippet) => snippet._key === activeKey) ?? snippets[0];

  async function copyCode() {
    if (!active?.code) return;
    await navigator.clipboard.writeText(active.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="border-b border-black/[0.08] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-12 lg:gap-16">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            introduction={section.introduction}
          />
          {section.presentation === "stacked" ? (
            <div className="grid gap-8">
              {snippets.map((snippet) => (
                <CodePanel
                  key={snippet._key}
                  onCopy={() =>
                    navigator.clipboard.writeText(snippet.code ?? "")
                  }
                  snippet={snippet}
                />
              ))}
            </div>
          ) : (
            <div
              className="overflow-hidden border border-black/[0.1] bg-[#101318] text-white shadow-[0_28px_75px_-46px_rgba(0,0,0,0.65)]"
              data-project-reveal
            >
              <div className="border-b border-white/10 bg-white/[0.035] px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[#9cb2ff]">
                      <Files aria-hidden="true" size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Choose an example to explore
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-white/55">
                        {snippets.length} code examples are available in this panel.
                      </p>
                    </div>
                  </div>
                  <p className="hidden items-center gap-2 text-xs text-white/45 sm:flex">
                    <MousePointerClick aria-hidden="true" size={14} />
                    Click any option below
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto border-b border-white/10 p-3 [scrollbar-width:none]">
                <div
                  aria-label="Code examples"
                  className="flex min-w-max items-stretch gap-2"
                  role="tablist"
                >
                  {snippets.map((snippet, index) => (
                    <button
                      aria-controls={`code-panel-${snippet._key}`}
                      aria-selected={snippet._key === active?._key}
                      className={`group flex min-w-[10.5rem] shrink-0 items-center gap-3 rounded-md border px-3 py-3 text-left transition-[border-color,background-color,color] ${snippet._key === active?._key ? "border-[#7994ff]/55 bg-[#7994ff]/12 text-white" : "border-white/10 bg-white/[0.025] text-white/60 hover:border-white/25 hover:bg-white/[0.055] hover:text-white"}`}
                      id={`code-tab-${snippet._key}`}
                      key={snippet._key}
                      onClick={() => {
                        setActiveKey(snippet._key);
                        setCopied(false);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                        event.preventDefault();
                        const direction = event.key === "ArrowRight" ? 1 : -1;
                        const nextIndex = (index + direction + snippets.length) % snippets.length;
                        const nextSnippet = snippets[nextIndex];
                        if (!nextSnippet) return;
                        setActiveKey(nextSnippet._key);
                        document.getElementById(`code-tab-${nextSnippet._key}`)?.focus();
                      }}
                      role="tab"
                      tabIndex={snippet._key === active?._key ? 0 : -1}
                      type="button"
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full border font-mono text-xs ${snippet._key === active?._key ? "border-[#9cb2ff]/55 bg-[#9cb2ff]/15 text-[#c5d0ff]" : "border-white/10 text-white/45 group-hover:text-white/70"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="grid min-w-0 gap-0.5">
                        <span className="text-xs font-semibold leading-5">
                          {snippet.title}
                        </span>
                        {snippet.filename ? (
                          <span className="truncate font-mono text-xs text-white/42">
                            {snippet.filename}
                          </span>
                        ) : null}
                      </span>
                      {snippet._key === active?._key ? (
                        <Check aria-hidden="true" className="ml-auto shrink-0 text-[#9cb2ff]" size={14} />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
              {active ? (
                <div
                  aria-labelledby={`code-tab-${active._key}`}
                  id={`code-panel-${active._key}`}
                  role="tabpanel"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3 font-mono text-xs text-white/55">
                    <span>{active.language}</span>
                    <button
                      className="inline-flex min-h-9 items-center gap-2 text-white/65 hover:text-white"
                      onClick={copyCode}
                      type="button"
                    >
                      {copied ? (
                        <Check aria-hidden="true" size={14} />
                      ) : (
                        <Copy aria-hidden="true" size={14} />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <CodeBlock code={active.code ?? ""} language={active.language} />
                  <div className="grid gap-3 border-t border-white/10 bg-white/[0.025] p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <div>
                      <h3 className="text-sm font-semibold">{active.title}</h3>
                      <p className="mt-2 max-w-3xl text-xs leading-6 text-white/58">
                        {active.explanation}
                      </p>
                    </div>
                    {active.sourceUrl ? (
                      <a
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#9cb2ff] no-underline"
                        href={active.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        View source{" "}
                        <ArrowUpRight aria-hidden="true" size={13} />
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

type Snippet = NonNullable<
  ProjectSectionOf<"codeShowcaseSection">["snippets"]
>[number];

function CodePanel({
  onCopy,
  snippet,
}: {
  onCopy: () => void;
  snippet: Snippet;
}) {
  return (
    <article
      className="overflow-hidden border border-black/[0.1] bg-[#101318] text-white"
      data-project-reveal
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="font-mono text-xs text-white/58">
          {snippet.filename ?? snippet.title}
        </p>
        <button
          className="text-white/60 hover:text-white"
          onClick={onCopy}
          type="button"
          aria-label={`Copy ${snippet.title ?? "code"}`}
        >
          <Copy aria-hidden="true" size={15} />
        </button>
      </div>
      <CodeBlock code={snippet.code ?? ""} language={snippet.language} />
      <div className="border-t border-white/10 p-5">
        <h3 className="text-sm font-semibold">{snippet.title}</h3>
        <p className="mt-2 text-xs leading-6 text-white/58">
          {snippet.explanation}
        </p>
      </div>
    </article>
  );
}
