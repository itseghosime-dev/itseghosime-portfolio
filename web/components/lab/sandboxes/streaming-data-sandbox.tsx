"use client";

import { useEffect, useRef, useState } from "react";

export function StreamingDataCanvasSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [complexHarmonics, setComplexHarmonics] = useState(false);
  const isComplexRef = useRef(false);

  useEffect(() => {
    isComplexRef.current = complexHarmonics;
  }, [complexHarmonics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    function render() {
      if (!canvas || !canvas.parentElement || !ctx) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Background graph grid
      ctx.strokeStyle = "rgba(180, 170, 200, 0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // Primary sine wave plot
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4338ca";

      for (let x = 0; x < width; x++) {
        const freq = 0.025;
        let y = Math.sin(x * freq + step) * 28;
        if (isComplexRef.current) {
          y += Math.cos(x * 0.06 - step * 1.5) * 14;
        }
        const plotY = height / 2 + y;
        if (x === 0) ctx.moveTo(x, plotY);
        else ctx.lineTo(x, plotY);
      }
      ctx.stroke();

      step += 0.04;
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative flex h-64 flex-col justify-between overflow-hidden border border-[#ded9e8] bg-[#f2f0f7] p-4 transition-colors">
      <div className="flex items-center justify-between font-mono text-[11px] text-[#5c546b]">
        <span className="flex items-center gap-1.5">
          <span className="size-2 animate-pulse rounded-full bg-indigo-500" />
          BUFFER STREAM 120 FPS
        </span>
        <button
          className="cursor-pointer border border-[#cdc5dc] bg-white/80 px-2 py-0.5 font-mono text-[10px] text-ink transition-colors hover:bg-white"
          onClick={() => setComplexHarmonics((prev) => !prev)}
          type="button"
        >
          {complexHarmonics ? "Harmonics: ON" : "Toggle Harmonics"}
        </button>
      </div>

      <div className="relative my-auto h-36 w-full">
        <canvas className="block size-full" ref={canvasRef} />
      </div>

      <div className="flex items-center justify-between border-t border-[#ded9e8] pt-2 font-mono text-[10px] text-[#6c647b]">
        <span>TICKS RENDERED: 1,420</span>
        <span className="font-semibold text-indigo-700">LATENCY: 1.2ms</span>
      </div>
    </div>
  );
}
