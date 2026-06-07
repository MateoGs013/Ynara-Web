"use client";

import { useEffect, useRef } from "react";
import { reducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

/**
 * El hilo de la memoria — una línea que recorre la página y se llena con el
 * scroll, con un cometa de luz en la posición actual. "Continuidad del
 * pensamiento" hecha literal. Desktop only.
 */
export function MemoryThread() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      el.style.setProperty("--p", "1");
      return;
    }
    registerGsap();
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => el.style.setProperty("--p", String(self.progress)),
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-7 top-0 z-40 hidden h-screen w-px lg:block"
      style={{ ["--p" as string]: "0" }}
    >
      {/* Track */}
      <div className="absolute inset-0 bg-white/[0.07]" />
      {/* Fill */}
      <div
        className="absolute left-0 top-0 h-full w-full origin-top"
        style={{
          transform: "scaleY(var(--p))",
          background:
            "linear-gradient(to bottom, var(--c-blue-bright), var(--c-blue))",
        }}
      />
      {/* Cometa */}
      <div
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: "calc(var(--p) * 100%)",
          background: "var(--c-blue-bright)",
          boxShadow: "0 0 14px 2px rgba(75,126,230,0.8)",
        }}
      />
    </div>
  );
}
