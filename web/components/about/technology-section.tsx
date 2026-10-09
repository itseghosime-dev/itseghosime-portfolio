import type {AboutTechnologyGroup} from "@/types/about";

import {Container} from "@/components/ui/container";

type TechnologySectionProps = {
  groups: AboutTechnologyGroup[]
  heading: string
  label: string
};

export function TechnologySection({groups, heading, label}: TechnologySectionProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-[65rem]">
          <div className="mb-10 flex items-end justify-between gap-6" data-about-reveal>
            <div>
              <p className="mb-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-text">
                {label}
              </p>
              <h2 className="headline-md font-serif text-[clamp(2.2rem,4.2vw,3rem)] tracking-[-0.03em]">
                {heading}
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-ink-muted sm:inline">
              [{groups.length} DOMAINS]
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => {
              const isWide = index === 4 || (groups.length === 5 && index === 4);

              return (
                <article
                  className={`border border-black/[0.08] bg-surface/50 p-6 transition-all duration-200 hover:border-black/20 hover:bg-surface sm:p-7 ${
                    isWide ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                  data-about-reveal
                  key={group.id}
                >
                  <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-accent-text">
                      {group.label}
                    </h3>
                    <span className="font-mono text-[0.625rem] text-ink-muted">
                      {String(group.technologies.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                    {group.technologies.map((technology) => (
                      <li
                        className="border border-black/[0.06] bg-background px-2.5 py-1 font-mono text-[0.6875rem] text-ink transition-colors hover:border-accent hover:text-accent"
                        key={technology}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
