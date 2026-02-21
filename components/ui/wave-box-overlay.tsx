"use client";

import { useEffect, useRef } from "react";

type WaveBoxOverlayProps = {
  className?: string;
};

export function WaveBoxOverlay({ className = "" }: WaveBoxOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let rafId = 0;
    let tick = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width;
      const height = canvas.height;

      tick += 0.03;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = Math.max(1, 0.9 * dpr);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const influence = pointerRef.current.active ? 1 : 0.28;

      for (let line = 0; line < 4; line++) {
        const baseY = ((line + 1) / 5) * height;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.13 + line * 0.06})`;

        for (let x = 0; x <= width; x += 1) {
          const nx = x / width;
          const distance = Math.abs(nx - px);
          const pull = Math.max(0, 1 - distance * 2.4) * influence;
          const waveA = Math.sin(nx * 12 + tick * (1.2 + line * 0.15)) * (1.2 + line * 0.2) * dpr;
          const waveB = Math.cos(nx * 20 - tick * (0.9 + line * 0.1)) * 0.6 * dpr;
          const magnet = (py - 0.5) * pull * (4 + line * 0.9) * dpr;
          const y = baseY + waveA + waveB + magnet;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        pointerRef.current = { x, y, active: true };
      }}
      onMouseLeave={() => {
        pointerRef.current = { x: 0.5, y: 0.5, active: false };
      }}
      aria-hidden
    />
  );
}
