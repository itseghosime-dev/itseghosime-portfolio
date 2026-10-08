"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  LoaderCircle,
  MousePointerClick,
  Monitor,
  RefreshCw,
  ShieldAlert,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";

import type { ProjectSectionOf } from "@/types/project";

import { Container } from "@/components/ui/container";
import { ProjectImage } from "./project-image";
import { SectionHeading } from "./section-heading";

const viewportWidths = {
  desktop: "100%",
  tablet: "min(100%, 48rem)",
  mobile: "min(100%, 24rem)",
} as const;
type PreviewViewport = keyof typeof viewportWidths;
type VisitorDevice = "desktop" | "tablet" | "mobile";
type SandboxStatus = "loading" | "ready" | "timeout";

const preferredViewport: Record<VisitorDevice, PreviewViewport> = {
  desktop: "desktop",
  tablet: "tablet",
  mobile: "mobile",
};
const viewportIcons = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const;
const allowedSandboxHosts = new Set(["skinny-can.vercel.app"]);

function safeSandboxUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedSandboxHosts.has(url.hostname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function getVisitorDevice(): VisitorDevice {
  if (window.matchMedia("(min-width: 64rem)").matches) return "desktop";
  if (window.matchMedia("(min-width: 48rem)").matches) return "tablet";
  return "mobile";
}

function getDeviceViewports(
  available: PreviewViewport[],
  device: VisitorDevice | null,
) {
  if (!device || device === "desktop") return available;
  if (device === "tablet") {
    return available.filter((item) => item !== "desktop");
  }
  return available.filter((item) => item === "mobile");
}

export function SandboxSection({
  section,
}: {
  section: ProjectSectionOf<"interactiveSandboxSection">;
}) {
  const available = useMemo(
    () =>
      (section.availableViewports ?? ["desktop"]).filter(
        (item): item is PreviewViewport => item in viewportWidths,
      ),
    [section.availableViewports],
  );
  const initial =
    section.initialViewport && available.includes(section.initialViewport)
      ? section.initialViewport
      : (available[0] ?? "desktop");
  const [viewport, setViewport] = useState<PreviewViewport>(initial);
  const [visitorDevice, setVisitorDevice] = useState<VisitorDevice | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [sandboxStatus, setSandboxStatus] = useState<SandboxStatus>("loading");
  const [canLoadSandbox, setCanLoadSandbox] = useState(false);
  const sandboxSectionRef = useRef<HTMLElement>(null);
  const embedUrl = useMemo(
    () => safeSandboxUrl(section.embedUrl),
    [section.embedUrl],
  );
  const deviceViewports = getDeviceViewports(available, visitorDevice);
  const visibleViewports = deviceViewports.length ? deviceViewports : available;
  const effectiveStatus: SandboxStatus = embedUrl ? sandboxStatus : "timeout";

  useEffect(() => {
    const node = sandboxSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setCanLoadSandbox(true);
        observer.disconnect();
      },
      {rootMargin: "800px 0px"},
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!embedUrl || !canLoadSandbox || sandboxStatus !== "loading") return;

    const timeout = window.setTimeout(() => {
      setSandboxStatus((current) =>
        current === "loading" ? "timeout" : current,
      );
    }, 12_000);

    return () => window.clearTimeout(timeout);
  }, [canLoadSandbox, embedUrl, reloadKey, sandboxStatus]);

  useEffect(() => {
    const updateViewportForDevice = () => {
      const nextDevice = getVisitorDevice();
      const nextAvailable = getDeviceViewports(available, nextDevice);
      const options = nextAvailable.length ? nextAvailable : available;

      setVisitorDevice(nextDevice);
      setViewport((current) => {
        if (options.includes(current)) return current;
        const preferred = preferredViewport[nextDevice];
        return options.includes(preferred) ? preferred : (options[0] ?? current);
      });
    };

    updateViewportForDevice();
    window.addEventListener("resize", updateViewportForDevice);
    return () => window.removeEventListener("resize", updateViewportForDevice);
  }, [available]);

  if (!section.heading) return null;

  function retrySandbox() {
    setIsInteractive(false);
    setSandboxStatus("loading");
    setReloadKey((current) => current + 1);
  }

  function viewProjectMedia() {
    document
      .querySelector<HTMLElement>("[data-project-media]")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const heightClass =
    section.frameHeight === "viewport"
      ? "h-[min(78svh,52rem)]"
      : section.frameHeight === "tall"
        ? "h-[42rem]"
        : "h-[34rem]";

  return (
    <section
      className="relative isolate overflow-clip border-b border-black/[0.08] bg-[#eef0ea] py-20 sm:py-24 lg:py-32"
      data-project-sandbox
      ref={sandboxSectionRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[42rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(80,105,255,0.18),rgba(250,249,244,0)_68%)] blur-3xl"
        data-sandbox-aura
      />
      <Container>
        <div className="mx-auto grid max-w-[70rem] gap-14 lg:gap-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading}
              introduction={section.introduction}
            />
            {embedUrl ? (
              <a
                className="inline-flex min-h-10 shrink-0 items-center gap-2 text-xs font-semibold text-accent no-underline"
                href={embedUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open separately <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ) : null}
          </div>

          <div
            className="overflow-hidden rounded-[1.25rem] border border-black/15 bg-[#14171c] p-1.5 shadow-[0_45px_110px_-52px_rgba(15,18,24,0.72)]"
            data-project-reveal
            data-sandbox-frame
          >
            <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 px-3 py-2 text-white sm:px-4">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/58">
                <span
                  className={`mr-2 inline-block size-2 rounded-full ${effectiveStatus === "ready" ? "bg-[#6ee7a8] shadow-[0_0_16px_rgba(110,231,168,0.72)]" : effectiveStatus === "loading" ? "animate-pulse bg-[#f2c866] motion-reduce:animate-none" : "bg-[#ff817a]"}`}
                />
                {effectiveStatus === "ready"
                  ? "Interactive checkpoint"
                  : effectiveStatus === "loading"
                    ? "Preparing preview"
                    : "Preview needs attention"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {isInteractive ? (
                  <button
                    className="inline-flex min-h-9 items-center gap-1.5 px-3 text-xs font-semibold text-white/70 transition-colors hover:text-white"
                    onClick={() => setIsInteractive(false)}
                    type="button"
                  >
                    <X aria-hidden="true" size={14} /> Release preview
                  </button>
                ) : null}
                <div
                  className="flex gap-1 rounded-lg bg-white/[0.06] p-1"
                  aria-label="Preview viewport"
                  role="group"
                >
                  {visibleViewports.map((item) => {
                    const Icon = viewportIcons[item];
                    return (
                      <button
                        aria-pressed={viewport === item}
                        className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold capitalize disabled:cursor-wait disabled:opacity-45 ${viewport === item ? "bg-white text-[#14171c]" : "text-white/58 hover:bg-white/10 hover:text-white"}`}
                        disabled={effectiveStatus !== "ready"}
                        key={item}
                        onClick={() => setViewport(item)}
                        type="button"
                      >
                        <Icon aria-hidden="true" size={14} />
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className={`${heightClass} grid place-items-center overflow-hidden rounded-[0.8rem] bg-[#dfe2dc] p-2 sm:p-4`}
            >
              <div
                className="relative h-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_24px_65px_-36px_rgba(15,18,24,0.65)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                data-lenis-prevent={isInteractive ? "true" : undefined}
                style={{ width: viewportWidths[viewport] }}
              >
                {embedUrl ? (
                  <>
                    {canLoadSandbox ? (
                      <iframe
                        allow="fullscreen"
                        className={`h-full w-full border-0 transition-opacity duration-500 ${sandboxStatus === "ready" ? "opacity-100" : "opacity-0"} ${isInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
                        data-sandbox-active={isInteractive ? "true" : "false"}
                        key={reloadKey}
                        onLoad={() => setSandboxStatus("ready")}
                        referrerPolicy="strict-origin-when-cross-origin"
                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        src={embedUrl}
                        title={`${section.heading} interactive preview`}
                      />
                    ) : null}
                    {sandboxStatus === "loading" ? (
                      <div
                        className="absolute inset-0 grid content-between overflow-hidden bg-surface p-6 sm:p-8"
                        role="status"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="grid gap-3">
                            <span className="system-skeleton h-5 w-44" />
                            <span className="system-skeleton h-3 w-64 max-w-full" />
                          </div>
                          <span className="system-skeleton h-9 w-28" />
                        </div>
                        <div className="mx-auto grid place-items-center">
                          <div className="relative grid size-48 place-items-center sm:size-56">
                            <span className="absolute inset-0 animate-spin rounded-full border border-dashed border-black/20 motion-reduce:animate-none" />
                            <span className="absolute inset-6 rotate-12 border border-black/12" />
                            <span className="grid size-20 place-items-center bg-surface-container text-accent">
                              <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" size={28} />
                            </span>
                          </div>
                          <p className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
                            Loading isolated preview…
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="system-skeleton h-9 w-32" />
                          <span className="system-skeleton h-9 w-24" />
                        </div>
                      </div>
                    ) : null}
                    {sandboxStatus === "timeout" ? (
                      <div className="absolute inset-0 grid place-items-center overflow-hidden bg-surface p-6 text-center sm:p-10" role="alert">
                        <ProjectImage
                          className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
                          image={section.fallbackImage}
                        />
                        <div className="relative z-10 max-w-lg">
                          <span className="mx-auto grid size-12 place-items-center rounded-full border border-black/10 bg-surface-container text-[var(--error)]">
                            <ShieldAlert aria-hidden="true" size={22} />
                          </span>
                          <h3 className="mt-5 font-serif text-3xl tracking-[-0.03em]">
                            Preview unavailable in this frame.
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-ink-muted">
                            The live site may be blocking embedded access, or the preview took too long to respond. The production page can still be opened safely in a new tab.
                          </p>
                          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <a
                              className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-semibold text-white no-underline hover:bg-accent-hover"
                              href={embedUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Open live platform <ArrowUpRight aria-hidden="true" size={15} />
                            </a>
                            <button
                              className="inline-flex min-h-11 items-center justify-center gap-2 border border-black/20 px-5 text-sm font-semibold hover:border-ink"
                              onClick={retrySandbox}
                              type="button"
                            >
                              <RefreshCw aria-hidden="true" size={15} /> Retry preview
                            </button>
                            <button
                              className="inline-flex min-h-11 items-center justify-center px-4 text-sm font-medium text-ink-muted hover:text-accent"
                              onClick={viewProjectMedia}
                              type="button"
                            >
                              View project images
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {sandboxStatus === "ready" && !isInteractive ? (
                      <button
                        className="absolute inset-0 grid cursor-pointer place-items-center bg-[#11151b]/28 p-6 text-left backdrop-blur-[1px] transition-colors hover:bg-[#11151b]/38"
                        onClick={() => setIsInteractive(true)}
                        type="button"
                      >
                        <span className="grid max-w-sm gap-3 rounded-xl border border-white/18 bg-[#11151b]/88 p-5 text-white shadow-2xl backdrop-blur-md">
                          <span className="grid size-10 place-items-center rounded-full bg-white text-[#11151b]">
                            <MousePointerClick aria-hidden="true" size={18} />
                          </span>
                          <strong className="text-base">
                            Activate live preview
                          </strong>
                          <span className="text-sm leading-6 text-white/68">
                            Explore the project inside this page. Release the
                            preview when you want to continue the case study.
                          </span>
                        </span>
                      </button>
                    ) : null}
                  </>
                ) : (
                  <div className="relative grid h-full place-items-center overflow-hidden p-6 text-center">
                    <ProjectImage
                      className="absolute inset-0 h-full w-full object-cover opacity-10"
                      image={section.fallbackImage}
                    />
                    <div className="relative z-10 max-w-lg bg-background/92 p-7 backdrop-blur sm:p-9">
                      <span className="mx-auto grid size-12 place-items-center rounded-full border border-black/10 bg-surface-container text-ink-muted">
                        <ShieldAlert aria-hidden="true" size={22} />
                      </span>
                      <h3 className="mt-5 font-serif text-3xl tracking-[-0.03em]">
                        Preview unavailable in this sandbox.
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-ink-soft">
                        {section.fallbackMessage ??
                          "This project does not expose a safe embedded preview. Use the project images and implementation notes instead."}
                      </p>
                      <button
                        className="mt-6 min-h-11 border border-black/20 px-5 text-sm font-semibold transition-colors hover:border-ink hover:bg-surface"
                        onClick={viewProjectMedia}
                        type="button"
                      >
                        View project images
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {section.instructions?.length ? (
            <ol className="m-0 grid list-none overflow-hidden rounded-xl border-l border-t border-black/[0.1] bg-background/55 p-0 md:grid-cols-3">
              {section.instructions.map((instruction, index) => (
                <li
                  className="border-b border-r border-black/[0.08] p-6"
                  key={instruction._key}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                    Tour {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold">
                    {instruction.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">
                    {instruction.description}
                  </p>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
