import type { ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { ProjectImage } from "./project-image";
import { SectionHeading } from "./section-heading";

export function ProcessSection({
  section,
}: {
  section: ProjectSectionOf<"processSection">;
}) {
  if (!section.heading || !section.steps?.length) return null;
  const editorial = section.presentation === "editorial";

  return (
    <section className="border-b border-black/[0.08] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-12 lg:gap-16">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            introduction={section.introduction}
          />
          <ol
            className={
              editorial
                ? "m-0 list-none border-t border-black/[0.08] p-0"
                : "m-0 grid list-none border-l border-t border-black/[0.08] p-0 md:grid-cols-2 lg:grid-cols-3"
            }
          >
            {section.steps.map((step, index) => (
              <li
                className={
                  editorial
                    ? "grid gap-5 border-b border-black/[0.08] py-7 md:grid-cols-[8rem_minmax(12rem,0.75fr)_minmax(0,1.25fr)] md:gap-8"
                    : "grid content-start gap-4 border-b border-r border-black/[0.08] p-6"
                }
                data-project-reveal
                key={step._key}
              >
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                  {step.phase ?? `Phase ${String(index + 1).padStart(2, "0")}`}
                </p>
                <h3 className="text-base font-semibold leading-6">
                  {step.title}
                </h3>
                <div className="grid content-start gap-4">
                  <p className="text-sm leading-7 text-ink-soft">
                    {step.description}
                  </p>
                  {step.deliverables?.length ? (
                    <p className="font-mono text-xs uppercase leading-5 tracking-[0.06em] text-ink-muted">
                      {step.deliverables.join(" · ")}
                    </p>
                  ) : null}
                  {step.image?.url ? (
                    <ProjectImage
                      className="h-auto w-full border border-black/[0.08]"
                      image={step.image}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
