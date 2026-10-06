import type {CapabilitySummary} from '@/types/home'

import {Container} from '@/components/ui/container'

type CapabilitiesSectionProps = {
  capabilities: CapabilitySummary[];
};

export function CapabilitiesSection({capabilities}: CapabilitiesSectionProps) {
  if (capabilities.length === 0) {
    return null
  }

  return (
    <section
      className="border-t border-black/[0.08] py-16 md:py-24"
      id="capabilities"
      data-reveal
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="grid max-w-sm content-start gap-4 lg:col-span-4">
          <h2 className="headline-lg">What I do</h2>
          <p className="text-base leading-relaxed text-ink-muted">
            Building clear, maintainable interfaces with close attention to design, content and
            browser behavior.
          </p>
        </div>

        <ol className="m-0 list-none border-t border-black/[0.08] p-0 lg:col-span-8">
          {capabilities.map((capability) => (
            <li
              className="group grid gap-4 border-b border-black/[0.08] py-8 md:grid-cols-[minmax(12rem,1fr)_minmax(0,1.4fr)] md:items-center"
              key={capability.title}
            >
              <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-accent md:text-3xl">
                {capability.title}
              </h3>
              <p className="text-base leading-[1.6] text-ink-muted md:text-right">
                {capability.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
