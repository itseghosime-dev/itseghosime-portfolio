import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

import type { ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { ProjectImage } from "./project-image";

const portableTextComponents = {
  block: {
    blockquote: ({ children }) => (
      <blockquote className="m-0 border-l-2 border-accent pl-5 font-serif text-xl leading-8 text-ink">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="grid list-disc gap-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="grid list-decimal gap-2 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const link = value as
        { href?: string; openInNewTab?: boolean } | undefined;
      if (!link?.href) return <>{children}</>;
      return (
        <a
          className="font-medium text-accent underline decoration-accent/35 underline-offset-4"
          href={link.href}
          rel={link.openInNewTab ? "noreferrer" : undefined}
          target={link.openInNewTab ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
} satisfies PortableTextComponents;

export function NarrativeSection({
  section,
}: {
  section: ProjectSectionOf<"narrativeSection">;
}) {
  if (!section.heading) return null;

  const body: PortableTextBlock[] = (section.body ?? []).flatMap((block) => {
    const children = (block.children ?? []).flatMap((child) =>
      child.text === null
        ? []
        : [
            {
              _key: child._key,
              _type: "span" as const,
              marks: child.marks ?? [],
              text: child.text,
            },
          ],
    );
    if (children.length === 0) return [];

    return [
      {
        _key: block._key,
        _type: "block" as const,
        children,
        level: block.level ?? undefined,
        listItem: block.listItem ?? undefined,
        markDefs: (block.markDefs ?? []).map((mark) => ({
          _key: mark._key,
          _type: mark._type,
          href: mark.href ?? undefined,
          openInNewTab: mark.openInNewTab ?? undefined,
        })),
        style: block.style ?? "normal",
      },
    ];
  });
  const hasMedia =
    Boolean(section.image?.url) && section.presentation !== "textOnly";
  const isStickyNarrative =
    section.presentation === "stickyText" ||
    /\bchallenges?\b/i.test(section.eyebrow ?? "");
  const hasPortraitMedia = Boolean(
    section.image?.height &&
    section.image?.width &&
    section.image.height / section.image.width > 1.2,
  );

  return (
    <section
      className={`border-b border-black/[0.08] py-20 sm:py-24 ${isStickyNarrative ? "lg:py-0" : "lg:py-32"}`}
    >
      <Container>
        <div
          className={`mx-auto grid max-w-[65rem] gap-12 lg:gap-16 ${isStickyNarrative ? "lg:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.22fr)] lg:items-start" : hasMedia ? "lg:grid-cols-12 lg:items-center" : "md:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.28fr)] md:gap-16"}`}
        >
          <header
            className={`${isStickyNarrative ? "lg:sticky lg:top-32 lg:flex lg:min-h-[calc(100svh-8rem)] lg:items-center lg:self-start" : hasMedia && section.presentation === "mediaLeft" ? "lg:order-2 lg:col-span-5" : hasMedia ? "lg:col-span-5" : ""}`}
          >
            <div className="grid content-start gap-5" data-project-reveal>
              {section.eyebrow ? (
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.11em] text-accent">
                  {section.eyebrow}
                </p>
              ) : null}
              <h2 className="text-balance font-serif text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.1] tracking-[-0.03em]">
                {section.heading}
              </h2>
            </div>
          </header>

          <div
            className={`${isStickyNarrative ? "min-w-0 gap-10 lg:py-32 lg:pb-[18vh]" : hasMedia && section.presentation === "mediaLeft" ? "lg:order-1 lg:col-span-7" : hasMedia ? "lg:col-span-7" : ""} grid gap-7`}
            data-project-reveal
          >
            {hasMedia ? (
              <figure
                className={`${hasPortraitMedia ? "mx-auto max-w-[18rem] rounded-[1.15rem] border-white/12 bg-[#15181d] p-1.5" : "rounded-[1.15rem] border-black/10 bg-[#171a1f] p-1.5"} overflow-hidden border shadow-[0_30px_75px_-44px_rgba(15,18,24,0.68)]`}
                data-project-media
              >
                <ProjectImage
                  className={`${hasPortraitMedia ? "max-h-[38rem] rounded-[0.8rem] object-cover object-top" : "max-h-[42rem] rounded-[0.75rem] object-contain object-top"} h-auto w-full bg-white`}
                  image={section.image}
                  sizes={hasPortraitMedia ? "288px" : undefined}
                />
                {section.image?.caption ? (
                  <figcaption className="px-4 py-3 text-xs leading-5 text-white/58">
                    {section.image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            {body.length ? (
              <div className="grid max-w-[45rem] gap-6 text-sm leading-7 text-ink-soft sm:text-[0.9375rem] sm:leading-8">
                <PortableText
                  components={portableTextComponents}
                  value={body}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
