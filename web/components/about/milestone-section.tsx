import {ExternalLink} from "lucide-react";

import type {AboutMilestone} from "@/types/about";

import {Container} from "@/components/ui/container";

type MilestoneSectionProps = {
  eyebrow: string;
  milestones: AboutMilestone[];
  title: string;
};

export function MilestoneSection({eyebrow, milestones, title}: MilestoneSectionProps) {
  if (milestones.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-[65rem]">
          <div className="mb-10 flex items-end justify-between gap-6" data-about-reveal>
            <div>
              <p className="mb-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-text">
                {eyebrow}
              </p>
              <h2 className="headline-md font-serif text-[clamp(2.2rem,4.2vw,3rem)] tracking-[-0.03em]">
                {title}
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-ink-muted sm:inline">
              [{String(milestones.length).padStart(2, "0")} ROLES]
            </span>
          </div>

          <div className="border-t border-black/[0.08]">
            {milestones.map((milestone) => (
              <article
                className="group grid gap-4 border-b border-black/[0.08] py-8 transition-colors duration-200 hover:bg-surface/30 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-12 md:py-9"
                data-about-reveal
                key={milestone.id}
              >
                <div className="grid content-start gap-2 font-mono text-xs text-ink-muted">
                  <p className="font-semibold text-ink">{milestone.dateLabel}</p>
                  {milestone.status ? (
                    <span className="inline-flex w-fit items-center gap-1.5 border border-accent/25 bg-accent/5 px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.08em] text-accent-text">
                      <span className="size-1 rounded-full bg-accent" />
                      {milestone.status}
                    </span>
                  ) : null}
                </div>

                <div className="grid content-start gap-4">
                  <div className="grid gap-1">
                    <h3 className="font-serif text-xl tracking-[-0.015em] text-ink sm:text-2xl">
                      {milestone.title}
                    </h3>
                    <p className="font-mono text-xs text-ink-muted">
                      <span className="font-medium text-ink">{milestone.organisation}</span>
                      {milestone.location ? ` · ${milestone.location}` : ""}
                    </p>
                  </div>

                  <p className="text-sm leading-7 text-ink-soft sm:text-[0.9375rem] sm:leading-8">
                    {milestone.summary}
                  </p>

                  {milestone.highlights.length > 0 ? (
                    <ul className="m-0 grid list-none gap-2 p-0 pt-1 text-xs leading-6 text-ink-soft">
                      {milestone.highlights.map((highlight) => (
                        <li className="flex items-start gap-2.5" key={highlight}>
                          <span className="mt-2 size-1 shrink-0 bg-accent" aria-hidden="true" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {milestone.credentialTitle ? (
                    <p className="font-mono text-xs text-ink-muted">
                      Credential: {milestone.credentialTitle}
                    </p>
                  ) : null}

                  {milestone.credentialUrl ? (
                    <a
                      className="inline-flex w-fit items-center gap-2 font-mono text-xs font-semibold text-accent-text no-underline transition-colors hover:text-ink"
                      href={milestone.credentialUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>View verified credential</span>
                      <ExternalLink aria-hidden="true" size={13} strokeWidth={1.8} />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
