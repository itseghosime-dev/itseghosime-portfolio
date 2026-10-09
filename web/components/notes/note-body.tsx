import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import type { NoteBodyBlock, NoteHeading } from "@/types/notes";
import type { ImageAsset } from "@/types/home";

import { NoteCodePanel } from "./note-code-panel";
import { NoteImage } from "./note-image";

type RichBlockValue = PortableTextBlock & { _key: string };

function blockText(value: RichBlockValue): string {
  return value.children
    .map((child) => ("text" in child ? child.text : ""))
    .join("")
    .trim();
}

function ComparisonPreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div
        className="grid h-24 place-items-center border border-black/[0.08] bg-white"
        aria-hidden="true"
      >
        <span className="size-6 animate-spin rounded-full border-2 border-black/15 border-t-accent motion-reduce:animate-none" />
      </div>
    );
  }

  if (index === 1) {
    return (
      <div
        className="grid h-24 content-center gap-2 border border-black/[0.08] bg-white px-4"
        aria-hidden="true"
      >
        <span className="h-2 w-2/3 animate-pulse bg-black/10 motion-reduce:animate-none" />
        <span className="h-2 w-full animate-pulse bg-black/[0.07] motion-reduce:animate-none" />
        <span className="h-2 w-4/5 animate-pulse bg-black/[0.07] motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div
      className="grid h-24 grid-cols-[2rem_1fr] gap-2 border border-accent/20 bg-white p-3"
      aria-hidden="true"
    >
      <span className="row-span-3 bg-accent/10" />
      <span className="h-2 w-3/5 bg-accent/25" />
      <span className="h-2 w-full bg-black/[0.07]" />
      <span className="h-2 w-4/5 bg-black/[0.07]" />
    </div>
  );
}

export function NoteBody({
  body,
  headings,
}: {
  body: NoteBodyBlock[];
  headings: NoteHeading[];
}) {
  const headingIds = new Map(
    headings.map((heading) => [heading.title, heading.id]),
  );

  const components = {
    block: {
      blockquote: ({ children }) => (
        <blockquote className="my-10 border-l-2 border-accent bg-surface px-6 py-5 font-serif text-[clamp(1.35rem,2.4vw,1.75rem)] italic leading-[1.4] text-ink shadow-[inset_0_0_0_1px_rgba(22,23,25,0.04)]">
          {children}
        </blockquote>
      ),
      h2: ({ children, value }) => (
        <h2
          className="mb-5 mt-16 font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.08] tracking-[-0.035em] text-ink first:mt-0 sm:mt-20"
          id={headingIds.get(blockText(value as RichBlockValue))}
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          className="mb-4 mt-12 font-serif text-[clamp(1.55rem,3vw,2rem)] leading-[1.15] tracking-[-0.025em] text-ink"
          id={headingIds.get(blockText(value as RichBlockValue))}
        >
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className="my-0 text-[1.0625rem] leading-8 text-ink-soft">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="my-7 grid list-disc gap-3 pl-6 text-[1.0625rem] leading-8 text-ink-soft marker:text-accent">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="my-7 grid list-decimal gap-3 pl-6 text-[1.0625rem] leading-8 text-ink-soft marker:font-mono marker:text-accent">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="pl-1">{children}</li>,
      number: ({ children }) => <li className="pl-1">{children}</li>,
    },
    marks: {
      code: ({ children }) => (
        <code className="border border-black/8 bg-surface-layer px-1.5 py-0.5 font-mono text-[0.86em] text-ink">
          {children}
        </code>
      ),
      link: ({ children, value }) => {
        const link = value as
          { href?: string; openInNewTab?: boolean } | undefined;
        if (!link?.href) return <>{children}</>;
        return (
          <a
            className="font-medium text-accent-text underline decoration-accent-text/30 underline-offset-4"
            href={link.href}
            rel={link.openInNewTab ? "noreferrer" : undefined}
            target={link.openInNewTab ? "_blank" : undefined}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      accessibleImage: ({ value }) => {
        const image = value as {
          alt?: string;
          caption?: string;
          height?: number;
          lqip?: string;
          url?: string;
          width?: number;
        };
        if (!image.url || !image.alt || !image.width || !image.height)
          return null;

        const imageAsset: ImageAsset = {
          alt: image.alt,
          blurDataUrl: image.lqip,
          caption: image.caption,
          height: image.height,
          url: image.url,
          width: image.width,
        };

        return <NoteImage image={imageAsset} />;
      },
      codeBlock: ({ value }) => {
        const code = value as {
          caption?: string;
          code?: string;
          filename?: string;
          language?: string;
        };
        return code.code ? <NoteCodePanel {...code} code={code.code} /> : null;
      },
      noteComparison: ({ value }) => {
        const comparison = value as {
          eyebrow?: string;
          items?: Array<{
            _key: string;
            description?: string;
            label?: string;
            title?: string;
          }>;
          title?: string;
        };
        if (!comparison.items?.length) return null;

        return (
          <section className="my-12 border-y border-black/[0.09] py-7 sm:my-14 sm:py-8">
            {comparison.eyebrow ? (
              <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-accent">
                {comparison.eyebrow}
              </p>
            ) : null}
            {comparison.title ? (
              <h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.025em]">
                {comparison.title}
              </h3>
            ) : null}
            <div className="mt-6 grid border-l border-t border-black/[0.09] sm:grid-cols-3">
              {comparison.items.map((item, index) => (
                <article
                  className={`min-h-64 border-b border-r border-black/[0.09] p-4 ${index === comparison.items!.length - 1 ? "bg-accent-soft/50" : "bg-surface"}`}
                  key={item._key}
                >
                  <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.09em] text-accent">
                    {item.label}
                  </p>
                  <div className="mt-4">
                    <ComparisonPreview index={index} />
                  </div>
                  <h4 className="mt-4 text-sm font-semibold tracking-[-0.01em] text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      },
    },
  } satisfies PortableTextComponents;

  return (
    <div className="note-reading-body grid gap-6">
      <PortableText
        components={components}
        value={body as unknown as PortableTextBlock[]}
      />
    </div>
  );
}
