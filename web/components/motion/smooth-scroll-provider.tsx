"use client";

import type Lenis from "lenis";
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
    const desktopMotion = window.matchMedia(
      "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
    );

    if (!desktopMotion.matches) return;

    let cancelled = false;
    let cleanupMotion: (() => void) | undefined;
    let idleId: number | undefined;

    const initializeMotion = async () => {
      if (cancelled || lenisRef.current) return;

      const [{ default: gsap }, { ScrollTrigger }, { default: LenisRuntime }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);

      if (cancelled || lenisRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new LenisRuntime({
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
      const refresh = () => {
        lenis.resize();
        ScrollTrigger.refresh();
      };

      lenis.on("scroll", updateScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      window.addEventListener("load", refresh, { once: true });
      document.fonts.ready.then(refresh).catch(() => undefined);

      cleanupMotion = () => {
        window.removeEventListener("load", refresh);
        gsap.ticker.remove(tick);
        lenis.off("scroll", updateScroll);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    const startMotion = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => void initializeMotion(), {
          timeout: 1_500,
        });
      } else {
        setTimeout(() => void initializeMotion(), 0);
      }
    };

    if (document.readyState === "complete") {
      startMotion();
    } else {
      window.addEventListener("load", startMotion, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", startMotion);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      cleanupMotion?.();
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (!lenis) return;

      lenis.resize();
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
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
