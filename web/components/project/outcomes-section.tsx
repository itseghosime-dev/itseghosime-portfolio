import type { ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";

export function OutcomesSection({
  section,
}: {
  section: ProjectSectionOf<"outcomesSection">;
}) {
  if (!section.heading || !section.items?.length) return null;

  return (
    <section className="border-b border-black/[0.08] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-12 lg:gap-16">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            introduction={section.summary}
          />
          <div className="grid border-l border-t border-black/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item) => (
              <article
                className="min-h-48 border-b border-r border-black/[0.08] bg-surface/35 p-6 flex flex-col gap-2.5"
                data-project-reveal
                key={item._key}
              >
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                  {item.kind === "metric"
                    ? "Verified metric"
                    : item.kind === "learning"
                      ? "Learning"
                      : "Outcome"}
                </p>
                {item.value ? (
                  <p className="mt-5 font-mono text-3xl tracking-[-0.04em]">
                    {item.value}
                  </p>
                ) : null}
                <h3
                  className={`${item.value ? "mt-3" : "mt-5"} text-sm font-semibold leading-6`}
                >
                  {item.title}
                </h3>
                <p className="mt-3 text-xs leading-6 text-ink-soft">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
          {section.closingNote ? (
            <blockquote
              className="m-0 max-w-4xl border-l-2 border-accent py-1 pl-6 font-serif text-xl leading-8 text-ink-soft sm:text-2xl sm:leading-9"
              data-project-reveal
            >
              {section.closingNote}
            </blockquote>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
