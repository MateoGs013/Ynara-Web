"use client";

import { useRef } from "react";
import { setField, TINT } from "@/components/field/fieldState";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { pricing } from "@/content/ynara";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

const free = pricing.plans.find((p) => !p.featured) ?? pricing.plans[0];
const premium = pricing.plans.find((p) => p.featured) ?? pricing.plans[1];

/**
 * 06 · PRECIO — el precio ES el espectáculo: «Gratis» llena el frame. Al costado,
 * qué incluye gratis y qué suma Premium. Subir = la forma encendiéndose con el
 * scroll (valor, no plástico). Sin cards, sin tabla, sin checkmarks.
 */
export function Pricing() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);

  useScrubScene(root, (p) => {
    setField({
      amp: 0.5 + p * 0.25,
      noiseScale: 0.26,
      noiseSpeed: 0.7 + p * 0.3,
      flat: 0.2 - p * 0.2,
      dots: 0,
      band: 0.6 + p * 0.5,
      brightness: 0.9 + p * 0.35,
      tintMix: 0.0,
      tint: TINT.blue,
      camY: 0.85,
      camZ: 5.0,
      lookY: -0.4,
    });
    if (word.current) {
      word.current.style.textShadow = `0 0 ${30 + p * 90}px rgba(75,126,230,${0.2 + p * 0.4})`;
    }
  });

  return (
    <Scene
      id="precio"
      wipe="ivory"
      units={2}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="50%"
      scrimY="50%"
      corners={{
        bl: <SceneCopy eyebrow={pricing.eyebrow} statement={pricing.statement} />,
        br: (
          <div className="flex max-w-[32ch] flex-col items-end gap-3 text-right">
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-text-bright">
                {free.name} · {free.price}
              </span>
              <span className="text-caption text-text-soft">{free.features.join(" · ")}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-gradient-blue">
                {premium.name} · {premium.price}/{premium.period}
              </span>
              <span className="text-caption text-text-soft">{premium.features.join(" · ")}</span>
            </div>
            <Magnetic strength={0.4}>
              <Button href="#descargar" size="md" className="pointer-events-auto mt-1">
                {premium.cta}
              </Button>
            </Magnetic>
          </div>
        ),
      }}
    >
      <div ref={root} className="flex w-full items-center justify-center">
        <h2 ref={word} className="text-sovereign select-none">
          {pricing.wordmark}
        </h2>
      </div>
    </Scene>
  );
}
