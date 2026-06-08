"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { type ModeTint, setField, TINT } from "@/components/field/fieldState";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { product } from "@/content/ynara";
import { Draggable, gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

const MODES = product.modes;
const N = MODES.length;

// Firma de forma POR MODO (no sólo tint): cada modo se comporta distinto.
const SIG: Record<
  string,
  {
    amp: number;
    noiseScale: number;
    noiseSpeed: number;
    band: number;
    brightness: number;
    dots: number;
    tint: ModeTint;
  }
> = {
  productividad: {
    amp: 0.95,
    noiseScale: 0.3,
    noiseSpeed: 1.1,
    band: 1.15,
    brightness: 1.05,
    dots: 0,
    tint: TINT.blue,
  },
  estudio: {
    amp: 1.0,
    noiseScale: 0.36,
    noiseSpeed: 1.0,
    band: 1.0,
    brightness: 1.18,
    dots: 0,
    tint: TINT.estudio,
  },
  bienestar: {
    amp: 0.7,
    noiseScale: 0.28,
    noiseSpeed: 0.6,
    band: 0.8,
    brightness: 0.96,
    dots: 0,
    tint: TINT.jade,
  },
  vida: {
    amp: 0.85,
    noiseScale: 0.3,
    noiseSpeed: 0.5,
    band: 0.9,
    brightness: 1.0,
    dots: 0,
    tint: TINT.amber,
  },
  memoria: {
    amp: 0.72,
    noiseScale: 0.3,
    noiseSpeed: 0.7,
    band: 0.6,
    brightness: 1.05,
    dots: 0.35,
    tint: TINT.violet,
  },
};

/**
 * 03 · LOS 5 MODOS — carrusel horizontal ARRASTRABLE (mecánica nueva, no scroll):
 * el scroll lo recorre para quien no arrastra; podés agarrarlo y tirarlo con
 * inercia para explorar. La forma toma una firma propia del modo centrado.
 */
export function Modes() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement[]>([]);
  const vw = useRef(1);
  const dragging = useRef(false);
  const curActive = useRef(-1);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setReduced(reducedMotion()), []);

  const applyVisuals = (p: number) => {
    for (let i = 0; i < panels.current.length; i++) {
      const el = panels.current[i];
      if (!el) continue;
      const d = Math.abs(i - p);
      el.style.opacity = String(gsap.utils.clamp(0, 1, 1 - d * 0.85));
      el.style.transform = `scale(${1 - Math.min(d, 1) * 0.12})`;
    }
    const a = Math.round(gsap.utils.clamp(0, N - 1, p));
    if (a !== curActive.current) {
      curActive.current = a;
      setActive(a);
      const s = SIG[MODES[a].key];
      setField({ ...s, flat: 0, gridScale: 46, tintMix: 0.3, camY: 0.85, camZ: 5.0, lookY: -0.4 });
    }
  };

  // Scroll recorre el filmstrip (para quien no arrastra).
  useScrubScene(root, (prog) => {
    if (dragging.current) return;
    const p = prog * (N - 1);
    if (track.current) gsap.set(track.current, { x: -p * vw.current });
    applyVisuals(p);
  });

  // Drag con inercia (enhancement).
  useGSAP(
    () => {
      if (!track.current || reducedMotion()) return;
      registerGsap();
      vw.current = window.innerWidth;
      const onResize = () => {
        vw.current = window.innerWidth;
      };
      window.addEventListener("resize", onResize);
      const fromX = (x: number) => gsap.utils.clamp(0, N - 1, -x / vw.current);
      const [drag] = Draggable.create(track.current, {
        type: "x",
        inertia: true,
        bounds: { minX: -(N - 1) * vw.current, maxX: 0 },
        snap: { x: (v: number) => Math.round(v / vw.current) * vw.current },
        onPress() {
          dragging.current = true;
        },
        onDrag() {
          applyVisuals(fromX(this.x));
        },
        onThrowUpdate() {
          applyVisuals(fromX(this.x));
        },
        onThrowComplete() {
          dragging.current = false;
        },
        onRelease() {
          if (!this.isThrowing) dragging.current = false;
        },
      });
      return () => {
        window.removeEventListener("resize", onResize);
        drag.kill();
      };
    },
    { scope: root },
  );

  if (reduced) {
    return (
      <Scene units={1.4} sticky align="center" scrim="radial" scrimY="50%">
        <div className="scene-shell">
          <span className="eyebrow eyebrow--center">{product.eyebrow}</span>
          <ul className="mt-10 flex list-none flex-col divide-y divide-[var(--c-hair)]">
            {MODES.map((m, i) => (
              <li
                key={m.key}
                className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="font-display text-2xl font-bold" style={{ color: m.color }}>
                  0{i + 1}
                </span>
                <span className="text-giant leading-none">{m.title}</span>
                <span className="text-body-lg text-text-soft sm:ml-auto">{m.tagline}</span>
              </li>
            ))}
          </ul>
        </div>
      </Scene>
    );
  }

  const cornerInset = { "--sx": "50%", "--sy": "52%" } as CSSProperties;

  return (
    <section className="scene" style={{ minHeight: "290svh" }}>
      {/* Panel wipe de entrada (en el flujo). */}
      <div
        aria-hidden
        className="motion-reduce:hidden flex h-[90svh] w-full items-center justify-center"
        style={{ background: "var(--c-navy)" }}
      >
        <YnaraMark size={40} variant="ivory" className="opacity-80" />
      </div>
      <div
        ref={root}
        className="scrim-radial sticky top-0 h-[100svh] overflow-clip"
        style={cornerInset}
      >
        {/* Filmstrip arrastrable. */}
        <div
          ref={track}
          className="flex h-full cursor-grab active:cursor-grabbing"
          style={{ width: `${N * 100}vw` }}
        >
          {MODES.map((m, i) => (
            <div
              key={m.key}
              ref={(el) => {
                if (el) panels.current[i] = el;
              }}
              className="relative flex h-full w-screen flex-col items-center justify-center"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute select-none font-display font-bold leading-none"
                style={{ fontSize: "min(60vh, 60vw)", color: m.color, opacity: 0.1 }}
              >
                {i + 1}
              </span>
              <h2 className="text-sovereign relative select-none">{m.title}</h2>
              <span className="corner-label corner-label--ivory relative mt-4 normal-case tracking-[0.06em] text-[1rem]">
                {m.tagline}
              </span>
            </div>
          ))}
        </div>

        {/* Esquinas. */}
        <div className="absolute bottom-[clamp(1.5rem,5vh,3rem)] left-[var(--gutter)] z-[3] max-w-[60vw]">
          <SceneCopy eyebrow={product.eyebrow} statement={product.statement} />
        </div>
        <div className="absolute top-[clamp(5rem,12vh,7rem)] right-[var(--gutter)] z-[3] hidden text-right sm:block">
          <span className="font-display text-lg font-semibold text-text-soft">
            0{active + 1} <span className="text-text-faint">/ 0{N}</span>
          </span>
        </div>
        <div className="-translate-x-1/2 absolute bottom-[clamp(1.5rem,5vh,3rem)] left-1/2 z-[3]">
          <span className="corner-label inline-flex animate-pulse items-center gap-3">
            {product.hint}
          </span>
        </div>
      </div>
    </section>
  );
}
