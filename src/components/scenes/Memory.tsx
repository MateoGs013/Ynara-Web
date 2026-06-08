"use client";

import { useRef } from "react";
import { setField, TINT } from "@/components/field/fieldState";
import { memory } from "@/content/ynara";
import { gsap, reducedMotion, useGSAP } from "@/lib/motion";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

const NODE_POS = [
  "left-[6vw] top-[26%]",
  "right-[6vw] top-[38%] text-right items-end",
  "bottom-[18vh] left-1/2 -translate-x-1/2 text-center items-center",
];

/**
 * 04 · MEMORIA — la onda CRISTALIZA en constelación de puntos (la escena conduce
 * el morfeo wave→dots con el scroll + un dive de cámara), mientras «Memoria» llena
 * el frame y las tres capas aparecen como nodos de luz. Al costado, la promesa de
 * privacidad: es tuyo, on-prem.
 */
export function Memory() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const nodes = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (!root.current || reducedMotion()) return;
      for (const n of nodes.current) {
        if (n) gsap.set(n, { opacity: 0 });
      }
    },
    { scope: root },
  );

  useScrubScene(root, (p) => {
    const cr = gsap.utils.clamp(0, 1, p / 0.4);
    setField({
      amp: 0.72,
      noiseScale: 0.3,
      noiseSpeed: 0.7,
      flat: 0.16,
      dots: cr,
      gridScale: 46,
      dotRadius: 0.3,
      band: 0.45,
      brightness: 1.0 + cr * 0.12,
      tintMix: 0.32 * cr,
      tint: TINT.violet,
      camY: 0.9,
      camZ: 4.8 - cr * 0.9,
      lookY: -0.4,
    });
    if (word.current) {
      word.current.style.textShadow = `0 0 ${40 + cr * 80}px rgba(140,99,184,${0.25 + cr * 0.35})`;
    }
    nodes.current.forEach((el, i) => {
      if (el) el.style.opacity = String(gsap.utils.clamp(0, 1, (p - 0.18 - i * 0.08) / 0.3));
    });
  });

  return (
    <Scene
      id="memoria"
      wipe="void"
      units={2.2}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="50%"
      scrimY="50%"
      corners={{
        bl: <SceneCopy eyebrow={memory.eyebrow} statement={memory.statement} />,
        br: (
          <div className="flex flex-col gap-1.5 text-right">
            {memory.privacy.map((s) => (
              <span key={s} className="corner-label tracking-[0.12em]">
                {s}
              </span>
            ))}
          </div>
        ),
      }}
    >
      <div ref={root} className="relative flex h-full w-full items-center justify-center">
        <h2 ref={word} className="text-sovereign select-none">
          {memory.wordmark}
        </h2>

        {memory.layers.map((l, i) => (
          <div
            key={l.title}
            ref={(el) => {
              if (el) nodes.current[i] = el;
            }}
            className={`pointer-events-none absolute flex max-w-[15rem] flex-col gap-1.5 ${NODE_POS[i]}`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-bright shadow-[0_0_18px_4px_rgba(75,126,230,0.6)]" />
            <span className="font-display text-lg font-semibold text-text-bright">{l.title}</span>
            <span className="text-caption text-text-soft">{l.body}</span>
          </div>
        ))}
      </div>
    </Scene>
  );
}
