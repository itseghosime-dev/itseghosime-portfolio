"use client";

import { useEffect, useRef } from "react";

export function NoteReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progress?.style.setProperty("transform", `scaleX(${value})`);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-20 z-[51] h-px bg-black/5">
      <div
        className="h-full origin-left scale-x-0 bg-accent will-change-transform"
        ref={progressRef}
      />
    </div>
  );
}
