"use client";

import { useRef } from "react";
import { memory } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { lineReveal } from "@/lib/reveal";

/**
 * Capítulo Privacidad — el beat de confianza. MUNDO CLARO (ivory). Layout
 * distintivo: statement grande arriba + un LEDGER NUMERADO (01/02/03) que se
 * dibuja fila por fila (números masivos + reglas que crecen). No es una grilla.
 */
export function Trust() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;
      registerGsap();

      const eyebrow = root.querySelector<HTMLElement>(".tr-eyebrow");
      const statement = root.querySelector<HTMLElement>(".tr-statement");
      const support = root.querySelector<HTMLElement>(".tr-support");
      const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".tr-row"));
      const chips = root.querySelector<HTMLElement>(".tr-chips");

      if (eyebrow) {
        gsap.set(eyebrow, { opacity: 0, y: 14 });
        gsap.to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "clamp(top 78%)" },
        });
      }
      if (statement) lineReveal(statement, { y: "150%", rot: 2.5, dur: 1.2, stagger: 0.14 });
      if (support) lineReveal(support, { y: "140%", rot: 2, dur: 1, stagger: 0.08, start: "clamp(top 74%)" });

      for (const row of rows) {
        const line = row.querySelector<HTMLElement>(".tr-row-line");
        if (line) {
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          gsap.to(line, {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: row, start: "clamp(top 88%)" },
          });
        }
        const bits = row.querySelectorAll<HTMLElement>(".tr-num, .tr-row-title, .tr-row-body");
        gsap.set(bits, { opacity: 0, y: 22 });
        gsap.to(bits, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: row, start: "clamp(top 86%)" },
        });
      }

      if (chips) {
        gsap.set(chips, { opacity: 0, y: 14 });
        gsap.to(chips, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: chips, start: "clamp(top 90%)" },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="privacidad" className="tr relative" aria-label="Privacidad" data-wipe-tone="ivory">
      <div className="tr-inner">
        <div className="tr-head">
          <p className="tr-eyebrow">{memory.eyebrow}</p>
          <h2 className="tr-statement">{memory.statement}</h2>
          <p className="tr-support">{memory.support}</p>
        </div>

        <div className="tr-ledger">
          {memory.layers.map((l, i) => (
            <div className="tr-row" key={l.title}>
              <span className="tr-row-line" aria-hidden />
              <span className="tr-num">{`0${i + 1}`}</span>
              <h3 className="tr-row-title">{l.title}</h3>
              <p className="tr-row-body">{l.body}</p>
            </div>
          ))}
        </div>

        <p className="tr-chips">{memory.privacy.join("  ·  ")}</p>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático local */}
      <style dangerouslySetInnerHTML={{ __html: TR_CSS }} />
    </section>
  );
}

const TR_CSS = `
  .tr {
    position: relative;
    z-index: 3;
    background: var(--c-ivory);
    color: var(--c-navy);
    padding: clamp(6svh, 9svh, 11svh) 0 clamp(8svh, 12svh, 14svh);
  }
  .tr-inner {
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
    padding: 0 6vw;
  }
  .tr-head { max-width: 60ch; }
  .tr-eyebrow {
    margin: 0 0 1.5rem;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.62rem, 0.72vw, 0.76rem);
    font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase;
    color: var(--c-navy); opacity: 0.55;
  }
  .tr-statement {
    margin: 0;
    max-width: 16ch;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(2.6rem, 5.4vw, 5.6rem);
    line-height: 0.98;
    letter-spacing: -0.04em;
    color: var(--c-navy-deep);
  }
  .tr-support {
    margin: clamp(1.4rem, 2.4vw, 2.2rem) 0 0;
    max-width: 52ch;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.98rem, 1.15vw, 1.2rem);
    line-height: 1.6; color: var(--c-navy); opacity: 0.74;
  }

  /* LEDGER numerado — filas full-width que se dibujan */
  .tr-ledger { margin-top: clamp(3rem, 6vw, 6rem); }
  .tr-row {
    position: relative;
    display: grid;
    grid-template-columns: clamp(3.5rem, 8vw, 8rem) minmax(8rem, 16ch) 1fr;
    align-items: baseline;
    gap: clamp(1rem, 3vw, 3rem);
    padding: clamp(1.4rem, 2.4vw, 2.2rem) 0;
  }
  .tr-row-line {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: rgba(36, 44, 63, 0.22);
  }
  .tr-num {
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 500;
    font-size: clamp(1.6rem, 3.2vw, 3.4rem);
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--c-blue);
  }
  .tr-row-title {
    margin: 0;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(1.2rem, 1.8vw, 1.7rem);
    letter-spacing: -0.02em;
    color: var(--c-navy-deep);
  }
  .tr-row-body {
    margin: 0;
    max-width: 44ch;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.95rem, 1.05vw, 1.1rem);
    line-height: 1.55; color: var(--c-navy); opacity: 0.72;
  }
  .tr-chips {
    margin: clamp(2.6rem, 4vw, 3.5rem) 0 0;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.62rem, 0.72vw, 0.76rem);
    font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--c-blue); opacity: 0.9;
  }
  @media (max-width: 767px) {
    .tr-statement { font-size: clamp(2.4rem, 10vw, 3.2rem); max-width: 100%; }
    .tr-row {
      grid-template-columns: clamp(2.6rem, 14vw, 4rem) 1fr;
      gap: 1rem 1.4rem;
    }
    .tr-row-body { grid-column: 1 / -1; max-width: 100%; }
  }
`;
