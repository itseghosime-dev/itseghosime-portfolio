"use client";

import { useRef, useState } from "react";

export function SpatialDepthSandbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerForeRef = useRef<HTMLDivElement>(null);

  const [pitch, setPitch] = useState({ x: 0, y: 0 });
  const [isWireframe, setIsWireframe] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const tiltX = -y * 28;
    const tiltY = x * 28;

    setPitch({ x: tiltX, y: tiltY });

    if (layerBackRef.current) {
      layerBackRef.current.style.transform = `translateZ(-60px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg)`;
    }
    if (layerMidRef.current) {
      layerMidRef.current.style.transform = `translateZ(0px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    if (layerForeRef.current) {
      layerForeRef.current.style.transform = `translateZ(50px) rotateX(${tiltX * 1.4}deg) rotateY(${tiltY * 1.4}deg) translate(${x * 20}px, ${y * 20}px)`;
    }
  }

  function handleMouseLeave() {
    setPitch({ x: 0, y: 0 });
    if (layerBackRef.current) {
      layerBackRef.current.style.transform =
        "translateZ(-60px) rotateX(0deg) rotateY(0deg)";
    }
    if (layerMidRef.current) {
      layerMidRef.current.style.transform =
        "translateZ(0px) rotateX(0deg) rotateY(0deg)";
    }
    if (layerForeRef.current) {
      layerForeRef.current.style.transform =
        "translateZ(50px) rotateX(0deg) rotateY(0deg)";
    }
  }

  function handleReset() {
    handleMouseLeave();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Depth Viewport */}
      <div
        className="relative flex min-h-[350px] cursor-grab select-none flex-col justify-between overflow-hidden border border-black/20 bg-[#121316] p-6 shadow-sm active:cursor-grabbing md:min-h-[420px]"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        ref={containerRef}
        style={{ perspective: "1000px" }}
      >
        {/* Dot grid ambient overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#4169e1 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Realtime coordinates HUD */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />
            <span>
              PITCH_X: {pitch.x >= 0 ? "+" : ""}
              {pitch.x.toFixed(1)}° | ROLL_Y: {pitch.y >= 0 ? "+" : ""}
              {pitch.y.toFixed(1)}°
            </span>
          </span>
          <span className="hidden text-neutral-500 sm:inline">
            Move cursor to tilt
          </span>
        </div>

        {/* 3D Floating Layers */}
        <div
          className="relative my-6 flex h-48 w-full items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Background Plane */}
          <div
            className="absolute flex h-36 w-56 items-center justify-center border border-neutral-700/60 bg-neutral-900/40 font-mono text-xs text-neutral-500 backdrop-blur-sm transition-transform duration-75"
            ref={layerBackRef}
            style={{ transform: "translateZ(-60px)" }}
          >
            [ Frustum Plane -60px ]
          </div>

          {/* Core Mid Node */}
          <div
            className={`absolute flex h-48 w-64 flex-col justify-between p-4 shadow-2xl backdrop-blur-md transition-all duration-75 ${
              isWireframe
                ? "border border-dashed border-accent bg-transparent"
                : "border border-neutral-500/80 bg-neutral-800/60"
            }`}
            ref={layerMidRef}
            style={{ transform: "translateZ(0px)" }}
          >
            <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
              <span className="font-mono text-[10px] text-neutral-300">
                SPATIAL_ANCHOR_01
              </span>
              <span className="size-1.5 rounded-full bg-accent" />
            </div>
            <div className="space-y-1.5 py-2">
              <div className="h-1.5 w-4/5 rounded bg-neutral-700" />
              <div className="h-1.5 w-3/5 rounded bg-neutral-700" />
              <div className="h-1.5 w-1/2 rounded bg-accent/80" />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-neutral-400">
              <span>SPRING_INERTIA: 0.88</span>
              <span className="font-bold text-accent">LIVE</span>
            </div>
          </div>

          {/* Foreground Shard */}
          <div
            className="absolute -right-2 -bottom-2 flex h-24 w-32 flex-col justify-between border border-accent/70 bg-accent/15 p-3 shadow-lg backdrop-blur-lg transition-transform duration-75"
            ref={layerForeRef}
            style={{ transform: "translateZ(50px)" }}
          >
            <span className="font-mono text-[9px] text-[#b6c4ff]">
              OVERLAY_FLOAT
            </span>
            <div className="font-mono text-[11px] text-neutral-200">
              dz: +50px
            </div>
          </div>
        </div>

        {/* Lower HUD status */}
        <div className="relative z-10 flex items-center justify-between border-t border-neutral-800/80 pt-2 font-mono text-[10px] text-neutral-500">
          <span>VELOCITY_SMOOTH: 0.94</span>
          <span>FRUSTUM_FOV: 45°</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <span className="text-ink-muted">Mode:</span>
        <button
          className="cursor-pointer border border-black/15 bg-surface px-3 py-1 font-mono text-[0.6875rem] text-ink transition-colors hover:border-black hover:bg-black hover:text-white"
          onClick={() => setIsWireframe((prev) => !prev)}
          type="button"
        >
          {isWireframe ? "Wireframe (Active)" : "Solid / Wireframe"}
        </button>
        <button
          className="cursor-pointer border border-black/15 bg-surface px-3 py-1 font-mono text-[0.6875rem] text-ink transition-colors hover:border-black hover:bg-black hover:text-white"
          onClick={handleReset}
          type="button"
        >
          Center Pitch
        </button>
      </div>
    </div>
  );
}
