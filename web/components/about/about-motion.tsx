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
        const entersFromSide = !isAboveFold && index % 3 === 0
        gsap.fromTo(
          element,
          {
            opacity: 0,
            scale: isAboveFold ? 1 : 0.985,
            x: entersFromSide ? (index % 2 === 0 ? -32 : 32) : 0,
            y: isAboveFold ? 18 : 34,
          },
          {
            clearProps: 'opacity,transform',
            duration: 0.9,
            ease: 'power3.out',
            opacity: 1,
            scale: 1,
            scrollTrigger: isAboveFold
              ? undefined
              : {
                  once: true,
                  start: 'top 88%',
                  trigger: element,
                },
            x: 0,
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

        gsap.to(portrait, {
          ease: 'none',
          scale: 1.035,
          scrollTrigger: {
            end: 'bottom top',
            scrub: 0.65,
            start: 'top bottom',
            trigger: portrait,
          },
        })
      }
    }, root)

    return () => context.revert()
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
