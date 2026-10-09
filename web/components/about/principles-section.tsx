import { ArrowUpRight, Sparkles } from "lucide-react";

import type { AboutProfileModel } from "@/types/about";
import type { HomePageModel } from "@/types/home";

import { CopyEmail } from "@/components/home/copy-email";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

type PrinciplesSectionProps = {
  cta: AboutProfileModel["cta"];
  contact: HomePageModel["contact"];
  principles: AboutProfileModel["principles"];
};

export function PrinciplesSection({
  contact,
  cta,
  principles,
}: PrinciplesSectionProps) {
  return (
    <>
      {principles.items.length > 0 ? (
        <section className="border-b border-black/[0.08] py-16 sm:py-20 lg:py-24">
          <Container>
            <div className="mx-auto max-w-[65rem]">
              <div
                className="mb-10 flex items-end justify-between gap-6"
                data-about-reveal
              >
                <div>
                  <p className="mb-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-text">
                    {principles.label}
                  </p>
                  <h2 className="headline-md font-serif text-[clamp(2.2rem,4.2vw,3rem)] tracking-[-0.03em]">
                    {principles.heading}
                  </h2>
                </div>
                <span className="hidden font-mono text-xs text-ink-muted sm:inline">
                  [{String(principles.items.length).padStart(2, "0")}{" "}
                  PRINCIPLES]
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {principles.items.map((principle, index) => (
                  <article
                    className="border border-black/[0.08] bg-surface/50 p-6 transition-all duration-200 hover:border-black/20 hover:bg-surface sm:p-7"
                    data-about-reveal
                    key={principle}
                  >
                    <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                      <span className="font-mono text-xs font-semibold text-accent-text">
                        RULE {String(index + 1).padStart(2, "0")}
                      </span>
                      <Sparkles
                        aria-hidden="true"
                        className="text-accent/60"
                        size={13}
                        strokeWidth={1.8}
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium leading-7 text-ink sm:text-[0.9375rem]">
                      {principle}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section
        className="py-20 sm:py-24 lg:py-28"
        aria-labelledby="about-cta-heading"
      >
        <Container>
          <div
            className="mx-auto grid max-w-[65rem] gap-7 border border-black/[0.1] bg-surface/40 p-8 sm:p-12 grid-cols-1"
            data-about-reveal
          >
            <div className="grid max-w-2xl gap-5">
              <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-text">
                {cta.eyebrow}
              </p>
              <h2
                className="font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.02] tracking-[-0.03em]"
                id="about-cta-heading"
              >
                {cta.heading}
              </h2>
              <p className="text-sm leading-7 text-ink-soft sm:text-base sm:leading-8">
                {cta.message}
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <CopyEmail email={contact.email} />
              <ButtonLink
                className="min-h-14 rounded-lg py-2 text-base"
                href={`mailto:${contact.email}`}
              >
                {cta.label}
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
