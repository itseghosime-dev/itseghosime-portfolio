import {ArrowDown} from "lucide-react";

import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";

export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-black/8"
      id="top"
      aria-labelledby="hero-title"
      data-hero-surface
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(116deg,rgba(245,244,239,1)_5%,rgba(244,243,237,0.98)_40%,rgba(234,236,242,0.46)_74%,rgba(245,244,239,0.98)_100%)]" />
        <div
          className="absolute -top-[22%] left-[42%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle,rgba(91,112,201,0.12)_0%,rgba(174,181,214,0.06)_40%,transparent_70%)] blur-3xl"
          data-hero-orb
        />
        <div
          className="absolute top-[44%] left-[20%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(215,174,110,0.11)_0%,rgba(221,201,168,0.05)_46%,transparent_72%)] blur-3xl"
          data-hero-orb
        />
        <div
          className="absolute right-[-10%] bottom-[-30%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(129,169,153,0.1)_0%,rgba(196,210,201,0.04)_48%,transparent_72%)] blur-3xl"
          data-hero-orb
        />
        <div
          className="absolute top-0 left-0 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0%,rgba(111,132,224,0.18)_24%,rgba(100,122,214,0.06)_48%,transparent_72%)] opacity-0 blur-2xl will-change-transform"
          data-hero-pointer-glow
        />
        <div
          className="absolute top-0 left-0 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/45 opacity-0 shadow-[0_0_64px_rgba(65,105,225,0.18),inset_0_0_36px_rgba(65,105,225,0.08)] will-change-transform"
          data-hero-impact-ring
        />
        <div
          className="absolute top-0 left-0 hidden items-center gap-2 rounded-full border border-black/10 bg-background/88 px-3 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-soft opacity-0 shadow-[0_8px_28px_rgba(22,23,25,0.08)] backdrop-blur-md will-change-transform md:flex"
          data-hero-cursor-time
        >
          <span className="size-1.5 rounded-full bg-accent" />
          <time data-hero-cursor-time-value>Local time</time>
        </div>
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(22,23,25,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(22,23,25,0.08)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:linear-gradient(to_bottom,black,transparent_84%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background/70 to-transparent" />
      </div>

      <Container className="relative z-10 grid min-h-[calc(100svh-5rem)] content-center py-20 md:min-h-217.5 md:py-24 lg:grid-cols-[minmax(0,7fr)_minmax(20rem,5fr)]">
        <p className="absolute top-7 left-6 hidden text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted/55 md:left-12 md:block">
          LAT: 09°04&apos;N · LON: 07°24&apos;E · UTC+1
        </p>

        <div className="relative flex max-w-172 flex-col items-start gap-8 rounded-2xl bg-background/34 py-6 backdrop-blur-[1px] sm:px-2 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <div className="flex flex-wrap items-center gap-3" data-hero-reveal>
            <StatusBadge>Open to software roles</StatusBadge>
            <span className="text-ink-muted" aria-hidden="true">
              ·
            </span>
            <span className="font-body text-lg italic text-accent">
              Call me Osi.
            </span>
          </div>

          <h1 className="display-hero" id="hero-title" data-hero-reveal>
            I build digital products people enjoy using.
          </h1>

          <div className="grid gap-1" data-hero-reveal>
            <p className="headline-sm">Osi — Frontend Engineer</p>
            <p className="text-[0.8125rem] leading-6 text-ink-muted">
              React · Next.js · TypeScript · Creative Engineering
            </p>
          </div>

          <a
            className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold no-underline"
            href="#work"
            data-hero-reveal
          >
            <span>View work</span>
            <ArrowDown
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-y-1 motion-reduce:transition-none"
              size={17}
              strokeWidth={1.8}
            />
          </a>
        </div>

        <div className="absolute right-6 bottom-7 hidden items-center gap-3 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink-muted/55 md:flex md:right-12">
          <span className="size-1.5 rounded-full bg-accent/65" />
          <span>Move to explore</span>
        </div>
      </Container>
    </section>
  );
}
