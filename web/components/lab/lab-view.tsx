"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  LabCategory,
  LabExperimentModel,
  LabPageModel,
} from "@/types/lab";

import { useSmoothScroll } from "@/components/motion/smooth-scroll-provider";
import { LabExperimentCard } from "./lab-experiment-card";
import { LabMotion } from "./lab-motion";

type LabViewProps = { experiments: LabExperimentModel[]; page: LabPageModel };

const categoryLabels: Record<LabCategory, string> = {
  all: "All",
  interaction: "Interaction",
  uiForms: "UI & forms",
  dataViz: "Data & viz",
  threeDShaders: "3D & shaders",
  motion: "Motion",
};

const categories = Object.keys(categoryLabels) as LabCategory[];

export function LabView({ experiments, page }: LabViewProps) {
  const { scrollTo } = useSmoothScroll();
  const [activeCategory, setActiveCategory] = useState<LabCategory>("all");
  const counts = useMemo(
    () =>
      categories.reduce<Record<LabCategory, number>>(
        (result, category) => ({
          ...result,
          [category]:
            category === "all"
              ? experiments.length
              : experiments.filter(
                  (experiment) => experiment.category === category,
                ).length,
        }),
        {
          all: 0,
          interaction: 0,
          uiForms: 0,
          dataViz: 0,
          threeDShaders: 0,
          motion: 0,
        },
      ),
    [experiments],
  );

  const filteredExperiments = experiments.filter(
    (experiment) =>
      activeCategory === "all" || experiment.category === activeCategory,
  );
  const [featured, second, third, fourth, ...archive] = filteredExperiments;

  function handleSurpriseMe() {
    const cards = document.querySelectorAll<HTMLElement>("[data-lab-card]");
    if (!cards.length) return;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    scrollTo(randomCard, { offset: -160 });
    randomCard.animate(
      [
        { boxShadow: "0 0 0 0 rgb(65 105 225 / 0)" },
        { boxShadow: "0 0 0 3px rgb(65 105 225 / 0.42)" },
        { boxShadow: "0 0 0 0 rgb(65 105 225 / 0)" },
      ],
      { duration: 1200, easing: "cubic-bezier(.2,0,0,1)" },
    );
  }

  return (
    <LabMotion>
      <div className="mx-auto max-w-[70rem]">
        <header
          className="border-b border-black/[0.08] pb-10 pt-2 sm:pb-12 sm:pt-4 lg:pb-14"
          data-lab-reveal
        >
          <div className="flex flex-col gap-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-accent">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />
              {page.eyebrow}
            </p>
            <p className="text-ink-muted">
              {String(experiments.length).padStart(2, "0")}{" "}
              {page.activeStudiesLabel}
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-[48rem] space-y-5">
              <h1 className="max-w-[42rem] font-serif text-[clamp(3rem,6.5vw,5.25rem)] leading-[0.94] tracking-[-0.05em] text-ink">
                {page.heading}
              </h1>
              <p className="max-w-[43rem] text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
                {page.introduction}
              </p>
            </div>
            <button
              className="group inline-flex min-h-11 w-fit items-center gap-2 border border-black/15 bg-surface px-4 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={experiments.length === 0}
              onClick={handleSurpriseMe}
              type="button"
            >
              <Sparkles
                aria-hidden="true"
                className="text-accent group-hover:text-white"
                size={14}
                strokeWidth={1.8}
              />
              {page.surpriseLabel}
            </button>
          </div>

          <nav aria-label="Lab categories" className="mt-12 overflow-x-auto">
            <div className="flex min-w-max gap-7 border-b border-black/[0.08] sm:gap-9">
              {categories.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <button
                    aria-pressed={isActive}
                    className={`flex min-h-11 items-center gap-2 border-b-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors ${isActive ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink"}`}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {categoryLabels[category]}{" "}
                    <span
                      className={isActive ? "text-accent" : "text-ink-muted/70"}
                    >
                      {String(counts[category]).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </header>

        {filteredExperiments.length > 0 ? (
          <section
            aria-label="Lab experiments"
            className="space-y-12 py-12 sm:space-y-14 sm:py-16 lg:space-y-16"
          >
            {featured ? (
              <LabExperimentCard experiment={featured} variant="featured" />
            ) : null}
            {second || third ? (
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                {second ? (
                  <LabExperimentCard experiment={second} variant="paired" />
                ) : null}
                {third ? (
                  <LabExperimentCard experiment={third} variant="paired" />
                ) : null}
              </div>
            ) : null}
            {fourth ? (
              <LabExperimentCard experiment={fourth} variant="wide" />
            ) : null}

            {archive.length > 0 ? (
              <section
                className="border-t border-black/[0.08] pt-14 sm:pt-16"
                data-lab-reveal
              >
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
                      {page.archiveEyebrow}
                    </p>
                    <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,2.75rem)] tracking-[-0.03em] text-ink">
                      {page.archiveHeading}
                    </h2>
                  </div>
                  {page.archiveNote ? (
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted">
                      {page.archiveNote}
                    </p>
                  ) : null}
                </div>
                <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
                  {archive.map((experiment) => (
                    <article
                      className="group grid gap-3 px-3 py-5 transition-colors hover:bg-surface sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:px-5"
                      data-lab-card
                      key={experiment.id}
                    >
                      <span className="font-mono text-xs font-semibold text-accent">
                        {experiment.number}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold tracking-[-0.01em] text-ink">
                          {experiment.title}
                        </h3>
                        <p className="mt-1 font-mono text-[0.6875rem] text-ink-muted">
                          {experiment.stack}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-ink-muted">
                        {experiment.year ?? experiment.status}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </section>
        ) : (
          <section
            aria-live="polite"
            className="grid min-h-72 place-items-center border-b border-black/[0.08] py-16 text-center"
          >
            <div className="max-w-md space-y-3">
              <p className="font-serif text-3xl tracking-[-0.03em]">
                The bench is being prepared.
              </p>
              <p className="leading-7 text-ink-muted">
                Published experiments in this category will appear here.
              </p>
            </div>
          </section>
        )}

        <section
          className="border-t border-black/[0.08] py-16 sm:py-20"
          data-lab-reveal
        >
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-xl space-y-4">
              <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
                {page.closingEyebrow}
              </p>
              <h2 className="font-serif text-[clamp(2.5rem,4.5vw,3.5rem)] leading-none tracking-[-0.04em] text-ink">
                {page.closingHeading}
              </h2>
              <p className="text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
                {page.closingMessage}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
              <Link
                className="font-semibold no-underline hover:text-accent"
                href="/work"
              >
                {page.workLinkLabel} →
              </Link>
              <a
                className="text-ink-muted no-underline hover:text-ink"
                href="https://github.com/itseghosime-dev"
                rel="noreferrer"
                target="_blank"
              >
                {page.githubLinkLabel} ↗
              </a>
              <Link
                className="text-ink-muted no-underline hover:text-ink"
                href="/contact"
              >
                {page.contactLinkLabel} ↗
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LabMotion>
  );
}
