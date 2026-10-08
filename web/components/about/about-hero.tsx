import { ArrowUpRight, Download, Sparkles } from "lucide-react";

import type { AboutProfileModel } from "@/types/about";
import type { HomePageModel } from "@/types/home";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

type AboutHeroProps = {
  hero: AboutProfileModel["hero"];
  onOpenBrief?: () => void;
  resume?: HomePageModel["contact"]["resume"];
};

export function AboutHero({ hero, onOpenBrief, resume }: AboutHeroProps) {
  const resumeHref = resume?.url ?? hero.secondaryAction.href;
  const isResumeExternal = resumeHref.startsWith("http");
  const resumeLabel = resume?.label ?? "Download CV";

  return (
    <section className="border-b border-black/[0.08] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-8">
          <div
            className="flex flex-col gap-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between"
            data-about-reveal
          >
            <p className="flex items-center gap-2 text-accent">
              <span
                className="size-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              {hero.eyebrow}
            </p>
            <p className="text-ink-muted">
              <span className="text-accent">●</span> {hero.availability} ·{" "}
              {hero.location ?? "Abuja, Nigeria"}
            </p>
          </div>

          <header className="grid max-w-4xl gap-5" data-about-reveal>
            <h1 className="font-serif text-[clamp(2.75rem,5.8vw,4.25rem)] leading-[1.01] tracking-[-0.035em]">
              {hero.heading}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
              {hero.introduction}
            </p>
          </header>

          <div className="grid gap-6 pt-2" data-about-reveal>
            {hero.identityFacts.length > 0 ? (
              <dl className="m-0 flex flex-wrap gap-2.5 text-xs">
                {hero.identityFacts.map((fact) => (
                  <div
                    className="border border-black/[0.08] bg-surface/60 px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.02em] transition-colors hover:bg-surface"
                    key={fact.id}
                  >
                    <dt className="inline text-ink-muted">{fact.label}: </dt>
                    <dd className="inline font-medium text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ButtonLink href={hero.primaryAction.href}>
                {hero.primaryAction.label}
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
              </ButtonLink>

              {resumeHref ? (
                <a
                  className="inline-flex min-h-12 items-center gap-2 border border-black/15 bg-transparent px-5 py-3 text-sm font-semibold text-ink no-underline transition-colors hover:border-black hover:bg-black hover:text-white"
                  download={Boolean(resume?.url)}
                  href={resumeHref}
                  rel={isResumeExternal ? "noreferrer" : undefined}
                  target={isResumeExternal ? "_blank" : undefined}
                >
                  <Download aria-hidden="true" size={15} strokeWidth={1.8} />
                  <span>{resumeLabel}</span>
                </a>
              ) : null}

              {onOpenBrief ? (
                <button
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 border border-dashed border-black/20 bg-surface/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.06em] text-ink-muted transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
                  type="button"
                  onClick={onOpenBrief}
                >
                  <Sparkles
                    aria-hidden="true"
                    className="text-accent"
                    size={14}
                    strokeWidth={1.8}
                  />
                  <span>Recruiter Brief</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
