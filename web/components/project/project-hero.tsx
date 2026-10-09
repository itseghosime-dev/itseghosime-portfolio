import Link from "next/link";
import { ArrowDown, ArrowUpRight, GitBranch } from "lucide-react";

import type { ProjectPageData, ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { ProjectImage } from "./project-image";

type ProjectHeroProps = {
  project: ProjectPageData;
  section?: ProjectSectionOf<"heroSection">;
};

const projectTypeLabels = {
  automation: "Automation",
  concept: "Concept project",
  experiment: "Experiment",
  softwareProduct: "Software product",
  webApplication: "Web application",
  website: "Website",
} as const;

export function ProjectHero({ project, section }: ProjectHeroProps) {
  const image = section?.image?.url ? section.image : project.coverImage;
  const presentation = section?.presentation ?? "editorial";
  const sandboxAnchor = project.sections?.findIndex(
    (item) => item._type === "interactiveSandboxSection",
  );

  return (
    <section
      className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-28"
      data-project-section
      id="project-overview"
    >
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-12 lg:gap-16">
          <div className="grid gap-8" data-project-reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.11em] text-ink-muted">
              <span className="text-accent-text">01</span> /{" "}
              {section?.eyebrow ?? "Selected project"} /{" "}
              {projectTypeLabels[project.projectType ?? "website"]}
            </p>
            <h1 className="max-w-[62rem] text-balance font-serif text-[clamp(3rem,7.5vw,6rem)] leading-[0.98] tracking-[-0.04em]">
              {section?.headline ?? project.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
              {section?.introduction ?? project.summary}
            </p>
          </div>

          <dl
            className="grid gap-x-8 gap-y-6 border-y border-black/[0.08] py-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
            data-project-reveal
          >
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                Role
              </dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                Year
              </dt>
              <dd className="mt-1">{project.timeline ?? project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                Client
              </dt>
              <dd className="mt-1">
                {project.client ?? "Independent project"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
                Stack
              </dt>
              <dd className="mt-1">
                {project.technologyStack
                  ?.map((item) => item.name)
                  .filter(Boolean)
                  .join(" · ") || "Project-specific tools"}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3" data-project-reveal>
            {typeof sandboxAnchor === "number" && sandboxAnchor >= 0 ? (
              <Link
                className="inline-flex min-h-11 items-center gap-2 bg-ink px-5 py-2.5 text-xs font-semibold text-background no-underline transition-colors hover:bg-accent"
                href={`#interactive-sandbox-${sandboxAnchor}`}
              >
                Explore live sandbox <ArrowDown aria-hidden="true" size={15} />
              </Link>
            ) : null}
            {project.liveUrl ? (
              <a
                className="inline-flex min-h-11 items-center gap-2 border border-black/[0.12] px-5 py-2.5 text-xs font-semibold no-underline hover:border-accent hover:text-accent"
                href={project.liveUrl}
                rel="noreferrer"
                target="_blank"
              >
                Visit live project <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            ) : null}
            {project.repositoryUrl ? (
              <a
                className="inline-flex min-h-11 items-center gap-2 px-3 py-2.5 text-xs font-semibold text-ink-muted no-underline hover:text-ink"
                href={project.repositoryUrl}
                rel="noreferrer"
                target="_blank"
              >
                <GitBranch aria-hidden="true" size={15} /> Source
              </a>
            ) : null}
          </div>

          {presentation !== "editorial" && image?.url ? (
            <figure
              className={`${presentation === "split" ? "max-w-4xl" : ""} overflow-hidden rounded-[1.2rem] border border-black/15 bg-[#171a1f] p-1.5 shadow-[0_36px_90px_-48px_rgba(15,18,24,0.7)]`}
              data-project-media
              data-project-reveal
            >
              <div
                className="flex h-9 items-center gap-2 px-3"
                aria-hidden="true"
              >
                <span className="size-2 rounded-full bg-[#ff6b65]" />
                <span className="size-2 rounded-full bg-[#e8bc54]" />
                <span className="size-2 rounded-full bg-[#62c371]" />
                <span className="ml-2 h-5 flex-1 rounded-full bg-white/[0.07]" />
              </div>
              <ProjectImage
                className="h-auto w-full rounded-[0.75rem] bg-white"
                image={image}
                priority
              />
              {image.caption ? (
                <figcaption className="px-4 py-3 font-mono text-xs uppercase leading-5 tracking-[0.07em] text-white/58">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
