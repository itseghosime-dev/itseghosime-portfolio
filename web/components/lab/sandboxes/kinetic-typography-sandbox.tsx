"use client";

import { useRef, useState } from "react";

const LETTERS = [
  "C",
  "U",
  "R",
  "I",
  "O",
  "U",
  "S",
  " ",
  "M",
  "I",
  "N",
  "D",
  "S",
];

export function KineticTypographySandbox() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [weightLabel, setWeightLabel] = useState("WEIGHT: 400 · SLANT: 0°");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!arenaRef.current) return;
    const cursorX = e.clientX;

    let avgWeight = 400;

    charRefs.current.forEach((char) => {
      if (!char) return;
      const charRect = char.getBoundingClientRect();
      const charCenter = charRect.left + charRect.width / 2;
      const dist = Math.abs(cursorX - charCenter);

      const influence = Math.max(0, 1 - dist / 180);
      const weight = Math.round(300 + influence * 500);
      const slant = Math.round((cursorX - charCenter) * 0.08);

      char.style.fontWeight = String(weight);
      char.style.transform = `skewX(${-slant}deg) scale(${1 + influence * 0.15})`;

      avgWeight = weight;
    });

    setWeightLabel(`WEIGHT: ${avgWeight} · PROXIMITY ACTIVE`);
  }

  function handleMouseLeave() {
    charRefs.current.forEach((char) => {
      if (!char) return;
      char.style.fontWeight = "400";
      char.style.transform = "none";
    });
    setWeightLabel("WEIGHT: 400 · SLANT: 0°");
  }

  return (
    <div
      className="relative flex h-64 cursor-ew-resize select-none flex-col justify-between overflow-hidden border border-[#d2e0f0] bg-[#ebf2fa] p-6 transition-colors"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={arenaRef}
    >
      <div className="flex items-center justify-between font-mono text-[11px] text-[#4b6584]">
        <span>SCRUB HORIZONTALLY OVER LETTERS</span>
        <span>{weightLabel}</span>
      </div>

      <div className="my-auto overflow-hidden py-2 text-center">
        <div className="flex justify-center gap-1 text-2xl tracking-tight text-[#141415] whitespace-nowrap transition-all duration-75 sm:text-3xl md:gap-2 md:text-4xl">
          {LETTERS.map((char, index) =>
            char === " " ? (
              <span className="mx-1 inline-block" key={`space-${index}`}>
                {" "}
              </span>
            ) : (
              <span
                className="inline-block transition-transform duration-75"
                key={`${char}-${index}`}
                ref={(el) => {
                  charRefs.current[index] = el;
                }}
              >
                {char}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#d8e4f2] pt-2 font-mono text-[10px] text-[#577292]">
        <span>PROXIMITY RADIAL FALLOFF</span>
        <span className="font-medium text-accent">OPTICAL AXIS ACTIVE</span>
      </div>
    </div>
  );
}
