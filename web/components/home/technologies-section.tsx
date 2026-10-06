import type { TechnologySummary } from "@/types/home";

import { Container } from "@/components/ui/container";

type TechnologiesSectionProps = {
  technologies: TechnologySummary[];
};

export function TechnologiesSection({
  technologies,
}: TechnologiesSectionProps) {
  if (technologies.length === 0) {
    return null;
  }

  return (
    <section
      className="border-t border-black/8 py-16 md:py-20"
      aria-labelledby="technologies-title"
      data-reveal
    >
      <Container>
        <div className="grid gap-6">
          <h2 className="label-sm text-ink-muted" id="technologies-title">
            Core technical foundry
          </h2>
          <p className="font-serif text-2xl leading-relaxed tracking-tight text-ink md:text-4xl">
            {technologies.map((technology) => technology.name).join(" · ")}
          </p>
        </div>
      </Container>
    </section>
  );
}
