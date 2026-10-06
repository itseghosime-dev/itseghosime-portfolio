import Image from "next/image";

import type { ImageAsset, ProjectSummary } from "@/types/home";

import { Container } from "@/components/ui/container";

type WorkSectionProps = {
  projects: ProjectSummary[];
};

function ProjectLink({ project }: { project: ProjectSummary }) {
  const href = `/projects/${project.slug}`;

  if (!href) {
    return null;
  }

  return (
    <a
      className="group inline-flex min-h-8 items-center gap-2 text-sm font-semibold text-accent no-underline"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span>View case study</span>
      <span
        className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  );
}

function ProjectHeading({
  index,
  project,
}: {
  index: number;
  project: ProjectSummary;
}) {
  return (
    <div className="grid gap-4 border-b border-black/8 pb-6 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] md:items-end">
      <div className="grid gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
          {String(index + 1).padStart(2, "0")} / {project.type}
        </p>
        <h2 className="headline-lg mt-2">{project.title}</h2>
        <p className="max-w-176 text-[1.0625rem] leading-[1.55] text-ink-soft">
          {project.subtitle}
        </p>
      </div>

      <div className="grid content-start gap-3 text-[0.8125rem] text-ink-muted md:justify-items-end md:text-right">
        {project.technologies.length > 0 ? (
          <p>{project.technologies.join(" · ")}</p>
        ) : null}
        <ProjectLink project={project} />
      </div>
    </div>
  );
}

function ProjectImage({
  className = "",
  image,
}: {
  className?: string;
  image: ImageAsset;
}) {
  return (
    <Image
      alt={image.alt}
      blurDataURL={image.blurDataUrl}
      className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none ${className}`}
      height={image.height}
      placeholder={image.blurDataUrl ? "blur" : "empty"}
      sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1399px) calc(100vw - 96px), 1240px"
      src={image.url}
      width={image.width}
    />
  );
}

function PrimaryProject({
  index,
  project,
}: {
  index: number;
  project: ProjectSummary;
}) {
  return (
    <article className="grid gap-8" data-reveal>
      <ProjectHeading index={index} project={project} />
      <div className="group overflow-hidden rounded-xl border border-black/8 bg-surface transition-shadow duration-500 hover:shadow-2xl">
        <div className="aspect-video overflow-hidden bg-surface-layer">
          <ProjectImage image={project.coverImage} />
        </div>
        <div className="grid gap-6 border-t border-black/8 bg-surface/80 p-6 backdrop-blur md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10">
          <p className="max-w-3xl text-base leading-[1.65] text-ink-soft">
            {project.summary}
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted">
            {project.timeline ?? project.year} / {project.role}
          </p>
        </div>
      </div>
    </article>
  );
}

function SplitProject({
  index,
  project,
}: {
  index: number;
  project: ProjectSummary;
}) {
  return (
    <article className="grid gap-8" data-reveal>
      <ProjectHeading index={index} project={project} />
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="grid gap-6 lg:col-span-4">
          <div className="grid gap-4 rounded-lg border border-black/8 bg-surface-container p-6">
            <h3 className="text-lg font-semibold">Contribution</h3>
            <p className="leading-[1.65] text-ink-soft">{project.summary}</p>
            {project.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies.map((technology) => (
                  <span
                    className="rounded border border-black/8 bg-surface px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.05em] text-ink-muted"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <p className="px-2 text-sm leading-6 text-ink-muted">
            {project.timeline ?? project.year} · {project.role}
          </p>
        </div>

        <div className="group overflow-hidden rounded-xl border border-black/8 bg-surface-container-high shadow-sm lg:col-span-8">
          <div className="aspect-[16/10] overflow-hidden">
            <ProjectImage image={project.coverImage} />
          </div>
        </div>
      </div>
    </article>
  );
}

function LayeredProject({
  index,
  project,
}: {
  index: number;
  project: ProjectSummary;
}) {
  return (
    <article className="grid gap-8" data-reveal>
      <ProjectHeading index={index} project={project} />
      <div className="group relative overflow-hidden rounded-xl border border-black/8 bg-surface-container p-6 sm:p-8 md:p-16">
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="relative z-10 overflow-hidden rounded-lg border border-black/8 shadow-xl md:col-span-7">
            <div className="aspect-[16/10]">
              <ProjectImage image={project.coverImage} />
            </div>
          </div>
          <div className="relative z-20 mx-auto -mt-20 w-3/4 overflow-hidden rounded-lg border border-white/80 shadow-2xl transition-transform duration-500 group-hover:translate-y-2 motion-reduce:transition-none md:col-span-5 md:-mt-0 md:-ml-12 md:w-full">
            <div className="aspect-[4/5]">
              <ProjectImage
                className="object-center"
                image={project.supportingImage ?? project.coverImage}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function WorkSection({ projects }: WorkSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-24" id="work" aria-label="Selected work">
      <Container>
        <div className="grid gap-28 md:gap-36">
          {projects.map((project, index) => {
            if (index === 1) {
              return (
                <SplitProject
                  index={index}
                  key={project.slug}
                  project={project}
                />
              );
            }

            if (index === 2) {
              return (
                <LayeredProject
                  index={index}
                  key={project.slug}
                  project={project}
                />
              );
            }

            return (
              <PrimaryProject
                index={index}
                key={project.slug}
                project={project}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
