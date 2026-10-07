"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type CopyEmailProps = {
  className?: string;
  email: string;
};

export function CopyEmail({ className, email }: CopyEmailProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const classes = [
    "group flex min-h-12 cursor-pointer flex-wrap items-center gap-4 rounded-lg border border-black/[0.08] bg-surface-container px-6 py-3.5 text-left transition-colors hover:border-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button className={classes} type="button" onClick={copyEmail}>
      <span className="font-mono text-base font-medium text-ink md:text-lg">
        {email}
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition-colors group-hover:text-accent">
        {status === "copied" ? (
          <>
            Copied <Check aria-hidden="true" size={14} strokeWidth={2} />
          </>
        ) : (
          "Click to copy"
        )}
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
