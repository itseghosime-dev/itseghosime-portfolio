import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { LabExperimentModel } from "@/types/lab";

import { LabPresentation } from "./lab-presentation";

type LabExperimentCardProps = {
  experiment: LabExperimentModel;
  variant: "featured" | "paired" | "wide";
};

function ExperimentAction({ experiment }: { experiment: LabExperimentModel }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-black/[0.08] pt-5 font-mono text-[0.6875rem]">
      {experiment.demoUrl ? (
        <a
          className="group/link inline-flex min-h-11 items-center gap-2 font-semibold text-ink no-underline hover:text-accent"
          href={experiment.demoUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open experiment
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover/link:translate-x-1"
            size={14}
          />
        </a>
      ) : (
        <span className="inline-flex min-h-11 items-center font-semibold text-ink-muted">
          {experiment.status === "Planned"
            ? "In development"
            : "Demo coming soon"}
        </span>
      )}
      {experiment.sourceUrl ? (
        <a
          className="inline-flex min-h-11 items-center gap-1.5 text-ink-muted no-underline hover:text-ink"
          href={experiment.sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          Source <ArrowUpRight aria-hidden="true" size={13} />
        </a>
      ) : null}
    </div>
  );
}

function ExperimentCopy({ experiment }: { experiment: LabExperimentModel }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 border-b border-black/[0.08] pb-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em]">
        <span className="font-semibold text-accent">
          {experiment.number} {"//"} {experiment.categoryLabel}
        </span>
        <span className="shrink-0 text-ink-muted">
          {experiment.year ?? experiment.status}
        </span>
      </div>
      <h3 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.03em] text-ink">
        {experiment.title}
      </h3>
      <p className="text-[0.9375rem] leading-7 text-ink-soft">
        {experiment.summary}
      </p>
      <div>
        <p className="mb-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
          Architecture &amp; stack
        </p>
        <p className="font-mono text-xs leading-5 text-ink">
          {experiment.stack}
        </p>
      </div>
    </div>
  );
}

export function LabExperimentCard({
  experiment,
  variant,
}: LabExperimentCardProps) {
  if (variant === "featured") {
    return (
      <article
        className="group grid border border-black/[0.08] bg-surface lg:grid-cols-[1.15fr_0.85fr]"
        data-lab-card
        data-lab-reveal
      >
        <div className="min-w-0 border-b border-black/[0.08] p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <LabPresentation experiment={experiment} />
        </div>
        <div className="flex flex-col justify-between gap-8 p-7 sm:p-9 lg:p-10">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em]">
              <span className="text-accent">
                Featured // {experiment.number}
              </span>
              {experiment.status ? (
                <span className="border border-black/[0.08] bg-background px-2.5 py-1 text-ink-muted">
                  {experiment.status}
                </span>
              ) : null}
            </div>
            <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1.02] tracking-[-0.035em] text-ink">
              {experiment.title}
            </h2>
            <p className="text-[0.9375rem] leading-7 text-ink-soft">
              {experiment.summary}
            </p>
            <div className="border-t border-black/[0.08] pt-5">
              <p className="mb-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Architecture &amp; stack
              </p>
              <p className="font-mono text-xs leading-5 text-ink">
                {experiment.stack}
              </p>
            </div>
          </div>
          <ExperimentAction experiment={experiment} />
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article
        className="grid border border-black/[0.08] bg-surface lg:grid-cols-[0.84fr_1.16fr] lg:items-stretch"
        data-lab-card
        data-lab-reveal
      >
        <div className="flex flex-col justify-between gap-8 p-7 sm:p-9 lg:p-10">
          <ExperimentCopy experiment={experiment} />
          <ExperimentAction experiment={experiment} />
        </div>
        <div className="min-w-0 border-t border-black/[0.08] p-5 sm:p-7 lg:border-l lg:border-t-0">
          <LabPresentation compact experiment={experiment} />
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex min-w-0 flex-col border border-black/[0.08] bg-surface"
      data-lab-card
      data-lab-reveal
    >
      <div className="border-b border-black/[0.08] p-5 sm:p-6">
        <LabPresentation compact experiment={experiment} />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-8 p-7 sm:p-8">
        <ExperimentCopy experiment={experiment} />
        <div className="flex items-end justify-between gap-4">
          <ExperimentAction experiment={experiment} />
          {experiment.version ? (
            <span className="pb-3 font-mono text-[0.6875rem] text-ink-muted">
              {experiment.version}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
