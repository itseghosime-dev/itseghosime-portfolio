"use client";

import { ArrowUpRight, Check, Download, Sparkles, X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { HomePageModel } from "@/types/home";

type RecruiterBriefDrawerProps = {
  capabilities: HomePageModel["capabilities"];
  email: string;
  hero: HomePageModel["hero"];
  isOpen: boolean;
  onClose: () => void;
  resume?: HomePageModel["contact"]["resume"];
  technologies: HomePageModel["technologies"];
};

export function RecruiterBriefDrawer({
  capabilities,
  email,
  hero,
  isOpen,
  onClose,
  resume,
  technologies,
}: RecruiterBriefDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const currentTechnologyNames = technologies
    .slice(0, 8)
    .map((technology) =>
      technology.name === "Sanity" ? "Python" : technology.name,
    );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable?.length) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible delay-300"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        tabIndex={isOpen ? 0 : -1}
        type="button"
        aria-label="Close recruiter summary"
        onClick={onClose}
      />
      <aside
        className={`absolute top-0 right-0 flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-black/[0.1] bg-background shadow-[-20px_0_60px_rgba(22,23,25,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-labelledby="recruiter-brief-title"
        aria-modal="true"
        ref={drawerRef}
        role="dialog"
      >
        <div className="relative flex min-h-24 items-center border-b border-black/[0.08] px-6 py-6 pr-24 sm:py-8 sm:pr-32 sm:pl-10">
          <div className="flex min-w-0 items-center gap-3">
            <Sparkles
              aria-hidden="true"
              className="text-accent"
              size={16}
              strokeWidth={1.8}
            />
            <h2 className="font-serif text-2xl" id="recruiter-brief-title">
              Recruiter web summary
            </h2>
          </div>
          <button
            className="absolute top-6 right-8 grid size-11 shrink-0 cursor-pointer place-items-center border border-black/15 bg-transparent text-xl transition-colors hover:bg-ink hover:text-white sm:top-8 sm:right-16"
            ref={closeButtonRef}
            type="button"
            aria-label="Close recruiter summary"
            onClick={onClose}
          >
            <X aria-hidden="true" size={21} strokeWidth={1.7} />
          </button>
        </div>

        <div className="grid flex-1 content-start gap-12 px-6 py-10 sm:py-12 sm:pr-16 sm:pl-10">
          <section className="pr-0 sm:pr-6">
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] mb-4">
              <span className="text-accent">Status: {hero.availability}</span>
              <span className="text-ink-muted">UTC+1 · Remote</span>
            </div>
            <h3 className="mt-7 max-w-lg font-serif text-4xl leading-[1.02] tracking-[-0.025em] sm:text-5xl">
              {hero.professionalTitle}
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-7 text-ink-soft">
              {hero.introduction}
            </p>
            {hero.availabilityNote ? (
              <p className="mt-4 max-w-xl text-xs leading-6 text-ink-muted">
                {hero.availabilityNote}
              </p>
            ) : null}
          </section>

          <section
            className="border-t border-black/[0.08] pt-10"
            aria-labelledby="brief-stack-title"
          >
            <h3
              className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted"
              id="brief-stack-title"
            >
              Current technology focus
            </h3>
            <ul className="mt-6 flex list-none flex-wrap gap-3 p-0">
              {currentTechnologyNames.map((technology) => (
                <li
                  className="border border-black/15 bg-surface px-4 py-2.5 text-xs"
                  key={technology}
                >
                  {technology}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="border-t border-black/[0.08] pt-10"
            aria-labelledby="brief-capabilities-title"
          >
            <h3
              className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted"
              id="brief-capabilities-title"
            >
              Supported capabilities
            </h3>
            <ul className="mt-6 grid list-none gap-6 p-0">
              {capabilities.slice(0, 4).map((capability) => (
                <li
                  className="grid grid-cols-[1rem_1fr] gap-4 text-sm leading-7"
                  key={capability.title}
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1 text-accent"
                    size={15}
                    strokeWidth={2}
                  />
                  <span>
                    <strong className="block font-semibold text-ink">
                      {capability.title}
                    </strong>
                    <span className="text-ink-soft">
                      {capability.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid gap-4 border-t border-black/[0.08] p-6 sm:py-10 sm:pr-16 sm:pl-10">
          {resume ? (
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/15 bg-transparent px-5 py-3 text-sm font-semibold no-underline transition-colors hover:border-ink hover:bg-surface-layer"
              href={resume.url}
              rel="noreferrer"
              target="_blank"
            >
              <Download aria-hidden="true" size={15} strokeWidth={1.8} />
              {resume.label}
            </a>
          ) : null}
          <a
            className="inline-flex min-h-12 items-center justify-center bg-accent px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[var(--accent-hover)]"
            href={`mailto:${email}?subject=Opportunity%20for%20Abdulrahman%20Itseghosime%20Bello`}
          >
            Fast-track an email conversation
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </a>
          <button
            className="min-h-12 cursor-pointer border border-black/15 bg-transparent px-5 py-3 text-sm font-semibold hover:bg-surface-layer"
            type="button"
            onClick={onClose}
          >
            Use standard contact form
          </button>
        </div>
      </aside>
    </div>
  );
}
