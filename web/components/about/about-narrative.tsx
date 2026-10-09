import Image from "next/image";
import { Circle, MapPin } from "lucide-react";

import type { AboutProfileModel } from "@/types/about";

import { Container } from "@/components/ui/container";

type AboutNarrativeProps = {
  story: AboutProfileModel["story"];
};

export function AboutNarrative({ story }: AboutNarrativeProps) {
  const [firstParagraph, ...restParagraphs] = story.paragraphs;

  return (
    <section className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto grid max-w-[65rem] gap-12 lg:grid-cols-[minmax(20rem,0.95fr)_minmax(0,1.25fr)] lg:gap-16 xl:grid-cols-[minmax(22.5rem,1fr)_minmax(0,1.25fr)] xl:gap-20">
          <aside
            className="grid content-start gap-6 lg:sticky lg:top-28"
            data-about-reveal
          >
            {story.portrait ? (
              <div className="relative w-full border border-black/[0.08] bg-surface/60 p-3.5 sm:p-4">
                <figure
                  className="group relative aspect-[3.75/5] w-full overflow-hidden bg-surface-container"
                  data-about-portrait
                >
                  <Image
                    alt={story.portrait.alt}
                    blurDataURL={story.portrait.blurDataUrl}
                    className="object-cover object-center grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                    fill
                    placeholder={story.portrait.blurDataUrl ? "blur" : "empty"}
                    priority
                    sizes="(max-width: 640px) 94vw, (max-width: 1023px) 480px, (max-width: 1280px) 400px, 460px"
                    src={story.portrait.url}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"
                    aria-hidden="true"
                  />
                </figure>
                <div className="mt-3.5 flex items-center justify-between font-mono text-[0.6875rem] text-ink-muted">
                  <span className="font-semibold tracking-[0.06em]">
                    FIG 01. PORTRAIT
                  </span>
                  <span>WAT / UTC+1</span>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 border-t border-black/[0.08] pt-4 font-mono text-xs text-ink-muted">
              <p className="flex items-center gap-2 font-medium text-ink">
                <Circle
                  aria-hidden="true"
                  className="size-2 fill-accent text-accent"
                />
                <span>{story.fullName}</span>
              </p>
              <p className="flex items-center gap-1.5 text-[0.6875rem]">
                <MapPin
                  aria-hidden="true"
                  className="shrink-0 text-accent"
                  size={13}
                />
                <span>
                  {story.location ?? "Abuja, Nigeria"} · Remote & Hybrid
                </span>
              </p>
            </div>
          </aside>

          <div className="grid content-start gap-8" data-about-reveal>
            <div className="flex items-center gap-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-text">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              <span>{story.eyebrow}</span>
            </div>

            <div className="grid max-w-2xl gap-6">
              {firstParagraph ? (
                <p className="text-base font-medium leading-8 text-ink sm:text-lg sm:leading-9">
                  {firstParagraph}
                </p>
              ) : null}

              {restParagraphs.map((paragraph) => (
                <p
                  className="text-sm leading-7 text-ink-soft sm:text-[0.9375rem] sm:leading-8"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {story.quickFacts.length > 0 ? (
              <div className="border-t border-black/[0.08] pt-6 grid gap-5">
                <p className="mb-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  Core competencies & focus
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {story.quickFacts.map((fact) => (
                    <li
                      className="border border-black/[0.08] bg-surface/50 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.06em] text-ink-soft transition-colors hover:border-black/25 hover:text-ink"
                      key={fact}
                    >
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
