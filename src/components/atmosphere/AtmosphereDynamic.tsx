"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

/**
 * Atmósfera ADAPTATIVA — el fondo viaja por la paleta de marca según el scroll.
 * "Adaptación" hecha fondo: el sitio cambia de mood como Ynara cambia de modo.
 * Estático (mood inicial) en reduced-motion.
 */
const STOPS: { c: string; x: number; y: number }[] = [
  { c: "rgba(47,90,166,0.22)", x: 50, y: -4 }, // hero — azul
  { c: "rgba(91,111,179,0.16)", x: 22, y: 14 }, // nombre — periwinkle
  { c: "rgba(124,79,163,0.20)", x: 80, y: 18 }, // intersección — violeta
  { c: "rgba(75,126,230,0.18)", x: 42, y: 30 }, // statement — azul claro
  { c: "rgba(74,156,140,0.18)", x: 74, y: 24 }, // modos — jade
  { c: "rgba(124,79,163,0.20)", x: 26, y: 38 }, // memoria — violeta
  { c: "rgba(217,162,74,0.13)", x: 72, y: 30 }, // voz — ámbar
  { c: "rgba(47,90,166,0.20)", x: 44, y: 22 }, // precio — azul
  { c: "rgba(75,126,230,0.26)", x: 50, y: 34 }, // cta — azul brillante
];

export function AtmosphereDynamic() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (p: number) => {
      const seg = p * (STOPS.length - 1);
      const i = Math.min(STOPS.length - 2, Math.max(0, Math.floor(seg)));
      const f = seg - i;
      const c = gsap.utils.interpolate(STOPS[i].c, STOPS[i + 1].c, f);
      const x = gsap.utils.interpolate(STOPS[i].x, STOPS[i + 1].x, f) as number;
      const y = gsap.utils.interpolate(STOPS[i].y, STOPS[i + 1].y, f) as number;
      el.style.background = [
        `radial-gradient(58% 50% at ${x}% ${y}%, ${c}, transparent 72%)`,
        `radial-gradient(42% 42% at ${100 - x}% ${y + 42}%, rgba(124,79,163,0.06), transparent 76%)`,
        "linear-gradient(180deg, #0a0c12 0%, #0c0f18 45%, #0a0c12 100%)",
      ].join(",");
    };

    apply(0);
    if (reducedMotion()) return;
    registerGsap();
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => apply(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="grain pointer-events-none fixed inset-0 -z-10" />
  );
}
