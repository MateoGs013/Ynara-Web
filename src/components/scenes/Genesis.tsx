"use client";

import { useRef } from "react";
import { BASE_FIELD, setField, TINT } from "@/components/field/fieldState";
import { hero } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, SplitText, useGSAP } from "@/lib/motion";
import { Scene } from "./Scene";
import { useScrubScene } from "./useScrubScene";

const cleanTitle = hero.title.replace(/\*/g, "");

/**
 * 00 · GÉNESIS (hero estilo tiwis) — «Ynara» nace gigante abajo-izquierda y se
 * enciende letra por letra desde la luz. Al scrollear, SUBE y se ENCOGE hasta
 * fusionarse con la marca del nav (que aparece a su encuentro). Al costado, qué
 * es Ynara; el CTA vive en el nav.
 */
export function Genesis() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = word.current;
      if (!el || reducedMotion()) return;
      registerGsap();
      const split = new SplitText(el, { type: "chars", mask: "chars", charsClass: "split-char" });
      gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      const tl = gsap.timeline({ paused: true });
      tl.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        stagger: { each: 0.06, from: "start" },
      });
      const play = () => tl.play();
      if (window.__ynaraIntroDone) play();
      else window.addEventListener("ynara:intro-done", play, { once: true });
      return () => {
        window.removeEventListener("ynara:intro-done", play);
        split.revert();
      };
    },
    { scope: root },
  );

  // Fusión con el nav: la palabra sube, se encoge y se entrega (la marca del nav
  // aparece a su encuentro — ver SiteNav). La forma se aquieta (00 → 01).
  useScrubScene(root, (p) => {
    setField({
      amp: 1.0 - p * 0.25,
      noiseScale: 0.26,
      noiseSpeed: 1.0 - p * 0.3,
      flat: 0,
      dots: 0,
      band: 1.0 - p * 0.2,
      brightness: 1.0,
      tintMix: 0,
      tint: TINT.blue,
      camY: 0.85,
      camZ: 5.0,
      lookY: -0.4,
      rotX: BASE_FIELD.rotX,
    });
    const el = word.current;
    if (!el) return;
    // En reduced-motion la palabra queda quieta y visible (sin fusión).
    const pp = reducedMotion() ? 0 : p;
    const vh = window.innerHeight;
    gsap.set(el, {
      scale: gsap.utils.interpolate(1, 0.09, pp),
      y: -pp * vh * 0.52,
      opacity: 1 - gsap.utils.clamp(0, 1, (pp - 0.66) / 0.22),
      transformOrigin: "left top",
    });
  });

  return (
    <Scene
      id="top-hero"
      units={2.4}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="42%"
      scrimY="62%"
    >
      <div ref={root} className="relative h-full w-full">
        {/* Value-prop legible arriba-derecha (alma tiwis). */}
        <div className="absolute top-[clamp(5.5rem,16vh,10rem)] right-[var(--gutter)] left-[var(--gutter)] z-[3] flex flex-col items-start gap-3 text-left sm:left-auto sm:max-w-[34ch] sm:items-end sm:text-right">
          <span className="corner-label">{hero.eyebrow}</span>
          <p className="text-lead scrim-text">{hero.statement}</p>
        </div>

        {/* Cue de scroll abajo-derecha. */}
        <div className="absolute right-[var(--gutter)] bottom-[clamp(1.5rem,5vh,3rem)] z-[3] hidden sm:block">
          <span className="corner-label inline-flex items-center gap-3">
            Scroll <span className="rule" />
          </span>
        </div>

        {/* El wordmark — gigante abajo-izquierda, se funde con el nav al scrollear. */}
        <h1
          ref={word}
          aria-label={cleanTitle}
          className="text-sovereign absolute bottom-[clamp(2rem,9vh,6rem)] left-[var(--gutter)] z-[1] select-none"
          style={{ transformOrigin: "left top", textShadow: "0 0 90px rgba(75,126,230,0.32)" }}
        >
          {hero.wordmark}
        </h1>
      </div>
    </Scene>
  );
}
