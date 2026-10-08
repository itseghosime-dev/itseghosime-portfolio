import type { ProjectPageData, ProjectSection } from "@/types/project";

import { CodeShowcaseSection } from "./code-showcase-section";
import { ContributionSection } from "./contribution-section";
import { MediaSection } from "./media-section";
import { NarrativeSection } from "./narrative-section";
import { OutcomesSection } from "./outcomes-section";
import { ProcessSection } from "./process-section";
import { ProjectHero } from "./project-hero";
import { sectionId } from "./project-subnav";
import { SandboxSection } from "./sandbox-section";

function renderSection(section: ProjectSection) {
  switch (section._type) {
    case "codeShowcaseSection":
      return <CodeShowcaseSection section={section} />;
    case "contributionGridSection":
      return <ContributionSection section={section} />;
    case "interactiveSandboxSection":
      return <SandboxSection section={section} />;
    case "mediaShowcaseSection":
      return <MediaSection section={section} />;
    case "narrativeSection":
      return <NarrativeSection section={section} />;
    case "outcomesSection":
      return <OutcomesSection section={section} />;
    case "processSection":
      return <ProcessSection section={section} />;
    case "heroSection":
      return null;
  }
}

export function ProjectPageBuilder({ project }: { project: ProjectPageData }) {
  const sections = project.sections ?? [];
  const hero = sections.find((section) => section._type === "heroSection");

  return (
    <>
      <ProjectHero
        project={project}
        section={hero?._type === "heroSection" ? hero : undefined}
      />
      {sections.map((section, index) => {
        if (section._type === "heroSection") return null;
        return (
          <div
            data-project-section
            data-section-type={section._type}
            id={sectionId(section, index)}
            key={section._key}
          >
            {renderSection(section)}
          </div>
        );
      })}
      {sections.length === 0 ? (
        <section className="border-b border-black/[0.08] py-16 sm:py-20">
          <div
            className="mx-auto grid max-w-[52rem] gap-4 px-6 text-center md:px-12"
            data-project-reveal
          >
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-accent">
              Case study in progress
            </p>
            <h2 className="headline-md">
              The detailed breakdown is being prepared.
            </h2>
            <p className="text-sm leading-7 text-ink-soft">
              The project summary, role, tools and available links above are
              already verified. More implementation evidence will appear here as
              it is documented in Sanity.
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
