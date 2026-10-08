"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

export function NoteDetailMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const intro = root.querySelector<HTMLElement>("[data-note-detail-intro]");
      const sidebar = intro?.querySelector<HTMLElement>("aside");
      const articleHeader = intro?.querySelector<HTMLElement>("article > header");

      if (sidebar) {
        gsap.fromTo(
          sidebar,
          { opacity: 0, x: -24 },
          { duration: 0.75, ease: "power3.out", opacity: 1, x: 0 },
        );
      }

      if (articleHeader) {
        gsap.fromTo(
          articleHeader.children,
          { opacity: 0, y: 22 },
          {
            delay: 0.08,
            duration: 0.72,
            ease: "power3.out",
            opacity: 1,
            stagger: 0.07,
            y: 0,
          },
        );
      }

      gsap.utils
        .toArray<HTMLElement>(".note-reading-body > *", root)
        .forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0.3, y: 18 },
            {
              duration: 0.68,
              ease: "power2.out",
              opacity: 1,
              scrollTrigger: {
                once: true,
                start: "top 91%",
                trigger: element,
              },
              y: 0,
            },
          );
        });

      gsap.utils
        .toArray<HTMLElement>("[data-note-detail-section]", root)
        .forEach((section, index) => {
          gsap.fromTo(
            section,
            {
              clipPath:
                index % 2 === 0
                  ? "inset(0 7% 0 0)"
                  : "inset(0 0 0 7%)",
              opacity: 0.25,
            },
            {
              clipPath: "inset(0 0 0 0)",
              duration: 0.9,
              ease: "power3.out",
              opacity: 1,
              scrollTrigger: {
                once: true,
                start: "top 88%",
                trigger: section,
              },
            },
          );
        });
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
