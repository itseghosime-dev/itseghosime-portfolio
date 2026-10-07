'use client'

import {useEffect, useMemo, useState} from 'react'

type LocationClock = {
  city: string
  country: string
  timeZone: string
}

const locations: LocationClock[] = [
  {city: 'Abuja', country: 'Nigeria', timeZone: 'Africa/Lagos'},
  {city: 'London', country: 'United Kingdom', timeZone: 'Europe/London'},
  {city: 'New York', country: 'United States', timeZone: 'America/New_York'},
  {city: 'Toronto', country: 'Canada', timeZone: 'America/Toronto'},
]

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  }).format(date)
}

function formatZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    timeZoneName: 'short',
  }).formatToParts(date)

  return parts.find((part) => part.type === 'timeZoneName')?.value ?? ''
}

export function WorldClocks() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    function update() {
      setNow(new Date())
    }

    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const clocks = useMemo(
    () =>
      locations.map((location) => ({
        ...location,
        time: now ? formatTime(now, location.timeZone) : '00:00:00',
        zone: now ? formatZone(now, location.timeZone) : '',
      })),
    [now],
  )

  return (
    <section aria-labelledby="world-time-title">
      <h2
        className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted"
        id="world-time-title"
      >
        Current time across key regions
      </h2>
      <div className="mt-6 grid grid-cols-1 border-t border-l border-black/[0.08] sm:grid-cols-2">
        {clocks.map((clock) => (
          <div
            className="border-r border-b border-black/[0.08] bg-surface px-5 py-5"
            key={clock.city}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{clock.city}</p>
                <p className="mt-1 text-[0.6875rem] text-ink-muted">{clock.country}</p>
              </div>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
                {clock.zone}
              </span>
            </div>
            <time
              className="mt-5 block font-mono text-xl font-semibold tracking-[-0.02em] tabular-nums"
              dateTime={clock.time}
            >
              {clock.time}
            </time>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-6 text-ink-muted">
        Calls are usually scheduled between 09:00 and 18:00 Abuja time. Asynchronous
        communication is welcome across time zones.
      </p>
    </section>
  )
}
