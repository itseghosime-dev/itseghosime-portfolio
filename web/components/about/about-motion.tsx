"use client";

import gsap from "gsap";
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useEffect, useRef, type ReactNode} from "react";

type AboutMotionProps = {
  children: ReactNode;
};

export function AboutMotion({children}: AboutMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('[data-about-reveal]', root)

      reveals.forEach((element, index) => {
        const isAboveFold = index < 3
        gsap.fromTo(
          element,
          {opacity: 0, y: isAboveFold ? 18 : 30},
          {
            duration: 0.78,
            ease: 'power3.out',
            opacity: 1,
            scrollTrigger: isAboveFold
              ? undefined
              : {
                  once: true,
                  start: 'top 88%',
                  trigger: element,
                },
            y: 0,
          },
        )
      })

      const portrait = root.querySelector<HTMLElement>('[data-about-portrait]')
      if (portrait) {
        gsap.fromTo(
          portrait,
          {clipPath: 'inset(8% 0 8% 0)', yPercent: 4},
          {
            clipPath: 'inset(0% 0 0% 0)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {once: true, start: 'top 86%', trigger: portrait},
            yPercent: 0,
          },
        )
      }
    }, root)

    return () => context.revert()
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
