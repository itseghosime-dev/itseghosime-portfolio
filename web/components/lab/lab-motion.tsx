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
        const isCard = element.hasAttribute("data-lab-card");
        gsap.fromTo(
          element,
          {
            opacity: 0,
            rotate: isCard ? (index % 2 === 0 ? -1.2 : 1.2) : 0,
            scale: isCard ? 0.96 : 1,
            x: !isAboveFold && !isCard ? (index % 2 === 0 ? -28 : 28) : 0,
            y: isAboveFold ? 16 : isCard ? 52 : 32,
          },
          {
            clearProps: "opacity,transform",
            duration: isCard ? 0.95 : 0.82,
            ease: "power3.out",
            opacity: 1,
            rotate: 0,
            scale: 1,
            scrollTrigger: isAboveFold
              ? undefined
              : {
                  once: true,
                  start: "top 88%",
                  trigger: element,
                },
            x: 0,
            y: 0,
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
