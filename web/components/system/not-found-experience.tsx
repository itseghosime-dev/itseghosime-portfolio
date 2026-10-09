"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Copy,
  FlaskConical,
  NotebookText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PointerEvent } from "react";

import { Container } from "@/components/ui/container";

import { SystemFooter, SystemHeader } from "./system-shell";

const destinations = [
  {
    description: "Browse production work and detailed case studies.",
    href: "/work",
    icon: BriefcaseBusiness,
    label: "Work archive",
  },
  {
    description: "Explore interaction studies and frontend experiments.",
    href: "/lab",
    icon: FlaskConical,
    label: "Lab experiments",
  },
  {
    description: "Read practical notes on interfaces and engineering.",
    href: "/notes",
    icon: NotebookText,
    label: "Technical notes",
  },
] as const;

export function NotFoundExperience() {
  const pathname = usePathname() || "/unknown";
  const [copied, setCopied] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  async function copyPath() {
    try {
      await navigator.clipboard.writeText(pathname);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function moveCoordinate(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: Math.round(event.clientX - bounds.left - bounds.width / 2),
      y: Math.round(event.clientY - bounds.top - bounds.height / 2),
    });
  }

  return (
    <>
      <SystemHeader />
      <main id="main-content">
        <Container className="py-10 sm:py-14 lg:py-20">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-6 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none"
              />
              <span className="font-semibold text-ink">System</span>
              <span>/</span>
              <span className="text-accent-text">404 not found</span>
            </p>
            <div className="flex min-w-0 items-center gap-2 border border-black/10 bg-surface px-3 py-2 normal-case tracking-normal">
              <span className="shrink-0 uppercase tracking-[0.08em]">Path</span>
              <code className="min-w-0 truncate text-accent-text">{pathname}</code>
              <button
                aria-label="Copy requested path"
                className="grid size-8 shrink-0 place-items-center text-ink-muted transition-colors hover:text-ink"
                onClick={copyPath}
                type="button"
              >
                {copied ? (
                  <Check aria-hidden="true" size={14} />
                ) : (
                  <Copy aria-hidden="true" size={14} />
                )}
              </button>
            </div>
          </div>

          <section className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="lg:col-span-7 lg:pr-8">
              <div className="flex flex-col gap-4">
                <p className="inline-flex border w-fit border-black/10 bg-surface-container px-3 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  <span className="mr-2 text-[var(--error)]">404</span>{" "}
                  Coordinate offset
                </p>
                <h1 className="mt-7 max-w-3xl font-serif text-[clamp(3.5rem,8vw,5.25rem)] leading-[0.95] tracking-[-0.04em]">
                  Nothing lives here.
                </h1>
              </div>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-soft sm:text-xl sm:leading-9">
                This address may have moved, been renamed during a content
                update, or never existed. The rest of the archive is still
                available.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-6 text-sm font-semibold text-white no-underline transition-colors hover:bg-accent-hover"
                  href="/"
                >
                  Back to home <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center border border-black/20 px-6 text-sm font-semibold no-underline transition-colors hover:border-ink hover:bg-surface"
                  href="/work"
                >
                  Browse work archive
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-black/10 pt-5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
                <span>HTTP status: 404</span>
                <span className="text-accent-text">Index missing</span>
                <span>No location data collected</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="relative mx-auto aspect-square w-full max-w-[29rem] overflow-hidden border border-black/12 bg-surface shadow-[0_22px_60px_-42px_rgba(22,23,25,0.42)]"
                onPointerLeave={() => setOffset({ x: 0, y: 0 })}
                onPointerMove={moveCoordinate}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-55"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(22,23,25,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(22,23,25,.08) 1px, transparent 1px)",
                    backgroundSize: "2rem 2rem",
                  }}
                />
                <div className="absolute inset-x-5 top-5 flex justify-between border-b border-black/10 pb-3 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
                  <span>Unindexed node</span>
                  <span>Grid 12 × 12</span>
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="relative size-44 transition-transform duration-150 ease-out motion-reduce:transform-none"
                    style={{
                      transform: `translate(${offset.x * 0.08}px, ${offset.y * 0.08}px) rotate(${offset.x * 0.01}deg)`,
                    }}
                  >
                    <span className="absolute inset-0 rotate-12 border border-accent/35" />
                    <span className="absolute inset-8 -rotate-12 border border-black/20" />
                    <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_28px_rgba(65,105,225,0.65)]" />
                  </div>
                </div>
                <div className="absolute inset-x-5 bottom-5 flex justify-between border-t border-black/10 pt-3 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
                  <span>Delta x: {offset.x}</span>
                  <span>Delta y: {offset.y}</span>
                </div>
              </div>
            </div>
          </section>

          <section
            className="border-t border-black/10 py-14 sm:py-16"
            aria-labelledby="destinations-title"
          >
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent-text">
                  Recovery routes
                </p>
                <h2
                  className="mt-3 font-serif text-3xl tracking-[-0.03em]"
                  id="destinations-title"
                >
                  Common destinations
                </h2>
              </div>
              <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted sm:block">
                3 indexed nodes
              </span>
            </div>
            <div className="mt-8 grid border-l border-t border-black/10 md:grid-cols-3">
              {destinations.map((destination) => {
                const Icon = destination.icon;
                return (
                  <Link
                    className="group grid min-h-52 content-between border-b border-r border-black/10 bg-surface p-6 no-underline transition-colors hover:bg-surface-container"
                    href={destination.href}
                    key={destination.href}
                  >
                    <Icon
                      aria-hidden="true"
                      className="text-accent"
                      size={20}
                      strokeWidth={1.6}
                    />
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-accent">
                        {destination.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ink-muted">
                        {destination.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </Container>
      </main>
      <SystemFooter />
    </>
  );
}
