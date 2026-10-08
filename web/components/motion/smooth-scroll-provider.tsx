"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type ScrollTarget = HTMLElement | number | string;

type SmoothScrollContextValue = {
  scrollTo: (
    target: ScrollTarget,
    options?: { immediate?: boolean; offset?: number },
  ) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(
  null,
);

const cinematicEase = (progress: number) => 1 - Math.pow(1 - progress, 3.2);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo = useCallback(
    (
      target: ScrollTarget,
      options?: { immediate?: boolean; offset?: number },
    ) => {
      const lenis = lenisRef.current;

      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.05,
          easing: cinematicEase,
          immediate: options?.immediate,
          offset: options?.offset ?? -96,
        });
        return;
      }

      if (target instanceof HTMLElement) {
        target.scrollIntoView({
          behavior: options?.immediate ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [],
  );

  const contextValue = useMemo(() => ({ scrollTo }), [scrollTo]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      anchors: {
        duration: 1.3,
        easing: cinematicEase,
        offset: -96,
      },
      autoRaf: false,
      autoResize: true,
      autoToggle: false,
      duration: 1.25,
      easing: cinematicEase,
      overscroll: true,
      respectReducedMotion: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
      touchMultiplier: 1.05,
      wheelMultiplier: 0.92,
    });

    lenisRef.current = lenis;

    let previousScroll = lenis.scroll;
    const updateScroll = (instance: Lenis) => {
      ScrollTrigger.update();

      const delta = instance.scroll - previousScroll;
      if (Math.abs(delta) > 0.5) {
        document.documentElement.dataset.scrollDirection =
          delta > 0 ? "forward" : "backward";
      }
      previousScroll = instance.scroll;
    };
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh, { once: true });
    document.fonts.ready.then(refresh).catch(() => undefined);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.off("scroll", updateScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (!lenis) return;

      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error("useSmoothScroll must be used within SmoothScrollProvider");
  }

  return context;
}
