import type { ProjectNavigationItem, ProjectPageData } from "@/types/project";

import { NextProject } from "./next-project";
import { ProjectMotion } from "./project-motion";
import { ProjectPageBuilder } from "./project-page-builder";
import { ProjectSubnav } from "./project-subnav";

export function ProjectCaseStudy({
  nextProject,
  project,
}: {
  nextProject: ProjectNavigationItem | null;
  project: ProjectPageData;
}) {
  return (
    <ProjectMotion>
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[80] h-0.5 w-full origin-left scale-x-0 bg-accent"
        data-project-progress
      />
      <ProjectSubnav sections={project.sections ?? []} />
      <ProjectPageBuilder project={project} />
      <NextProject project={nextProject} />
    </ProjectMotion>
  );
}
