"use client";

import { useRef } from "react";
import { setField, TINT } from "@/components/field/fieldState";
import { cta, site } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, SplitText, useGSAP } from "@/lib/motion";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

/**
 * 07 · CIERRE — el clímax soberano. «Ynara» ocupa TODO el frame y se enciende
 * letra por letra, mientras la forma alcanza su plenitud luminosa. Al costado,
 * el cierre de venta: qué es, cuándo llega y el CTA.
 */
export function Closing() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const chars = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      const el = word.current;
      if (!el || reducedMotion()) return;
      registerGsap();
      const split = new SplitText(el, { type: "chars", charsClass: "split-char" });
      chars.current = split.chars as HTMLElement[];
      gsap.set(split.chars, { opacity: 0.1 });
      return () => split.revert();
    },
    { scope: root },
  );

  useScrubScene(root, (p) => {
    setField({
      amp: 1.0 + p * 0.18,
      noiseScale: 0.24,
      noiseSpeed: 1.0,
      flat: 0,
      dots: 0,
      band: 1.0 + p * 0.6,
      brightness: 1.05 + p * 0.4,
      tintMix: 0.1,
      tint: TINT.blue,
      camY: 0.8,
      camZ: 5.2,
      lookY: -0.5,
    });
    const cs = chars.current;
    if (!cs.length) return;
    const n = cs.length;
    for (let i = 0; i < n; i++) {
      const t = gsap.utils.clamp(0, 1, (p * 1.25 - (i / n) * 0.5) / 0.5);
      const el = cs[i];
      el.style.opacity = String(0.1 + t * 0.9);
      el.style.textShadow = `0 0 ${t * 110}px rgba(75,126,230,${t * 0.55})`;
    }
  });

  return (
    <Scene
      id="descargar"
      wipe="navy"
      units={2}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="50%"
      scrimY="54%"
      corners={{
        bl: (
          <SceneCopy
            eyebrow={cta.eyebrow}
            statement={cta.statement}
            cta={cta.primary}
            ctaVariant="primary"
          />
        ),
        br: (
          <div className="flex flex-col gap-1.5 text-right">
            {cta.stores.map((s) => (
              <span key={s} className="corner-label tracking-[0.12em]">
                {s}
              </span>
            ))}
          </div>
        ),
      }}
    >
      <div ref={root} className="flex w-full items-center justify-center">
        <h2
          ref={word}
          aria-label={`${site.name} — ${site.signoff}`}
          className="text-sovereign select-none"
        >
          {site.name}
        </h2>
      </div>
    </Scene>
  );
}
