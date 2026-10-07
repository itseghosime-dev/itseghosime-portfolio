import type {AboutProfileModel} from '@/types/about'

import {Container} from "@/components/ui/container";

type FocusSectionProps = {
  focus: AboutProfileModel['focus']
};

export function FocusSection({focus}: FocusSectionProps) {
  if (focus.items.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-[65rem]">
          <div className="mb-10 flex items-end justify-between gap-6" data-about-reveal>
            <div>
              <p className="mb-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
                {focus.label}
              </p>
              <h2 className="headline-md font-serif text-[clamp(2.2rem,4.2vw,3rem)] tracking-[-0.03em]">
                {focus.heading}
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-ink-muted sm:inline">
              [{String(focus.items.length).padStart(2, '0')} CAPABILITIES]
            </span>
          </div>

          <ol className="m-0 list-none border-t border-black/[0.08] p-0">
            {focus.items.map((capability, index) => (
              <li
                className="group -mx-4 grid gap-3 border-b border-black/[0.08] px-4 py-6 transition-colors duration-200 hover:bg-surface/50 sm:mx-0 sm:grid-cols-[minmax(14rem,0.72fr)_minmax(0,1.28fr)] sm:gap-10 sm:px-4 sm:py-7"
                data-about-reveal
                key={capability.id}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-accent transition-transform group-hover:translate-x-0.5">
                    {String(index + 1).padStart(2, "0")} /
                  </span>
                  <h3 className="font-mono text-sm font-semibold tracking-[-0.01em] text-ink">
                    {capability.title}
                  </h3>
                </div>
                <p className="text-sm leading-7 text-ink-soft sm:text-[0.9375rem] sm:leading-8">
                  {capability.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
