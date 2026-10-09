import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectNavigationItem } from "@/types/project";

import { Container } from "@/components/ui/container";
import { ProjectImage } from "./project-image";

export function NextProject({
  project,
}: {
  project: ProjectNavigationItem | null;
}) {
  if (!project?.slug || !project.title) return null;

  return (
    <section className="border-b border-black/[0.08] bg-surface-container/55 py-20 sm:py-24 lg:py-32">
      <Container>
        <Link
          className="group mx-auto grid max-w-[65rem] gap-8 no-underline"
          href={`/work/${project.slug}`}
          data-project-reveal
        >
          <div className="grid grid-8">
            <div className="flex items-baseline-last justify-between gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.09em] text-accent-text">
                  Next case study
                </p>
                <h2 className="mt-2 font-serif text-[clamp(2.7rem,7vw,5rem)] leading-[0.95] tracking-[-0.04em]">
                  {project.title}
                </h2>
              </div>
              <span className="hidden items-center gap-2 text-xs font-semibold text-accent-text sm:inline-flex">
                Explore project{" "}
                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  size={15}
                />
              </span>
            </div>
            {project.subtitle ? (
              <p className="max-w-2xl text-sm leading-7 text-ink-soft">
                {project.subtitle}
              </p>
            ) : null}
          </div>
          {project.coverImage?.url ? (
            <div className="aspect-[16/6] overflow-hidden border border-black/[0.08] bg-surface">
              <ProjectImage
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                image={project.coverImage}
              />
            </div>
          ) : null}
        </Link>
      </Container>
    </section>
  );
}
