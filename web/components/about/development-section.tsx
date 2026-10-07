import {ExternalLink} from "lucide-react";

import type {AboutMilestone} from "@/types/about";

import {Container} from "@/components/ui/container";

type DevelopmentSectionProps = {
  education: AboutMilestone[]
  educationHeading: string
  learning: AboutMilestone[]
  learningHeading: string
};

function DevelopmentItem({milestone}: {milestone: AboutMilestone}) {
  return (
    <li className="border-b border-black/[0.08] py-6 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-center justify-between font-mono text-[0.625rem] text-accent">
        <span className="font-semibold uppercase tracking-[0.08em]">{milestone.dateLabel}</span>
        {milestone.status ? <span className="text-ink-muted">{milestone.status}</span> : null}
      </div>
      <h3 className="mt-2.5 font-serif text-lg tracking-[-0.015em] text-ink sm:text-xl">
        {milestone.title}
      </h3>
      <p className="mt-1 font-mono text-xs text-ink-muted">{milestone.organisation}</p>
      <p className="mt-3 text-xs leading-6 text-ink-soft sm:text-[0.8125rem]">
        {milestone.summary}
      </p>
      {milestone.credentialUrl ? (
        <a
          className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent no-underline transition-colors hover:text-ink"
          href={milestone.credentialUrl}
          rel="noreferrer"
          target="_blank"
        >
          <span>View credential</span>
          <ExternalLink aria-hidden="true" size={12} strokeWidth={1.8} />
        </a>
      ) : null}
    </li>
  );
}

export function DevelopmentSection({
  education,
  educationHeading,
  learning,
  learningHeading,
}: DevelopmentSectionProps) {
  if (education.length === 0 && learning.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-8 md:grid-cols-2">
          {education.length > 0 ? (
            <article
              className="border border-black/[0.08] bg-surface/40 p-7 transition-colors hover:bg-surface/70 sm:p-8"
              data-about-reveal
            >
              <div className="mb-8 flex items-center justify-between border-b border-black/[0.08] pb-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                  {educationHeading}
                </p>
                <span className="font-mono text-[0.625rem] text-ink-muted">
                  [{String(education.length).padStart(2, "0")}]
                </span>
              </div>
              <ul className="m-0 list-none p-0">
                {education.map((milestone) => (
                  <DevelopmentItem key={milestone.id} milestone={milestone} />
                ))}
              </ul>
            </article>
          ) : null}

          {learning.length > 0 ? (
            <article
              className="border border-black/[0.08] bg-surface/40 p-7 transition-colors hover:bg-surface/70 sm:p-8"
              data-about-reveal
            >
              <div className="mb-8 flex items-center justify-between border-b border-black/[0.08] pb-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                  {learningHeading}
                </p>
                <span className="font-mono text-[0.625rem] text-ink-muted">
                  [{String(learning.length).padStart(2, "0")}]
                </span>
              </div>
              <ul className="m-0 list-none p-0">
                {learning.map((milestone) => (
                  <DevelopmentItem key={milestone.id} milestone={milestone} />
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
