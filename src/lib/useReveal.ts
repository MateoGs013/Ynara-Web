"use client";

import type { RefObject } from "react";
import { EASE, gsap, reducedMotion, registerGsap, useGSAP } from "./motion";

/**
 * Reveal compartido — el contrato de motion de TODA sección.
 *
 * Uso: en una sección "use client", `const ref = useRef(null); useReveal(ref)`.
 * Marcá los elementos a revelar con `data-reveal`. Opcionales por elemento:
 *   - data-reveal="up" | "fade" | "clip"   (default "up")
 *   - data-delay="0.1"                       (segundos)
 *
 * Hermanos directos con `data-reveal` que comparten un mismo contenedor
 * `[data-reveal-group]` se animan en cascada (stagger) — el workhorse.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const all = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      if (all.length === 0) return;

      if (reducedMotion()) {
        gsap.set(all, { opacity: 1, y: 0, clipPath: "none", clearProps: "all" });
        return;
      }

      // Agrupar por contenedor [data-reveal-group] para stagger en cascada.
      const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]", root);
      const grouped = new Set<HTMLElement>();

      for (const group of groups) {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", group);
        items.forEach((el) => grouped.add(el));
        if (items.length === 0) continue;
        gsap.from(items, {
          ...fromVars(items[0]),
          duration: 0.9,
          ease: EASE,
          stagger: 0.07,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      }

      // Elementos sueltos (no agrupados) → trigger individual.
      for (const el of all) {
        if (grouped.has(el)) continue;
        gsap.from(el, {
          ...fromVars(el),
          duration: 0.95,
          ease: EASE,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      }
    },
    { scope },
  );
}

function fromVars(el: HTMLElement) {
  const variant = el.dataset.reveal || "up";
  if (variant === "fade") return { opacity: 0 };
  if (variant === "clip")
    return { opacity: 0, clipPath: "inset(0 0 100% 0)", y: 0 };
  return { opacity: 0, y: 30 };
}
