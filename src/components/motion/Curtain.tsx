"use client";

import { useRef } from "react";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";

/**
 * Cortina de transición: un panel teñido cubre la sección y se levanta con el
 * scroll al entrar, revelando el contenido. Da continuidad de "capítulos".
 * El <section> contenedor debe ser `relative overflow-hidden`.
 */
export function Curtain({ tint = "rgba(47,90,166,0.45)" }: { tint?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reducedMotion()) {
        el.style.display = "none";
        return;
      }
      registerGsap();
      gsap.to(el, {
        yPercent: -100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top 92%",
          end: "top 30%",
          scrub: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30"
      style={{ background: `linear-gradient(180deg, ${tint} 0%, var(--c-void) 75%)` }}
    />
  );
}
