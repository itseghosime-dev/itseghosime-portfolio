"use client";

import { useRef, useState } from "react";

export function MagneticNavigationSandbox() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const itemARef = useRef<HTMLDivElement>(null);
  const itemBRef = useRef<HTMLDivElement>(null);
  const itemCRef = useRef<HTMLDivElement>(null);
  const [tension, setTension] = useState("0.00G");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!arenaRef.current) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    let maxPull = 0;
    const items = [itemARef.current, itemBRef.current, itemCRef.current];

    items.forEach((item) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const dist = Math.hypot(dx, dy);
      const radius = 90;

      if (dist < radius) {
        const pull = 1 - dist / radius;
        const moveX = dx * 0.35;
        const moveY = dy * 0.35;
        item.style.transform = `translate(${moveX}px, ${moveY}px)`;
        if (pull > maxPull) maxPull = pull;
      } else {
        item.style.transform = "translate(0px, 0px)";
      }
    });

    setTension(`${(maxPull * 1.8).toFixed(2)}G`);
  }

  function handleMouseLeave() {
    [itemARef.current, itemBRef.current, itemCRef.current].forEach((item) => {
      if (item) item.style.transform = "translate(0px, 0px)";
    });
    setTension("0.00G");
  }

  return (
    <div
      className="relative flex h-64 cursor-crosshair select-none flex-col justify-between overflow-hidden border border-black/[0.08] bg-surface-container/60 p-4 transition-colors"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={arenaRef}
    >
      <div className="flex items-center justify-between font-mono text-[11px] text-ink-muted">
        <span>Hover near buttons to trigger magnet pull</span>
        <span className="font-semibold text-ink">TENSION: {tension}</span>
      </div>

      <div className="my-auto flex items-center justify-around">
        <div
          className="flex cursor-pointer select-none items-center gap-2 border border-black/[0.1] bg-surface px-5 py-3 font-mono text-xs text-ink shadow-xs transition-transform duration-100 ease-out"
          ref={itemARef}
        >
          <span className="size-2 rounded-full bg-accent" />
          <span>Pull Target A</span>
        </div>

        <div
          className="flex cursor-pointer select-none items-center gap-2 bg-ink px-5 py-3 font-mono text-xs text-white shadow-md transition-transform duration-100 ease-out"
          ref={itemBRef}
        >
          <span className="size-2 rounded-full bg-neutral-300" />
          <span>Snap Dock B</span>
        </div>

        <div
          className="cursor-pointer select-none border border-black/[0.1] bg-surface-container px-4 py-3 font-mono text-xs text-ink transition-transform duration-100 ease-out"
          ref={itemCRef}
        >
          Field C
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-black/[0.08] pt-2 font-mono text-[10px] text-ink-muted">
        <span>ATTRACTION RADIUS: 85px</span>
        <span className="font-medium text-accent">SPRING TENSION ENGINE</span>
      </div>
    </div>
  );
}
