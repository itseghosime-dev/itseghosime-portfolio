'use client'

import gsap from 'gsap'
import Link from 'next/link'
import {useEffect, useMemo, useRef, useState} from 'react'

import type {ArchiveEntry, ArchiveFilter, ArchiveView} from '@/types/work'

import {Container} from '@/components/ui/container'

import {ArchiveEntryCard} from './archive-entry-card'

type WorkArchiveProps = {
  entries: ArchiveEntry[]
  initialFilter?: ArchiveFilter
}

const filters: Array<{label: string; value: ArchiveFilter}> = [
  {label: 'All', value: 'all'},
  {label: 'Client work', value: 'client'},
  {label: 'Web', value: 'web'},
  {label: 'Experimental', value: 'experimental'},
]

function formatCount(count: number): string {
  return String(count).padStart(2, '0')
}

function VisualCollection({entries}: {entries: ArchiveEntry[]}) {
  const first = entries.at(0)
  const second = entries.at(1)
  const third = entries.at(2)
  const paired = entries.slice(3, 5)
  const compact = entries.slice(5, 8)

  return (
    <div className="grid gap-24 md:gap-32">
      {first ? <ArchiveEntryCard entry={first} index={0} variant="feature" /> : null}
      {second ? <ArchiveEntryCard entry={second} index={1} variant="split" /> : null}
      {third ? <ArchiveEntryCard entry={third} index={2} variant="wide" /> : null}
      {paired.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {paired.map((entry, index) => (
            <ArchiveEntryCard
              entry={entry}
              index={index + 3}
              key={entry.id}
              variant="compact"
            />
          ))}
        </div>
      ) : null}
      {compact.length > 0 ? (
        <div className="grid gap-8 border-t border-black/10 pt-8 md:grid-cols-3">
          {compact.map((entry, index) => (
            <ArchiveEntryCard
              entry={entry}
              index={index + 5}
              key={entry.id}
              variant="compact"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function IndexCollection({entries}: {entries: ArchiveEntry[]}) {
  return (
    <ol className="m-0 list-none border-t border-black/10 p-0">
      {entries.map((entry, index) => (
        <li
          className="group grid gap-3 border-b border-black/10 py-6 sm:grid-cols-[3rem_minmax(0,1.25fr)_minmax(10rem,0.7fr)_auto] sm:items-center"
          data-archive-entry
          key={entry.id}
        >
          <span className="font-mono text-xs text-accent">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h2 className="font-serif text-2xl transition-colors group-hover:text-accent">
              {entry.title}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{entry.type}</p>
          </div>
          <p className="text-sm leading-6 text-ink-soft">{entry.subtitle}</p>
          {entry.kind === 'project' && entry.href ? (
            <Link
              className="inline-flex min-h-10 items-center gap-2 border border-black/15 px-3 py-2 text-xs font-semibold no-underline transition-colors hover:border-ink hover:bg-ink hover:text-background"
              href={entry.href}
            >
              Full case study <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-ink-muted">
              {entry.year ?? entry.status}
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

export function WorkArchive({entries, initialFilter = 'all'}: WorkArchiveProps) {
  const [filter, setFilter] = useState<ArchiveFilter>(initialFilter)
  const [query, setQuery] = useState('')
  const [viewOverride, setViewOverride] = useState<ArchiveView | null>(null)
  const view: ArchiveView = viewOverride ?? 'visual'
  const archiveRef = useRef<HTMLDivElement>(null)

  const counts = useMemo(
    () => ({
      all: entries.length,
      client: entries.filter((entry) => entry.categories.includes('client')).length,
      experimental: entries.filter((entry) => entry.categories.includes('experimental')).length,
      web: entries.filter((entry) => entry.categories.includes('web')).length,
    }),
    [entries],
  )

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesFilter = filter === 'all' || entry.categories.includes(filter)
      const searchable = [
        entry.title,
        entry.subtitle,
        entry.type,
        entry.role,
        ...entry.technologies,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [entries, filter, query])

  useEffect(() => {
    const root = archiveRef.current
    if (!root) {
      return
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-entry]'))
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (shouldReduceMotion) {
      gsap.set(items, {clearProps: 'all'})
      return
    }

    gsap.set(items, {opacity: 0, y: 44})
    items.forEach((item) => {
      const media = item.querySelector<HTMLElement>('[data-archive-media]')
      if (media) {
        gsap.set(media, {clipPath: 'inset(0 0 18% 0)', scale: 0.985})
      }
    })
    const observer = new IntersectionObserver(
      (observations) => {
        observations.forEach((observation) => {
          if (!observation.isIntersecting) {
            return
          }

          const item = observation.target as HTMLElement
          const media = item.querySelector<HTMLElement>('[data-archive-media]')
          const copy = item.querySelectorAll<HTMLElement>('h2, p, a')
          const timeline = gsap.timeline()

          timeline
            .to(item, {
              duration: 0.85,
              ease: 'power3.out',
              opacity: 1,
              overwrite: true,
              y: 0,
            })
            .fromTo(
              copy,
              {opacity: 0, y: 12},
              {duration: 0.55, ease: 'power2.out', opacity: 1, stagger: 0.035, y: 0},
              '-=0.52',
            )

          if (media) {
            timeline.to(
              media,
              {
                clipPath: 'inset(0 0 0% 0)',
                duration: 1.05,
                ease: 'power4.out',
                scale: 1,
              },
              '-=0.72',
            )
          }
          observer.unobserve(observation.target)
        })
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.08},
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [filter, query, view, visibleEntries.length])

  useEffect(() => {
    const root = archiveRef.current
    if (!root) {
      return
    }

    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (shouldReduceMotion || !canHover) {
      return
    }

    const mediaElements = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-media]'))
    const cleanups = mediaElements.map((media) => {
      const visual = media.querySelector<HTMLElement>('[data-archive-visual]')
      if (!visual) {
        return () => undefined
      }

      gsap.set(visual, {transformPerspective: 900, transformOrigin: 'center'})

      function handlePointerMove(event: PointerEvent) {
        const bounds = media.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5

        gsap.to(visual, {
          duration: 0.55,
          ease: 'power3.out',
          rotateX: y * -2.8,
          rotateY: x * 3.5,
          scale: 1.012,
          x: x * 7,
          y: y * 7,
        })
      }

      function handlePointerLeave() {
        gsap.to(visual, {
          duration: 0.8,
          ease: 'elastic.out(1, 0.55)',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          x: 0,
          y: 0,
        })
      }

      media.addEventListener('pointermove', handlePointerMove)
      media.addEventListener('pointerleave', handlePointerLeave)

      return () => {
        media.removeEventListener('pointermove', handlePointerMove)
        media.removeEventListener('pointerleave', handlePointerLeave)
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [filter, query, view, visibleEntries.length])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-archive-hero]',
        {opacity: 0, y: 20},
        {duration: 0.68, ease: 'power3.out', opacity: 1, stagger: 0.08, y: 0},
      )

      gsap.to('[data-archive-orbit]', {
        duration: 32,
        ease: 'none',
        repeat: -1,
        rotation: 360,
      })

      gsap.to('[data-archive-glow]', {
        duration: 4.8,
        ease: 'sine.inOut',
        repeat: -1,
        scale: 1.16,
        yoyo: true,
      })
    }, archiveRef)

    const hero = archiveRef.current?.querySelector<HTMLElement>('[data-archive-hero-area]')
    const glow = archiveRef.current?.querySelector<HTMLElement>('[data-archive-glow]')
    const orbit = archiveRef.current?.querySelector<HTMLElement>('[data-archive-orbit-wrap]')
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    function handlePointerMove(event: PointerEvent) {
      if (!hero || !glow || !orbit) {
        return
      }

      const bounds = hero.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      const normalizedX = x / bounds.width - 0.5
      const normalizedY = y / bounds.height - 0.5

      gsap.to(glow, {
        duration: 0.75,
        ease: 'power3.out',
        opacity: 0.72,
        x: x - 240,
        y: y - 240,
      })
      gsap.to(orbit, {
        duration: 1.1,
        ease: 'power3.out',
        x: normalizedX * 28,
        y: normalizedY * 22,
      })
    }

    function handlePointerLeave() {
      if (!glow || !orbit) {
        return
      }

      gsap.to(glow, {duration: 1.2, ease: 'power3.out', opacity: 0.34})
      gsap.to(orbit, {duration: 1.2, ease: 'power3.out', x: 0, y: 0})
    }

    if (hero && glow && canHover) {
      const bounds = hero.getBoundingClientRect()
      gsap.set(glow, {x: bounds.width * 0.58 - 240, y: bounds.height * 0.2 - 240})
      hero.addEventListener('pointermove', handlePointerMove)
      hero.addEventListener('pointerleave', handlePointerLeave)
    }

    return () => {
      context.revert()
      hero?.removeEventListener('pointermove', handlePointerMove)
      hero?.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  function selectFilter(nextFilter: ArchiveFilter) {
    setFilter(nextFilter)
    const url = new URL(window.location.href)
    if (nextFilter === 'all') {
      url.searchParams.delete('filter')
    } else {
      url.searchParams.set('filter', nextFilter)
    }
    window.history.replaceState({}, '', url)
  }

  return (
    <div ref={archiveRef}>
      <section
        className="relative overflow-hidden border-b border-black/10"
        aria-labelledby="archive-title"
        data-archive-hero-area
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(65,105,225,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(65,105,225,0.08)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
          <div
            className="absolute top-0 left-0 size-120 rounded-full opacity-35 blur-3xl [background:radial-gradient(circle,rgba(65,105,225,0.34)_0%,rgba(65,105,225,0.12)_38%,transparent_72%)] will-change-transform"
            data-archive-glow
          />
          <div
            className="absolute -top-12 right-[-7rem] size-80 opacity-55 will-change-transform sm:right-[2%] md:size-112"
            data-archive-orbit-wrap
          >
            <div className="relative size-full rounded-full border border-accent/20" data-archive-orbit>
              <div className="absolute inset-[18%] rounded-full border border-accent/20" />
              <div className="absolute top-1/2 left-1/2 h-px w-full -translate-x-1/2 bg-accent/15" />
              <div className="absolute top-[-0.24rem] left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent" />
              <div className="absolute right-[11%] bottom-[17%] size-1.5 rounded-full bg-ink" />
            </div>
          </div>
        </div>

        <Container className="relative z-10 grid min-h-[30rem] content-between gap-16 pt-16 pb-8 md:min-h-[36rem] md:pt-24 md:pb-10">
          <div className="grid max-w-5xl gap-7" data-archive-hero>
            <div className="grid gap-3">
              <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-accent">
                Work <span aria-hidden="true">{'//'}</span> Archive — {formatCount(entries.length)} entries
              </p>
              <h1
                className="max-w-4xl font-serif text-[clamp(2.625rem,4.25vw,3.5rem)] leading-[1.02] tracking-[-0.024em]"
                id="archive-title"
              >
                Selected products, experiments and digital experiences.
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-ink-soft md:text-lg md:leading-8">
              A curated index of shipped websites, product work and ongoing lab experiments—each
              grounded in the interface decisions, technology and craft behind the result.
            </p>
          </div>

          <div
            className="flex flex-col justify-between gap-5 border-t border-black/8 pt-4 lg:flex-row lg:items-end"
            data-archive-hero
          >
            <div className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Filter archive">
              {filters.map((item) => (
                <button
                  className={`relative min-h-9 cursor-pointer bg-transparent text-xs transition-colors after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:bg-ink after:transition-transform ${
                    filter === item.value
                      ? 'text-ink after:scale-x-100'
                      : 'text-ink-muted after:scale-x-0 hover:text-ink'
                  }`}
                  aria-pressed={filter === item.value}
                  key={item.value}
                  onClick={() => selectFilter(item.value)}
                  type="button"
                >
                  {item.label} ({formatCount(counts[item.value])})
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block">
                <span className="sr-only">Search archive</span>
                <span
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                >
                  ⌕
                </span>
                <input
                  className="h-10 w-full min-w-48 border border-black/10 bg-surface py-2 pr-3 pl-8 text-xs outline-none transition-colors placeholder:text-ink-muted focus:border-accent sm:w-56"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search work..."
                  type="search"
                  value={query}
                />
              </label>

              <div
                className="hidden border border-black/10 md:flex"
                aria-label="Archive view"
                role="group"
              >
                {(['visual', 'index'] as const).map((item) => (
                  <button
                    className={`min-h-10 cursor-pointer px-3 text-xs capitalize transition-colors ${
                      (viewOverride ?? 'visual') === item
                        ? 'bg-ink text-background'
                        : 'bg-surface text-ink-muted hover:text-ink'
                    }`}
                    aria-pressed={(viewOverride ?? 'visual') === item}
                    key={item}
                    onClick={() => setViewOverride(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div
                className="flex border border-black/10 md:hidden"
                aria-label="Archive view"
                role="group"
              >
                {(['visual', 'index'] as const).map((item) => (
                  <button
                    className={`min-h-10 cursor-pointer px-3 text-xs capitalize transition-colors ${
                      (viewOverride ?? 'index') === item
                        ? 'bg-ink text-background'
                        : 'bg-surface text-ink-muted hover:text-ink'
                    }`}
                    aria-pressed={(viewOverride ?? 'index') === item}
                    key={item}
                    onClick={() => setViewOverride(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28" aria-live="polite" aria-label="Archive entries">
        <Container>
          {visibleEntries.length > 0 ? (
            viewOverride ? (
              viewOverride === 'visual' ? (
                <VisualCollection entries={visibleEntries} />
              ) : (
                <IndexCollection entries={visibleEntries} />
              )
            ) : (
              <>
                <div className="hidden md:block">
                  <VisualCollection entries={visibleEntries} />
                </div>
                <div className="md:hidden">
                  <IndexCollection entries={visibleEntries} />
                </div>
              </>
            )
          ) : (
            <div className="grid min-h-64 place-content-center border-y border-black/10 text-center">
              <p className="font-serif text-3xl">No matching work.</p>
              <p className="mt-2 text-sm text-ink-muted">Try another search or filter.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
