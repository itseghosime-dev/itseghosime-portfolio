"use client";

import { Check, Link2, Mail, Share2, Type } from "lucide-react";
import { useState } from "react";

import type { NoteReaderLabels } from "@/types/notes";

type NoteReadingToolsProps = {
  articleId: string;
  email?: string;
  labels: NoteReaderLabels;
  title: string;
};

export function NoteReadingTools({
  articleId,
  email,
  labels,
  title,
}: NoteReadingToolsProps) {
  const [copied, setCopied] = useState(false);
  const [serifBody, setSerifBody] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          throw error;
      }
      return;
    }
    await copyLink();
  }

  function toggleTypeface() {
    const article = document.getElementById(articleId);
    if (!article) return;
    const nextValue = !serifBody;
    article.classList.toggle("font-serif", nextValue);
    setSerifBody(nextValue);
  }

  const feedbackHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Feedback on ${title}`)}`
    : "/contact";

  return (
    <div className="space-y-3 font-mono text-[0.6875rem] text-ink-muted">
      <div className="flex items-center justify-between border-b border-black/[0.09] pb-2 uppercase tracking-[0.09em]">
        <span>{labels.toolsHeading}</span>
        <span className="text-[0.625rem] font-semibold text-accent">
          {labels.toolsBadge}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          className="group inline-flex min-h-14 flex-col items-center justify-center gap-1 border border-black/10 bg-surface px-2 text-[0.625rem] text-ink-muted transition-colors hover:border-black/25 hover:bg-surface-layer hover:text-ink"
          onClick={share}
          type="button"
        >
          <Share2
            aria-hidden="true"
            className="group-hover:text-accent"
            size={15}
          />
          {labels.share}
        </button>
        <button
          className="group inline-flex min-h-14 flex-col items-center justify-center gap-1 border border-black/10 bg-surface px-2 text-[0.625rem] text-ink-muted transition-colors hover:border-black/25 hover:bg-surface-layer hover:text-ink"
          onClick={copyLink}
          type="button"
        >
          {copied ? (
            <Check aria-hidden="true" className="text-accent" size={15} />
          ) : (
            <Link2
              aria-hidden="true"
              className="group-hover:text-accent"
              size={15}
            />
          )}
          {copied ? labels.copied : labels.copy}
        </button>
        <button
          aria-pressed={serifBody}
          className="group inline-flex min-h-14 flex-col items-center justify-center gap-1 border border-black/10 bg-surface px-2 text-[0.625rem] text-ink-muted transition-colors hover:border-black/25 hover:bg-surface-layer hover:text-ink"
          onClick={toggleTypeface}
          type="button"
        >
          <Type
            aria-hidden="true"
            className="group-hover:text-accent"
            size={15}
          />
          {labels.typeface}
        </button>
      </div>
      <a
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 border border-black/10 bg-surface px-3 text-[0.625rem] font-semibold text-ink no-underline transition-colors hover:border-black/25 hover:bg-surface-layer hover:text-accent"
        href={feedbackHref}
      >
        <Mail aria-hidden="true" size={14} />
        {labels.feedback}
      </a>
    </div>
  );
}
