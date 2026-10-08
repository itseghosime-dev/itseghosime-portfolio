"use client";

import { useState, useRef } from "react";

const NODES = [
  { id: "NODE 01", title: "Momentum Alpha", barClass: "bg-accent w-6" },
  { id: "NODE 02", title: "Kinetic Spring", barClass: "bg-ink w-10" },
  { id: "NODE 03", title: "Damping Ratio", barClass: "bg-neutral-400 w-8" },
  { id: "NODE 04", title: "Restitution", barClass: "bg-[#b6c4ff] w-12" },
  { id: "NODE 05", title: "Inertial Decay", barClass: "bg-accent/70 w-7" },
];

export function SpringCarouselSandbox() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const prevTranslateRef = useRef(0);
  const [offsetLabel, setOffsetLabel] = useState("OFFSET: 0px");

  function handleMouseDown(e: React.MouseEvent) {
    if (!trackRef.current) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.style.transition = "none";
  }

  function handleMouseUp() {
    if (!isDownRef.current || !trackRef.current) return;
    isDownRef.current = false;
    trackRef.current.style.transition =
      "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";

    // Clamp
    if (currentTranslateRef.current > 0) currentTranslateRef.current = 0;
    if (currentTranslateRef.current < -180) currentTranslateRef.current = -180;
    trackRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
    prevTranslateRef.current = currentTranslateRef.current;
    setOffsetLabel(`OFFSET: ${Math.round(currentTranslateRef.current)}px`);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDownRef.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    currentTranslateRef.current = prevTranslateRef.current + walk;

    // Soft resistance bounds
    if (currentTranslateRef.current > 20) currentTranslateRef.current = 20;
    if (currentTranslateRef.current < -200) currentTranslateRef.current = -200;

    trackRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
    setOffsetLabel(`OFFSET: ${Math.round(currentTranslateRef.current)}px`);
  }

  return (
    <div
      className="relative flex h-64 select-none flex-col justify-between overflow-hidden border border-black/[0.08] bg-surface-container/60 p-4 transition-colors"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between font-mono text-[11px] text-ink-muted">
        <span>DRAG & FLICK HORIZONTALLY</span>
        <span>{offsetLabel}</span>
      </div>

      <div
        className="my-auto flex cursor-grab gap-3 overflow-x-hidden py-2 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        ref={trackRef}
        style={{ transition: "transform 0.1s ease-out" }}
      >
        {NODES.map((node) => (
          <div
            className="flex h-28 min-w-[130px] flex-col justify-between border border-black/[0.08] bg-surface p-3 shadow-xs"
            key={node.id}
          >
            <span className="font-mono text-[10px] text-ink-muted">
              {node.id}
            </span>
            <p className="text-xs font-medium text-ink">{node.title}</p>
            <div className={`h-1 rounded ${node.barClass}`} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-black/[0.08] pt-2 font-mono text-[10px] text-ink-muted">
        <span>REBOUND COEFFICIENT: 0.72</span>
        <span className="font-medium text-accent">RUBBERBAND CLAMP</span>
      </div>
    </div>
  );
}
