"use client";

import { useRef } from "react";
import { setField, TINT } from "@/components/field/fieldState";
import { name } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, SplitText, useGSAP } from "@/lib/motion";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

/**
 * 01 · EL NOMBRE — «Ynara» se ENSAMBLA letra por letra mientras scrolleás, sobre
 * la onda ya aquietada. Al costado, qué significa ser «una presencia» y la
 * etimología honesta del nombre.
 */
export function TheName() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = word.current;
      if (!el || reducedMotion()) return;
      registerGsap();
      const split = new SplitText(el, { type: "chars", charsClass: "split-char" });
      const t = gsap.timeline({ paused: true });
      t.from(split.chars, {
        yPercent: (i: number) => (i % 2 ? 1 : -1) * 140,
        opacity: 0,
        filter: "blur(10px)",
        ease: "power3.out",
        stagger: 0.06,
        duration: 1,
      });
      tl.current = t;
      return () => split.revert();
    },
    { scope: root },
  );

  useScrubScene(root, (p) => {
    setField({
      amp: 0.6,
      noiseScale: 0.22,
      noiseSpeed: 0.55,
      flat: 0,
      dots: 0,
      band: 0.7,
      brightness: 0.92,
      tintMix: 0,
      tint: TINT.blue,
      camY: 1.0,
      camZ: 5.0,
      lookY: -0.3,
    });
    tl.current?.progress(gsap.utils.clamp(0, 1, p / 0.6));
  });

  return (
    <Scene
      id="el-nombre"
      wipe="navy"
      units={2.2}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="50%"
      scrimY="50%"
      corners={{
        bl: <SceneCopy eyebrow={name.eyebrow} statement={name.statement} />,
        br: (
          <div className="flex max-w-[34ch] flex-col gap-3 text-right">
            {name.etymology.map((e) => (
              <div key={e.part} className="flex flex-col">
                <span className="font-display text-base font-semibold text-gradient-blue">
                  {e.part}
                </span>
                <span className="text-caption text-text-soft">{e.origin}</span>
              </div>
            ))}
            <span className="corner-label tracking-[0.12em]">{name.result}</span>
          </div>
        ),
      }}
    >
      <div ref={root} className="flex w-full items-center justify-center">
        <h2 ref={word} className="text-sovereign select-none">
          {name.wordmark}
        </h2>
      </div>
    </Scene>
  );
}
