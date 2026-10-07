import Link from 'next/link'
import {ArrowRight, ArrowUpRight} from 'lucide-react'

import type {ArchiveEntry} from '@/types/work'

import {ArchiveVisual} from './archive-visual'

type ArchiveCardProps = {
  entry: ArchiveEntry
  index: number
  variant: 'compact' | 'feature' | 'split' | 'wide'
}

function EntryEyebrow({entry, index}: Pick<ArchiveCardProps, 'entry' | 'index'>) {
  return (
    <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-accent">
      {String(index + 1).padStart(2, '0')} <span aria-hidden="true">{'//'}</span>{' '}
      {entry.type}
      <span className="text-ink-muted"> · {entry.year ?? entry.status}</span>
    </p>
  )
}

function EntryDetails({entry}: {entry: ArchiveEntry}) {
  if (!entry.role && entry.technologies.length === 0) {
    return null
  }

  return (
    <div className="grid gap-1 font-mono text-[0.6875rem] leading-5 tracking-[0.03em] text-ink-muted">
      {entry.role ? <p>Role: {entry.role}</p> : null}
      {entry.technologies.length > 0 ? <p>Stack: {entry.technologies.join(' · ')}</p> : null}
    </div>
  )
}

function EntryLinks({entry}: {entry: ArchiveEntry}) {
  const liveLabel = entry.kind === 'lab' ? 'Explore demo' : 'Live site'

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2 text-xs font-semibold">
      {entry.kind === 'project' && entry.href ? (
        <Link
          className="group/case-study inline-flex min-h-11 items-center gap-3 border border-ink bg-ink px-4 py-2 text-background no-underline transition-colors hover:border-accent hover:bg-accent"
          href={entry.href}
        >
          View full case study
          <ArrowRight
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/case-study:translate-x-1 motion-reduce:transition-none"
            size={15}
            strokeWidth={1.8}
          />
        </Link>
      ) : null}
      {entry.liveUrl ? (
        <a
          className="inline-flex min-h-11 items-center gap-1.5 px-2 no-underline transition-colors hover:text-accent"
          href={entry.liveUrl}
          rel="noreferrer"
          target="_blank"
        >
          {liveLabel} <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </a>
      ) : (
        <span className="text-ink-muted">{entry.status}</span>
      )}
      {entry.repositoryUrl ? (
        <a
          className="inline-flex min-h-11 items-center gap-1.5 px-2 no-underline transition-colors hover:text-accent"
          href={entry.repositoryUrl}
          rel="noreferrer"
          target="_blank"
        >
          Source <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </a>
      ) : null}
    </div>
  )
}

function FeatureCard({entry, index}: Pick<ArchiveCardProps, 'entry' | 'index'>) {
  return (
    <article className="group border-b border-black/10 pb-16 md:pb-20" data-archive-entry>
      <div className="grid gap-5 pb-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)] lg:items-end">
        <div className="grid gap-3">
          <EntryEyebrow entry={entry} index={index} />
          <h2 className="font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] tracking-[-0.025em]">
            {String(index + 1).padStart(2, '0')} / {entry.title}
          </h2>
          <p className="max-w-3xl text-base leading-7 text-ink-soft">{entry.subtitle}</p>
        </div>
        <div className="grid gap-3 lg:justify-items-end lg:text-right">
          <EntryDetails entry={entry} />
          <EntryLinks entry={entry} />
        </div>
      </div>

      <div
        className="overflow-hidden border border-black/10 bg-surface-container shadow-[0_18px_50px_rgba(22,23,25,0.06)]"
        data-archive-media
      >
        <div className="aspect-[16/9] overflow-hidden">
          <ArchiveVisual entry={entry} priority />
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-black/10 px-5 py-4 font-mono text-[0.625rem] uppercase tracking-[0.07em] text-ink-muted sm:flex-row sm:items-center">
          <span>{entry.timeline ?? entry.status}</span>
          <span>{entry.kind === 'project' ? 'Portfolio project' : 'Lab experiment'}</span>
        </div>
      </div>
    </article>
  )
}

