import Link from 'next/link'
import {ArrowRight} from 'lucide-react'

import type {LabExperimentSummary} from '@/types/home'

import {Container} from '@/components/ui/container'

type LabSectionProps = {
  experiments: LabExperimentSummary[];
};

export function LabSection({experiments}: LabSectionProps) {
  if (experiments.length === 0) {
    return null
  }

  return (
    <section
      className="border-t border-black/[0.08] py-16 md:py-24"
      id="lab"
      aria-labelledby="lab-title"
      data-reveal
    >
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="grid gap-2">
            <p className="label-sm text-accent">Experiments &amp; R&amp;D</p>
            <h2 className="headline-lg" id="lab-title">
              Things I build when I&apos;m curious.
            </h2>
          </div>
          <Link className="group inline-flex min-h-11 items-center gap-2 font-semibold no-underline" href="/lab">
            <span>Explore the lab</span>
            <ArrowRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
              size={16}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {experiments.map((experiment, index) => (
            <article
              className="group flex min-h-72 flex-col justify-between rounded-lg border border-black/[0.08] bg-surface-container p-6 transition-colors hover:border-ink-muted"
              key={experiment.slug}
            >
              <div className="flex items-start justify-between gap-4 text-xs">
                <span className="font-mono text-ink-muted">
                  EXP / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-semibold text-accent">{experiment.status}</span>
              </div>
              <div>
                <h3 className="font-serif text-xl transition-colors group-hover:text-accent">
                  {experiment.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{experiment.summary}</p>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface-layer" aria-hidden="true">
                <div className="h-full w-1/3 bg-accent transition-[width] duration-500 group-hover:w-full" />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
