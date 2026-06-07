"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { reducedMotion } from "@/lib/motion";

type P = { x: number; y: number; c: string; life: number; age: number; sp: number; r: number };

/**
 * Campo de flujo — partículas luminosas que siguen corrientes de un campo de
 * flujo y dejan estelas de luz. La "continuidad del pensamiento" hecha materia
 * generativa. Inmersivo, vivo, reactivo al cursor. Estático en reduced-motion.
 */
export default function FlowField({
  className,
  density = 1,
  speed = 1,
}: {
  className?: string;
  density?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = reducedMotion();
    const COLORS = ["rgba(123,161,244,", "rgba(160,176,232,", "rgba(150,110,196,"];
    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let raf = 0;
    let visible = true;
    let t = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const flow = (x: number, y: number, tt: number) =>
      Math.sin(x * 0.0016 + tt * 0.00025) * Math.PI +
      Math.cos(y * 0.0018 - tt * 0.0003) * Math.PI +
      Math.sin((x + y) * 0.0011 + tt * 0.00018) * Math.PI * 0.6;

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random() * 220 + 120,
      age: Math.random() * 260,
      sp: (Math.random() * 0.6 + 0.55) * speed,
      r: Math.random() * 1.3 + 0.5,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(640, (w * h) / 2900) * density);
      particles = Array.from({ length: count }, spawn);
      ctx.fillStyle = "#0a0c12";
      ctx.fillRect(0, 0, w, h);
    };

    const draw = () => {
      t += 16;
      // Estela: desvanecer el frame anterior (source-over).
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10,12,18,0.055)";
      ctx.fillRect(0, 0, w, h);
      // Partículas con blending aditivo → corrientes de luz luminosas.
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        let a = flow(p.x, p.y, t);
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 40000) a += Math.atan2(dy, dx) * (1 - d2 / 40000) * 1.8;
        }
        p.x += Math.cos(a) * p.sp * 1.8;
        p.y += Math.sin(a) * p.sp * 1.8;
        p.age++;
        if (p.age > p.life || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          Object.assign(p, spawn(), { age: 0 });
        }
        const fade = 1 - Math.abs(p.age / p.life - 0.5) * 2;
        ctx.fillStyle = `${p.c}${(fade * 0.7).toFixed(3)})`;
        const s = p.r * 1.5;
        ctx.fillRect(p.x, p.y, s, s);
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    const drawStatic = () => {
      ctx.fillStyle = "#0a0c12";
      ctx.fillRect(0, 0, w, h);
      for (const p of particles) {
        ctx.fillStyle = `${p.c}0.4)`;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      }
    };

    const play = () => {
      if (reduce || raf || document.hidden || !visible) return;
      raf = requestAnimationFrame(draw);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (reduce) drawStatic();
    else play();

    const onResize = () => resize();
    const onVis = () => (document.hidden ? pause() : play());
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x > -100 && pointer.x < w + 100;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { rootMargin: "150px" },
    );
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) window.addEventListener("pointermove", onMove);

    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  );
}
