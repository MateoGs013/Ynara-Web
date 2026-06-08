"use client";

import { useRef } from "react";
import { setField, TINT } from "@/components/field/fieldState";
import { problem } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

/**
 * 02 · LA INTERSECCIÓN — el diferencial. Tres corrientes (productividad · memoria
 * · bienestar) CONVERGEN y encienden «Una.» donde se tocan, mientras la forma
 * surge a su pico de drama. Al costado, por qué eso importa.
 */
export function Intersection() {
  const root = useRef<HTMLDivElement>(null);
  const una = useRef<HTMLHeadingElement>(null);
  const streams = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!root.current || reducedMotion()) return;
      registerGsap();
      gsap.set(una.current, { opacity: 0, scale: 0.7, filter: "blur(14px)" });
    },
    { scope: root },
  );

  useScrubScene(root, (p) => {
    setField({
      amp: 1.12,
      noiseScale: 0.3,
      noiseSpeed: 1.1,
      flat: 0,
      dots: 0,
      band: 1.35,
      brightness: 1.18,
      tintMix: 0.16,
      tint: TINT.estudio,
      camY: 0.85,
      camZ: 4.4,
      lookY: -0.4,
    });
    const conv = gsap.utils.clamp(0, 1, p / 0.62);
    const el = streams.current;
    if (el) {
      el.style.opacity = String(1 - conv);
      el.style.transform = `translateY(${conv * -8}vh) scale(${1 - conv * 0.15})`;
    }
    if (una.current) {
      const ignite = gsap.utils.clamp(0, 1, (p - 0.4) / 0.4);
      gsap.set(una.current, {
        opacity: ignite,
        scale: 0.7 + ignite * 0.3,
        filter: `blur(${(1 - ignite) * 14}px)`,
      });
    }
  });

  return (
    <Scene
      id="intersection"
      wipe="ivory"
      units={2.4}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="50%"
      scrimY="52%"
      corners={{
        bl: <SceneCopy eyebrow={problem.eyebrow} statement={problem.statement} />,
        br: (
          <div className="flex max-w-[34ch] flex-col gap-2 text-right">
            <span className="corner-label">Lo que hace cada quien</span>
            {problem.competitors.map((c) => (
              <span key={c.name} className="text-caption text-text-soft">
                <span className="text-text-bright">{c.name}</span> {c.does}, pero {c.but}
              </span>
            ))}
          </div>
        ),
      }}
    >
      <div ref={root} className="relative flex h-full w-full items-center justify-center">
        <div
          ref={streams}
          className="-translate-y-[6vh] absolute flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-[var(--gutter)]"
        >
          {problem.layers.map((l) => (
            <span key={l.key} className="text-h2 whitespace-nowrap text-text-soft">
              {l.title}
            </span>
          ))}
        </div>
        <h2
          ref={una}
          className="text-sovereign select-none"
          style={{ textShadow: "0 0 90px rgba(75,126,230,0.4)" }}
        >
          {problem.wordmark}
        </h2>
      </div>
    </Scene>
  );
}
