import type { ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";

export function ContributionSection({
  section,
}: {
  section: ProjectSectionOf<"contributionGridSection">;
}) {
  if (!section.heading || !section.items?.length) return null;
  const isList = section.presentation === "list";

  return (
    <section className="border-b border-black/[0.08] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-12 lg:gap-16">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            introduction={section.introduction}
          />
          <div
            className={
              isList
                ? "border-t border-black/[0.08]"
                : "grid border-l border-t border-black/[0.08] md:grid-cols-2 lg:grid-cols-3"
            }
          >
            {section.items.map((item, index) => (
              <article
                className={
                  isList
                    ? "grid gap-4 border-b border-black/[0.08] py-6 md:grid-cols-[3rem_minmax(12rem,0.75fr)_minmax(0,1.25fr)] md:gap-8"
                    : "min-h-52 border-b border-r border-black/[0.08] bg-surface/35 p-6 transition-colors hover:bg-surface"
                }
                data-project-card
                data-project-reveal
                key={item._key}
              >
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="grid content-start gap-2">
                  {item.label ? (
                    <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                      {item.label}
                    </p>
                  ) : null}
                  <h3 className="text-base font-semibold leading-6">
                    {item.title}
                  </h3>
                </div>
                <p
                  className={`text-sm leading-7 text-ink-soft ${isList ? "" : "mt-4"}`}
                >
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
