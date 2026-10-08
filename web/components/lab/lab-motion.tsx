"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

type LabMotionProps = {
  children: ReactNode;
};

export function LabMotion({ children }: LabMotionProps) {
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
      const reveals = gsap.utils.toArray<HTMLElement>(
        "[data-lab-reveal]",
        root,
      );

      reveals.forEach((element, index) => {
        const isAboveFold = index < 2;
        gsap.fromTo(
          element,
          { opacity: 0, y: isAboveFold ? 16 : 28 },
          {
            duration: 0.8,
            ease: "power3.out",
            opacity: 1,
            scrollTrigger: isAboveFold
              ? undefined
              : {
                  once: true,
                  start: "top 88%",
                  trigger: element,
                },
            y: 0,
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
