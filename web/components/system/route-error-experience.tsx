"use client";

import { Bug, House, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Container } from "@/components/ui/container";
import { SITE_EMAIL } from "@/lib/site";

import { SystemFooter, SystemHeader } from "./system-shell";

export function RouteErrorExperience({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SystemHeader />
      <main id="main-content">
        <Container className="py-14 sm:py-20 lg:py-28">
          <section className="mx-auto max-w-[68rem] border border-black/15 bg-surface p-6 shadow-[0_24px_70px_-52px_rgba(22,23,25,0.45)] sm:p-10 lg:p-14">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent">
                <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                Segment isolated · shell intact
              </p>
              {error.digest ? (
                <code className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
                  Reference {error.digest}
                </code>
              ) : null}
            </div>

            <div className="max-w-3xl py-10 sm:py-14">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
                Route runtime / recoverable
              </p>
              <h1 className="mt-4 font-serif text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.04em]">
                That part didn’t load correctly.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
                The problem has been contained to this route. You can try the request again,
                return to a stable page, or share the reference code if the issue continues.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-accent"
                  onClick={reset}
                  type="button"
                >
                  <RefreshCw aria-hidden="true" size={16} /> Try again
                </button>
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/20 px-6 text-sm font-semibold no-underline transition-colors hover:border-ink hover:bg-surface-container"
                  href="/"
                >
                  <House aria-hidden="true" size={16} /> Return home
                </Link>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-medium text-ink-muted no-underline hover:text-accent"
                  href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(`Portfolio issue${error.digest ? ` · ${error.digest}` : ""}`)}`}
                >
                  <Bug aria-hidden="true" size={16} /> Report the issue
                </a>
              </div>
            </div>

            <div className="border-l-2 border-accent bg-surface-container px-5 py-4 text-sm leading-6 text-ink-muted">
              Navigation and the rest of the portfolio remain available. No private diagnostic
              details are displayed in this recovery screen.
            </div>
          </section>
        </Container>
      </main>
      <SystemFooter />
    </>
  );
}
