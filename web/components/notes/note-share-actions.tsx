"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function NoteShareActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
      return;
    }
    await copyLink();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="inline-flex min-h-10 items-center gap-2 border border-black/12 px-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.07em] transition-colors hover:border-ink hover:bg-ink hover:text-white"
        onClick={copyLink}
        type="button"
      >
        {copied ? <Check aria-hidden="true" size={13} /> : <Copy aria-hidden="true" size={13} />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        className="inline-flex min-h-10 items-center gap-2 border border-black/12 px-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.07em] transition-colors hover:border-ink hover:bg-ink hover:text-white"
        onClick={share}
        type="button"
      >
        <Share2 aria-hidden="true" size={13} />
        Share
      </button>
    </div>
  );
}
