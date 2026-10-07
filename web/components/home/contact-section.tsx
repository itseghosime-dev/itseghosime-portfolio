import type { HomePageModel } from "@/types/home";
import {ArrowUpRight} from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

import { CopyEmail } from "./copy-email";

type ContactSectionProps = {
  contact: HomePageModel["contact"];
};

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section
      className="border-t border-black/8 py-16 md:py-24"
      id="contact"
      aria-labelledby="contact-title"
      data-reveal
    >
      <Container className="flex flex-col gap-12">
        <div className="max-w-4xl flex flex-col gap-4">
          <p className="label-sm text-accent">Connect</p>
          <h2 className="display-hero" id="contact-title">
            {contact.heading}
          </h2>
        </div>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <CopyEmail email={contact.email} />
          <ButtonLink
            className="min-h-14 text-base rounded-lg py-2"
            href={`mailto:${contact.email}`}
          >
            {contact.buttonLabel}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
          </ButtonLink>
        </div>

        {contact.socialLinks.length > 0 ? (
          <ul
            className="m-0 flex list-none flex-wrap gap-8 p-0 pt-8"
            aria-label="Professional profiles"
          >
            {contact.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  className="inline-flex min-h-11 items-center gap-2 text-sm capitalize text-ink-muted hover:text-ink"
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                  aria-label={link.label}
                >
                  {link.platform}
                  <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
