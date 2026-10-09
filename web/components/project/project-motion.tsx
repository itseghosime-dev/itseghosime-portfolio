"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

export function ProjectMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gsap.registerPlugin(ScrollTrigger);

    const subnav = root.querySelector<HTMLElement>("[data-project-subnav]");
    const siteHeader =
      document.querySelector<HTMLElement>("[data-site-header]");
    const sandbox = root.querySelector<HTMLElement>("[data-project-sandbox]");
    const sandboxFocus =
      sandbox?.querySelector<HTMLElement>("[data-sandbox-frame]") ?? sandbox;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-project-section]"),
    );
    const chapterLinks = subnav
      ? Array.from(subnav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
      : [];
    const setActiveChapter = (section: HTMLElement) => {
      chapterLinks.forEach((link) => {
        const isActive = link.hash === `#${section.id}`;
        link.dataset.active = String(isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current?.target instanceof HTMLElement) {
          setActiveChapter(current.target);
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => chapterObserver.observe(section));
    const sandboxObserver = sandbox
      ? new IntersectionObserver(
          ([entry]) => {
            const isActive = Boolean(entry?.isIntersecting);
            [siteHeader, subnav].forEach((navigation) => {
              if (isActive)
                navigation?.setAttribute("data-sandbox-active", "true");
              else navigation?.removeAttribute("data-sandbox-active");
            });
          },
          { rootMargin: "-4% 0px -4% 0px", threshold: 0.04 },
        )
      : null;

    if (sandboxFocus && sandboxObserver) sandboxObserver.observe(sandboxFocus);

    const context = gsap.context(() => {
      if (!prefersReducedMotion) {
        const heroReveals = gsap.utils
          .toArray<HTMLElement>("[data-project-reveal]", root)
          .filter((element) => !element.closest("[data-project-section]"));

        gsap.fromTo(
          heroReveals,
          { opacity: 0, y: 28 },
          {
            duration: 1.05,
            ease: "power4.out",
            opacity: 1,
            stagger: 0.1,
            y: 0,
          },
        );

        sections.forEach((section, sectionIndex) => {
          const reveals = Array.from(
            section.querySelectorAll<HTMLElement>("[data-project-reveal]"),
          );
          if (reveals.length === 0) return;

          const sectionType = section.dataset.sectionType;
          const entersFromSide = sectionType === "narrativeSection";
          const isTechnical = sectionType === "codeShowcaseSection";
          const x = entersFromSide ? (sectionIndex % 2 === 0 ? -42 : 42) : 0;

          gsap.fromTo(
            reveals,
            {
              clipPath: isTechnical ? "inset(0 0 12% 0)" : "inset(0 0 0% 0)",
              opacity: 0,
              scale: sectionType === "interactiveSandboxSection" ? 0.975 : 1,
              x,
              y: entersFromSide ? 18 : 42,
            },
            {
              clearProps: "clipPath,opacity,transform",
              clipPath: "inset(0 0 0% 0)",
              duration: 1.05,
              ease: "power4.out",
              opacity: 1,
              scale: 1,
              scrollTrigger: {
                once: true,
                start: "top 84%",
                trigger: section,
              },
              stagger: 0.11,
              x: 0,
              y: 0,
            },
          );
        });

        gsap.utils
          .toArray<HTMLElement>("[data-project-media]", root)
          .forEach((element) => {
            gsap.fromTo(
              element,
              { clipPath: "inset(4% 0 4% 0)", y: 22 },
              {
                clipPath: "inset(0% 0 0% 0)",
                duration: 1.05,
                ease: "power3.out",
                scrollTrigger: {
                  once: true,
                  start: "top 90%",
                  trigger: element,
                },
                y: 0,
              },
            );
          });

        gsap.utils
          .toArray<HTMLElement>("[data-project-story]", root)
          .forEach((story) => {
            const frame = story.querySelector<HTMLElement>(
              "[data-project-frame]",
            );
            const copy = story.querySelector<HTMLElement>("[data-story-copy]");
            if (!frame || !copy) return;

            const timeline = gsap.timeline({
              scrollTrigger: {
                end: "bottom 25%",
                scrub: 0.9,
                start: "top 82%",
                trigger: story,
              },
            });
            timeline
              .fromTo(
                frame,
                { opacity: 0.36, scale: 0.94, y: 44 },
                { duration: 0.48, ease: "none", opacity: 1, scale: 1, y: 0 },
              )
              .fromTo(
                copy,
                { opacity: 0.28, y: 24 },
                { duration: 0.34, ease: "none", opacity: 1, y: 0 },
                0.08,
              )
              .to(frame, {
                duration: 0.52,
                ease: "none",
                opacity: 0.72,
                scale: 0.985,
              })
              .to(copy, { duration: 0.4, ease: "none", opacity: 0.5 }, 0.6);
          });

        if (sandbox) {
          const sandboxFrame = sandbox.querySelector<HTMLElement>(
            "[data-sandbox-frame]",
          );
          const sandboxAura = sandbox.querySelector<HTMLElement>(
            "[data-sandbox-aura]",
          );
          if (sandboxFrame) {
            gsap.fromTo(
              sandboxFrame,
              { scale: 0.93, y: 56 },
              {
                ease: "none",
                scale: 1,
                scrollTrigger: {
                  end: "top 28%",
                  scrub: 0.95,
                  start: "top 88%",
                  trigger: sandbox,
                },
                y: 0,
              },
            );
          }
          if (sandboxAura) {
            gsap.fromTo(
              sandboxAura,
              { opacity: 0.2, scale: 0.72 },
              {
                ease: "none",
                opacity: 1,
                scale: 1.08,
                scrollTrigger: {
                  end: "bottom 35%",
                  scrub: 1.1,
                  start: "top 85%",
                  trigger: sandbox,
                },
              },
            );
          }
        }
      }

      gsap.to("[data-project-progress]", {
        ease: "none",
        scaleX: 1,
        scrollTrigger: {
          end: "bottom bottom",
          scrub: 0.2,
          start: "top top",
          trigger: root,
        },
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    window.setTimeout(refresh, 300);

    return () => {
      window.removeEventListener("load", refresh);
      sandboxObserver?.disconnect();
      chapterObserver.disconnect();
      siteHeader?.removeAttribute("data-sandbox-active");
      subnav?.removeAttribute("data-sandbox-active");
      context.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
