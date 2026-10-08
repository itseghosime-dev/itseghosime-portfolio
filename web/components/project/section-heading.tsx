type SectionHeadingProps = {
  eyebrow?: string | null;
  heading: string;
  introduction?: string | null;
};

export function SectionHeading({
  eyebrow,
  heading,
  introduction,
}: SectionHeadingProps) {
  return (
    <header className="grid max-w-4xl gap-5" data-project-reveal>
      {eyebrow ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.11em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-[52rem] text-balance font-serif text-[clamp(2.25rem,4.5vw,3.6rem)] leading-[1.1] tracking-[-0.03em]">
        {heading}
      </h2>
      {introduction ? (
        <p className="max-w-2xl text-sm leading-7 text-ink-soft">
          {introduction}
        </p>
      ) : null}
    </header>
  );
}
