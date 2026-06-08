"use client";

import { type ElementType, useRef } from "react";
import { cn } from "@/lib/cn";
import { EASE_EXPO, gsap, reducedMotion, registerGsap, SplitText, useGSAP } from "@/lib/motion";

type Play = "scroll" | "intro" | "mount";
type Kind = "chars" | "words" | "lines";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Granularidad del reveal. */
  kind?: Kind;
  play?: Play;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
};

/**
 * Tipografía masiva que se revela enmascarada (alma tiwis): chars/palabras/líneas
 * suben detrás de una máscara sincronizadas al scroll o al telón. SplitText con
 * `mask` (GSAP 3.13+). Respeta reduced-motion (texto ya visible, sin split).
 */
export function SplitReveal({
  text,
  as: Tag = "h2",
  className,
  kind = "lines",
  play = "scroll",
  stagger = 0.06,
  duration = 0.95,
  delay = 0,
  start = "top 82%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || reducedMotion()) return;

      const split = new SplitText(el, {
        type: kind,
        mask: kind,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
      });
      const targets = kind === "chars" ? split.chars : kind === "words" ? split.words : split.lines;

      gsap.set(targets, { yPercent: 118, opacity: 0 });
      const vars: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: EASE_EXPO,
        stagger,
        delay,
      };

      let cleanup = () => split.revert();

      if (play === "scroll") {
        gsap.to(targets, { ...vars, scrollTrigger: { trigger: el, start, once: true } });
      } else {
        const tween = gsap.to(targets, { ...vars, paused: true });
        if (play === "mount" || window.__ynaraIntroDone) {
          tween.play();
        } else {
          const go = () => tween.play();
          window.addEventListener("ynara:intro-done", go, { once: true });
          const prev = cleanup;
          cleanup = () => {
            prev();
            window.removeEventListener("ynara:intro-done", go);
          };
        }
      }

      return cleanup;
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {text}
    </Tag>
  );
}
