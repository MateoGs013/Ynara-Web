"use client";

import { useEffect, useRef, useState } from "react";
import { setField, TINT } from "@/components/field/fieldState";
import { feel } from "@/content/ynara";
import { reducedMotion } from "@/lib/motion";
import { Scene } from "./Scene";
import { SceneCopy } from "./SceneCopy";
import { useScrubScene } from "./useScrubScene";

/**
 * 05 · LA VOZ — una conversación que se ESCRIBE SOLA (mecánica temporal, no
 * scroll): el prompt aparece y Ynara responde tipeando, exchange tras exchange,
 * sobre la onda en su estado más sereno. Rompe la repetición del scroll-morfeo.
 */
export function Voice() {
  const root = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => setReduced(reducedMotion()), []);

  useScrubScene(root, () => {
    setField({
      amp: 0.42,
      noiseScale: 0.24,
      noiseSpeed: 0.45,
      flat: 0.34,
      dots: 0,
      band: 0.5,
      brightness: 0.84,
      tintMix: 0.12,
      tint: TINT.blue,
      camY: 0.9,
      camZ: 5.0,
      lookY: -0.35,
    });
  });

  // Máquina de escribir — sólo corre cuando la escena está en viewport.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    let ex = 0;
    let ch = 0;
    let hold = 0;
    const id = window.setInterval(() => {
      if (!inView) return;
      const reply = feel.chats[ex].ynara;
      if (ch < reply.length) {
        ch += 1;
        setIdx(ex);
        setTyped(reply.slice(0, ch));
      } else {
        hold += 1;
        if (hold > 34) {
          hold = 0;
          ch = 0;
          ex = (ex + 1) % feel.chats.length;
          setTyped("");
          setIdx(ex);
        }
      }
    }, 45);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [reduced]);

  const active = feel.chats[idx];

  return (
    <Scene
      id="voice"
      wipe="navy"
      units={2.2}
      sticky
      align="edges"
      bleed
      scrim="radial"
      scrimX="50%"
      scrimY="50%"
      corners={{
        bl: <SceneCopy eyebrow={feel.eyebrow} statement={feel.statement} />,
      }}
    >
      {reduced ? (
        <ul className="scene-shell flex max-w-3xl list-none flex-col gap-12">
          {feel.chats.map((c) => (
            <li key={c.mode} className="flex flex-col gap-3">
              <span className="corner-label">
                {c.mode} · «{c.user}»
              </span>
              <p className="text-h1 text-text-bright">{c.ynara}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div ref={root} className="flex h-full w-full items-center justify-center">
          {/* Conversación completa para lectores de pantalla. */}
          <ul className="sr-only">
            {feel.chats.map((c) => (
              <li key={c.mode}>
                {c.mode}: {c.user} — Ynara: {c.ynara}
              </li>
            ))}
          </ul>
          <div
            aria-hidden
            className="flex max-w-[24ch] flex-col items-center gap-6 px-[var(--gutter)] text-center"
          >
            <span className="corner-label inline-flex items-center gap-3">
              <span className="rule" /> {active.mode} · «{active.user}»
            </span>
            <p className="text-giant text-balance text-text-bright">
              {typed}
              <span
                className="ml-1 inline-block w-[0.06em] animate-pulse self-stretch bg-blue-bright align-middle"
                style={{ height: "0.9em" }}
              >
                &nbsp;
              </span>
            </p>
          </div>
        </div>
      )}
    </Scene>
  );
}
