"use client";

import { useState } from "react";

type CopyEmailProps = {
  email: string;
};

export function CopyEmail({ email }: CopyEmailProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button
      className="group flex min-h-12 cursor-pointer flex-wrap items-center gap-4 rounded-xl border border-black/[0.08] bg-surface-container px-6 py-3.5 text-left hover:border-accent"
      type="button"
      onClick={copyEmail}
    >
      <span className="font-mono text-base font-medium text-ink md:text-lg">
        {email}
      </span>
      <span className="text-xs font-semibold text-ink-muted transition-colors group-hover:text-accent">
        {status === "copied" ? "Copied ✓" : "Click to copy"}
      </span>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Email address copied to clipboard." : null}
        {status === "failed"
          ? "Copy failed. Use the email link instead."
          : null}
      </span>
    </button>
  );
}
