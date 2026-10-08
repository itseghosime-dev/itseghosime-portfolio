import { ArrowUpRight, Play } from "lucide-react";

import type { ProjectImageData, ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { ProjectImage } from "./project-image";
import { SectionHeading } from "./section-heading";

type MediaItem = NonNullable<
  ProjectSectionOf<"mediaShowcaseSection">["items"]
>[number];

function MediaFrame({
  image,
  item,
}: {
  image: ProjectImageData | null;
  item: MediaItem;
}) {
  const isMobileVisual =
    item.displayContext === "mobile" ||
    /\b(mobile|phone)\b/i.test(`${item.title ?? ""} ${item.caption ?? ""}`);

  if (isMobileVisual) {
    return (
      <div
        className="mx-auto w-full max-w-[17rem] rounded-[1.15rem] border border-white/12 bg-[#15181d] p-1.5 shadow-[0_30px_70px_-38px_rgba(15,18,24,0.68)]"
        data-project-frame
        data-project-media
      >
        <div className="relative overflow-hidden rounded-[0.8rem] bg-white">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#111419]/80"
          />
          <ProjectImage
            className="max-h-[36rem] w-full object-cover object-top"
            image={image}
            sizes="272px"
          />
        </div>
      </div>
    );
  }

  if (item.displayContext === "browser") {
    return (
      <div
        className="overflow-hidden rounded-[1.15rem] border border-black/15 bg-[#171a1f] p-1.5 shadow-[0_34px_90px_-48px_rgba(16,19,24,0.65)]"
        data-project-frame
        data-project-media
      >
        <div
          className="flex h-9 items-center gap-2 px-3 text-white/45"
          aria-hidden="true"
        >
          <span className="size-2 rounded-full bg-[#ff6b65]" />
          <span className="size-2 rounded-full bg-[#e8bc54]" />
          <span className="size-2 rounded-full bg-[#62c371]" />
          <span className="ml-2 min-w-0 flex-1 truncate rounded-full bg-white/[0.07] px-3 py-1 font-mono text-xs">
            {item.title ?? "Project interface"}
          </span>
        </div>
        <div className="overflow-hidden rounded-[0.75rem] bg-white">
          <ProjectImage
            className="block h-auto w-full object-contain object-top"
            image={image}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-[1.1rem] border border-black/10 bg-surface p-2 shadow-[0_28px_72px_-48px_rgba(16,19,24,0.55)]"
      data-project-frame
      data-project-media
    >
      <ProjectImage className="h-auto w-full rounded-[0.65rem]" image={image} />
    </div>
  );
}

export function MediaSection({
  section,
}: {
  section: ProjectSectionOf<"mediaShowcaseSection">;
}) {
  if (!section.heading || !section.items?.length) return null;

  const presentation = section.presentation ?? "grid";
  const isSequence = presentation === "sequence";
  const wrapperClass =
    presentation === "carousel"
      ? "flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:thin]"
      : isSequence
        ? "grid gap-24 lg:gap-32"
        : "grid gap-8 md:grid-cols-2";

  return (
    <section className="border-b border-black/[0.08] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto grid max-w-[70rem] gap-14 lg:gap-20">
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            introduction={section.introduction}
          />
          <div className={wrapperClass}>
            {section.items.map((item, index) => {
              const visual =
                item.mediaType === "externalVideo"
                  ? item.posterImage
                  : item.image;
              const isEven = index % 2 === 0;
              const visualPosition = isSequence
                ? isEven
                  ? "lg:col-span-8 lg:col-start-5 lg:row-start-1"
                  : "lg:col-span-8 lg:col-start-1 lg:row-start-1"
                : "";
              const copyPosition = isSequence
                ? isEven
                  ? "lg:col-span-3 lg:col-start-1 lg:row-start-1"
                  : "lg:col-span-3 lg:col-start-10 lg:row-start-1"
                : "";

              return (
                <figure
                  className={`${presentation === "carousel" ? "w-[88%] shrink-0 snap-center sm:w-[72%]" : ""} ${isSequence ? "grid gap-7 lg:min-h-[72svh] lg:grid-cols-12 lg:items-center lg:gap-8" : "grid gap-5"} m-0`}
                  data-project-reveal
                  data-project-story={isSequence ? "true" : undefined}
                  key={item._key}
                >
                  <div className={visualPosition}>
                    <div className="group relative">
                      <MediaFrame image={visual} item={item} />
                      {item.mediaType === "externalVideo" && item.videoUrl ? (
                        <a
                          className="absolute inset-0 grid place-items-center rounded-[1.1rem] bg-black/10 text-white no-underline transition-colors hover:bg-black/20"
                          href={item.videoUrl}
                          rel="noreferrer"
                          target="_blank"
                          aria-label={`Play ${item.title ?? "project video"}`}
                        >
                          <span className="grid size-14 place-items-center rounded-full bg-ink shadow-xl">
                            <Play
                              aria-hidden="true"
                              className="ml-0.5"
                              size={20}
                            />
                          </span>
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <figcaption
                    className={`${copyPosition} ${isSequence ? "grid content-center gap-4 lg:sticky lg:top-40" : "grid gap-3 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] sm:gap-8"}`}
                    data-story-copy={isSequence ? "true" : undefined}
                  >
                    {isSequence ? (
                      <p className="font-mono text-xs uppercase tracking-[0.09em] text-accent">
                        Frame {String(index + 1).padStart(2, "0")} /{" "}
                        {String(section.items?.length ?? 0).padStart(2, "0")}
                      </p>
                    ) : null}
                    <h3 className="text-base font-semibold leading-6">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-7 text-ink-muted">
                      {item.caption}
                    </p>
                    {item.mediaType === "externalVideo" && item.videoUrl ? (
                      <a
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent no-underline sm:col-start-2"
                        href={item.videoUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open video <ArrowUpRight aria-hidden="true" size={14} />
                      </a>
                    ) : null}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
