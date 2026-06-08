"use client";

import type { RefObject } from "react";
import { reducedMotion, registerGsap, ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Liga el progreso de scroll de una escena (su <section> alta externa) a un
 * callback continuo — el patrón que hace que el contenido y la FORMA sean el
 * mismo evento. `onUpdate(p)` recibe 0..1 mientras la escena cruza el viewport.
 * En reduced-motion dispara una vez en p=1 (estado final, todo visible).
 */
export function useScrubScene(
  ref: RefObject<HTMLElement | null>,
  onUpdate: (progress: number) => void,
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reducedMotion()) {
        onUpdate(1);
        return;
      }
      registerGsap();
      const section = el.closest("section") ?? el;
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => onUpdate(self.progress),
      });
      // Estado inicial coherente con la posición actual al montar.
      onUpdate(st.progress);
      return () => st.kill();
    },
    { scope: ref },
  );
}
