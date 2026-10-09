"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Circle,
  Download,
  Eye,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { HomePageModel } from "@/types/home";

import { Container } from "@/components/ui/container";

import { ContactForm } from "./contact-form";
import { RecruiterBriefDrawer } from "./recruiter-brief-drawer";
import { WorldClocks } from "./world-clocks";

type ContactExperienceProps = {
  capabilities: HomePageModel["capabilities"];
  contact: HomePageModel["contact"];
  hero: HomePageModel["hero"];
  technologies: HomePageModel["technologies"];
};

export function ContactExperience({
  capabilities,
  contact,
  hero,
  technologies,
}: ContactExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"copied" | "idle">("idle");

  useEffect(() => {
    if (copyStatus !== "copied") {
      return;
    }

    const timeout = window.setTimeout(() => setCopyStatus("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-contact-intro]"),
        { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 18 },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.82,
          ease: "power3.out",
          opacity: 1,
          stagger: 0.09,
          y: 0,
        },
      );

      root
        .querySelectorAll<HTMLElement>("[data-contact-panel]")
        .forEach((panel, index) => {
          gsap.fromTo(
            panel,
            { opacity: 0, x: index % 2 === 0 ? -34 : 34 },
            {
              duration: 0.86,
              ease: "power3.out",
              opacity: 1,
              scrollTrigger: {
                once: true,
                start: "top 86%",
                trigger: panel,
              },
              x: 0,
            },
          );
        });
    }, root);

    return () => context.revert();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyStatus("copied");
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  }

  return (
    <div ref={rootRef}>
      <section className="border-b border-black/[0.08] py-12 sm:py-16 lg:py-20" data-contact-section>
        <Container className="grid gap-8">
          <header className="grid max-w-3xl gap-5" data-contact-intro>
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-text">
              Contact <span aria-hidden="true">{"//"}</span> 2026 engagements
            </p>
            <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.035em]">
              Have something worth building?
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
              A direct invitation for frontend development roles, software
              engineering opportunities, thoughtful collaborations, or ambitious
              digital products. Reaching me is simple and direct.
            </p>
          </header>

          <div className="grid border border-black/[0.1] bg-surface sm:grid-cols-[1fr_auto] sm:items-stretch" data-contact-intro>
            <div className="grid gap-1 px-5 py-4 sm:px-6">
              <p className="flex items-center gap-2 font-mono text-sm font-semibold text-ink">
                <Circle
                  aria-hidden="true"
                  className="fill-accent text-accent"
                  size={7}
                />
                {contact.email}
              </p>
              <p className="text-xs leading-5 text-ink-muted">
                {hero.location
                  ? `Based in ${hero.location}`
                  : "Based in Nigeria"}{" "}
                · Available for worldwide remote opportunities.
              </p>
            </div>
            <div className="flex border-t border-black/[0.1] sm:border-t-0 sm:border-l">
              <button
                className="min-h-12 flex-1 cursor-pointer bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent sm:min-w-48"
                type="button"
                onClick={copyEmail}
              >
                {copyStatus === "copied"
                  ? "Email copied"
                  : "Copy email address"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copyStatus === "copied"
                  ? "Email address copied to clipboard."
                  : ""}
              </span>
              <a
                className="grid min-h-12 w-14 place-items-center border-l border-white/20 bg-ink text-white no-underline transition-colors hover:bg-accent"
                href={`mailto:${contact.email}`}
                aria-label="Open email application"
              >
                <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
              </a>
            </div>
          </div>

          <button
            className="group flex min-h-12 cursor-pointer items-center justify-between gap-5 border-y border-black/[0.08] bg-transparent px-1 py-3 text-left text-sm transition-colors hover:text-accent"
            type="button"
            onClick={() => setIsBriefOpen(true)}
            data-contact-intro
          >
            <span className="inline-flex items-center">
              <Sparkles
                aria-hidden="true"
                className="mr-2 text-accent"
                size={15}
                strokeWidth={1.8}
              />
              Hiring or evaluating quickly? Open the recruiter web summary.
            </span>
            <span
              className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <span className="inline-flex items-center gap-2">
                Open slide-over
                <ArrowRight aria-hidden="true" size={14} strokeWidth={1.8} />
              </span>
            </span>
          </button>
        </Container>
      </section>

      <section className="py-12 sm:py-16 lg:py-20" aria-label="Contact options" data-contact-section>
        <Container className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,5fr)] lg:gap-16">
          <div data-contact-panel>
            <ContactForm email={contact.email} />
          </div>

          <aside className="grid content-start gap-12 lg:border-l lg:border-black/[0.08] lg:pl-14" data-contact-panel>
            <section aria-labelledby="verified-channels-title">
              <h2
                className="mb-5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted"
                id="verified-channels-title"
              >
                Direct verified channels
              </h2>
              <ul className="m-0 grid list-none p-0">
                {contact.socialLinks.map((link) => (
                  <li className="border-b border-black/[0.08]" key={link.url}>
                    <a
                      className="group flex min-h-15 items-center justify-between gap-5 py-3 text-sm no-underline"
                      href={link.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>
                        <strong className="block font-semibold capitalize text-ink">
                          {link.platform}
                        </strong>
                        <span className="block truncate text-xs text-ink-muted">
                          {link.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        size={15}
                        strokeWidth={1.8}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="border-y border-black/[0.08] py-8 sm:py-10"
              aria-labelledby="credentials-title"
            >
              <h2
                className="mb-7 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted"
                id="credentials-title"
              >
                Credentials &amp; dossier
              </h2>
              <div className="border border-black/[0.1] bg-surface p-7 shadow-[var(--shadow-raised)] sm:p-8">
                <div className="flex items-start justify-between gap-7">
                  <div>
                    <p className="font-serif text-2xl leading-tight">
                      Recruiter web summary
                    </p>
                    <p className="mt-2 text-xs text-ink-muted">
                      Current professional snapshot
                    </p>
                  </div>
                  <span className="bg-accent-soft px-2 py-1 font-mono text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-accent">
                    Updated
                  </span>
                </div>
                <p className="mt-7 text-sm leading-7 text-ink-soft">
                  A concise view of my focus, selected capabilities, current
                  technology stack and availability.
                </p>
                <div className="mt-7 grid gap-3">
                  {contact.resume ? (
                    <a
                      className="inline-flex min-h-12 items-center justify-center gap-2 bg-ink px-5 py-3 text-center text-sm font-semibold text-white no-underline transition-colors hover:bg-accent"
                      href={contact.resume.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Download
                        aria-hidden="true"
                        size={15}
                        strokeWidth={1.8}
                      />
                      {contact.resume.label}
                    </a>
                  ) : null}
                  <button
                    className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-black/20 bg-transparent px-5 py-3 text-sm font-semibold transition-colors hover:border-ink hover:bg-surface-layer"
                    type="button"
                    onClick={() => setIsBriefOpen(true)}
                  >
                    <Eye aria-hidden="true" size={15} strokeWidth={1.8} />
                    View web summary
                  </button>
                </div>
              </div>
            </section>

            <WorldClocks />
          </aside>
        </Container>
      </section>

      <RecruiterBriefDrawer
        capabilities={capabilities}
        email={contact.email}
        hero={hero}
        isOpen={isBriefOpen}
        resume={contact.resume}
        technologies={technologies}
        onClose={() => setIsBriefOpen(false)}
      />
    </div>
  );
}
