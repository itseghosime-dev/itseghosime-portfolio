"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { BrandMark } from "@/components/ui/brand-mark";

import "./globals.css";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <title>System problem | ITSEGHOSIME</title>
        <main className="grid min-h-screen place-items-center px-5 py-12">
          <section className="w-full max-w-3xl border border-black/15 bg-surface p-7 text-center shadow-[0_24px_70px_-52px_rgba(22,23,25,0.5)] sm:p-12 lg:p-16">
            <BrandMark className="mx-auto w-10" title="ITSEGHOSIME" />
            <p className="mt-8 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Global root catch · zero blame
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.98] tracking-[-0.04em]">
              The site hit an unexpected problem.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
              The main application shell could not finish rendering. Reload the experience,
              or return to the permanent work archive.
            </p>
            <div className="mx-auto mt-9 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <button
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-accent"
                onClick={reset}
                type="button"
              >
                <RefreshCw aria-hidden="true" size={16} /> Reload experience
              </button>
              <Link
                className="inline-flex min-h-12 flex-1 items-center justify-center border border-black/20 px-6 text-sm font-semibold no-underline transition-colors hover:border-ink hover:bg-surface-container"
                href="/work"
              >
                Open work archive
              </Link>
            </div>
            <div className="mt-10 border-t border-black/10 pt-6 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
              <p>Root boundary exhausted{error.digest ? ` · Reference ${error.digest}` : ""}</p>
              <a
                className="mt-2 inline-block normal-case tracking-normal text-accent"
                href="mailto:info.itseghosime@gmail.com"
              >
                info.itseghosime@gmail.com
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
