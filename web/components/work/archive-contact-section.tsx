import Link from "next/link";

import type { HomePageModel } from "@/types/home";

import { CopyEmail } from "@/components/home/copy-email";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

type ArchiveContactSectionProps = {
  contact: HomePageModel["contact"];
};

const explorationLinks = [
  { href: "/work?filter=experimental", label: "Lab experiments" },
  { href: "/about", label: "Profile & dossier" },
];

export function ArchiveContactSection({ contact }: ArchiveContactSectionProps) {
  return (
    <section
      className="border-t border-black/10 py-20 md:py-28"
      id="contact"
      aria-labelledby="archive-contact-title"
    >
      <Container className="grid gap-16">
        <span className="mx-auto h-px w-3 bg-accent" aria-hidden="true" />

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.8fr)] lg:gap-20">
          <div className="max-w-3xl flex flex-col gap-4">
            <p className="flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              <span
                className="size-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              Get in touch
            </p>
            <h2
              className="mt-4 max-w-2xl font-serif text-[clamp(2.5rem,4.5vw,3.75rem)] leading-[0.98] tracking-[-0.025em]"
              id="archive-contact-title"
            >
              Seen enough? Let&apos;s build something considered.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-ink-muted">
              {contact.message}
            </p>

            <div className="mt-7">
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <CopyEmail email={contact.email} />
                <ButtonLink
                  className="min-h-14 rounded-lg py-2 text-base"
                  href={`mailto:${contact.email}`}
                >
                  {contact.buttonLabel} <span aria-hidden="true">↗</span>
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 self-start lg:pt-2">
            <div>
              <h3 className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted">
                Channels
              </h3>
              <ul className="mt-4 grid list-none gap-2.5 p-0">
                {contact.socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      className="inline-flex min-h-7 items-center gap-1 font-mono text-[0.6875rem] no-underline transition-colors hover:text-accent"
                      href={link.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.platform} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted">
                Exploration
              </h3>
              <ul className="mt-4 grid list-none gap-2.5 p-0">
                {explorationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="inline-flex min-h-7 items-center gap-1 font-mono text-[0.6875rem] no-underline transition-colors hover:text-accent"
                      href={link.href}
                    >
                      {link.label} <span aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
