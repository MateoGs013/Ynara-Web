"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { reducedMotion } from "@/lib/motion";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tw: number;
  tp: number;
};

/**
 * Campo de nodos y puntos de luz — la textura "memoria" de la guía de marca.
 * Nodos a la deriva + hilos entre cercanos (vínculos / continuidad del
 * pensamiento). Optimizado: glow cacheado en sprite, cap de nodos acotado, y
 * el rAF se pausa cuando el canvas sale de viewport (IntersectionObserver).
 * Estático en reduced-motion.
 */
export default function NodeField({
  className,
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = reducedMotion();
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;
    const LINK = 115;

    // Sprite de glow precalculado (evita createRadialGradient por nodo/frame).
    const SS = 64;
    const sprite = document.createElement("canvas");
    sprite.width = SS * dpr;
    sprite.height = SS * dpr;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      sctx.scale(dpr, dpr);
      const g = sctx.createRadialGradient(SS / 2, SS / 2, 0, SS / 2, SS / 2, SS / 2);
      g.addColorStop(0, "rgba(123,161,244,0.5)");
      g.addColorStop(1, "rgba(123,161,244,0)");
      sctx.fillStyle = g;
      sctx.beginPath();
      sctx.arc(SS / 2, SS / 2, SS / 2, 0, Math.PI * 2);
      sctx.fill();
    }

    const spawn = (): Node => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      r: Math.random() * 1.5 + 0.5,
      tw: Math.random() * Math.PI * 2,
      tp: Math.random() * 0.015 + 0.004,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(60, (w * h) / 22000) * density);
      nodes = Array.from({ length: count }, spawn);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const al = (1 - d2 / (LINK * LINK)) * 0.14;
            ctx.strokeStyle = `rgba(139,154,208,${al})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        n.tw += n.tp;
        const tw = (Math.sin(n.tw) + 1) / 2;
        const alpha = 0.22 + tw * 0.5;
        const glowD = n.r * 14;
        ctx.globalAlpha = alpha * 0.9;
        ctx.drawImage(sprite, n.x - glowD / 2, n.y - glowD / 2, glowD, glowD);
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(210,221,250,${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const play = () => {
      if (reduce || raf || document.hidden || !visible) return;
      raf = requestAnimationFrame(step);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (reduce) {
      draw();
    } else {
      play();
    }

    const onResize = () => resize();
    const onVisibility = () => (document.hidden ? pause() : play());
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  );
}