function SplitCard({entry, index}: Pick<ArchiveCardProps, 'entry' | 'index'>) {
  return (
    <article
      className="group grid border-b border-black/10 pb-16 md:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.45fr)] md:pb-20"
      data-archive-entry
    >
      <div className="flex flex-col justify-between gap-10 border-black/10 py-7 md:border-r md:pr-9">
        <div className="grid gap-4">
          <EntryEyebrow entry={entry} index={index} />
          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[-0.022em]">
            {String(index + 1).padStart(2, '0')} / {entry.title}
          </h2>
          <p className="max-w-xl leading-7 text-ink-soft">{entry.subtitle}</p>
          <EntryDetails entry={entry} />
        </div>
        <EntryLinks entry={entry} />
      </div>
      <div className="overflow-hidden bg-surface-container md:ml-0" data-archive-media>
        <div className="aspect-[16/10] h-full min-h-72 overflow-hidden md:aspect-auto">
          <ArchiveVisual entry={entry} />
        </div>
      </div>
    </article>
  )
}

function WideCard({entry, index}: Pick<ArchiveCardProps, 'entry' | 'index'>) {
  return (
    <article className="group border-b border-black/10 pb-16 md:pb-20" data-archive-entry>
      <div className="grid gap-6 pb-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
        <div className="grid gap-3">
          <EntryEyebrow entry={entry} index={index} />
          <h2 className="font-serif text-[clamp(2.1rem,5.2vw,4.5rem)] leading-[0.95] tracking-[-0.028em]">
            {String(index + 1).padStart(2, '0')} / {entry.title}
          </h2>
          <p className="max-w-3xl leading-7 text-ink-soft">{entry.subtitle}</p>
        </div>
        <div className="grid gap-3 lg:justify-items-end lg:text-right">
          <EntryDetails entry={entry} />
          <EntryLinks entry={entry} />
        </div>
      </div>

      <div
        className="relative min-h-80 overflow-hidden border border-black/10 bg-surface-container p-4 sm:p-8 md:min-h-120 md:p-12"
        data-archive-media
      >
        <div className="h-full min-h-72 overflow-hidden border border-black/10 shadow-xl md:w-[78%]">
          <ArchiveVisual entry={entry} />
        </div>
        {entry.supportingImage ? (
          <div className="absolute right-6 bottom-6 h-[62%] w-[34%] overflow-hidden border border-white/80 bg-surface shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 motion-reduce:transition-none md:right-12 md:bottom-10">
            <ArchiveVisual entry={entry} supporting />
          </div>
        ) : null}
      </div>
    </article>
  )
}

function CompactCard({entry, index}: Pick<ArchiveCardProps, 'entry' | 'index'>) {
  return (
    <article className="group flex min-w-0 flex-col border-b border-black/10 pb-5" data-archive-entry>
      <div className="grid min-h-44 content-start gap-3 pb-5">
        <EntryEyebrow entry={entry} index={index} />
        <h2 className="font-serif text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.04] tracking-[-0.018em]">
          {String(index + 1).padStart(2, '0')} / {entry.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-6 text-ink-soft">{entry.subtitle}</p>
      </div>
      <div
        className="aspect-[4/3] overflow-hidden border border-black/10 bg-surface-container"
        data-archive-media
      >
        <ArchiveVisual entry={entry} />
      </div>
      <div className="grid flex-1 gap-5 pt-5">
        <EntryDetails entry={entry} />
        <div className="mt-auto border-t border-black/8 pt-2">
          <EntryLinks entry={entry} />
        </div>
      </div>
    </article>
  )
}

export function ArchiveEntryCard({entry, index, variant}: ArchiveCardProps) {
  if (variant === 'feature') {
    return <FeatureCard entry={entry} index={index} />
  }

  if (variant === 'split') {
    return <SplitCard entry={entry} index={index} />
  }

  if (variant === 'wide') {
    return <WideCard entry={entry} index={index} />
  }

  return <CompactCard entry={entry} index={index} />
}
