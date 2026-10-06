import Link from "next/link";

import { Container } from "@/components/ui/container";

export function AboutSection() {
  return (
    <section
      className="border-t border-black/8 py-16 md:py-24"
      id="about"
      aria-labelledby="about-title"
      data-reveal
    >
      <Container>
        <div className="grid max-w-4xl mx-auto gap-6">
          <p className="label-sm text-accent">Profile</p>
          <h2 className="headline-lg" id="about-title">
            I&apos;m Osi.
          </h2>
          <p className="font-serif text-2xl leading-relaxed font-normal text-ink-soft md:text-3xl">
            I specialize in the space between design systems and frontend
            architecture, crafting software that feels natural, fast, and
            considered down to the sub-pixel.
          </p>
          <Link
            className="group inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold no-underline"
            href="/about"
          >
            <span>More about me</span>
            <span
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
