"use client";

import { useRef } from "react";
import { problem } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";

/**
 * Capítulo Problema — la animación ES el mensaje (casi sin texto). Escenario
 * sticky sobre la seda; al scrollear, las OCHO apps dispersas en una fila
 * COLAPSAN hacia el centro y se funden en UNA — Ynara. El 8 → 1 se ve.
 * Scrub sin pin (sticky + ScrollTrigger.scrub) → no toca la coordinación del
 * pin horizontal vecino. Reduced-motion: versión estática legible (CSS).
 *
 * Centrado de la respuesta = flexbox (NO transform xPercent → no se descentra),
 * y oculta por CSS por defecto (sin flash; reduced-motion la muestra en flujo).
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return; // CSS deja la versión estática
      registerGsap();

      const track = root.querySelector<HTMLElement>(".pb-track");
      const headline = root.querySelector<HTMLElement>(".pb-headline");
      const answer = root.querySelector<HTMLElement>(".pb-answer");

      // estados iniciales EXPLÍCITOS (la respuesta arranca oculta; las apps, plenas)
      gsap.set(headline, { opacity: 1, y: 0 });
      gsap.set(track, { scaleX: 1, opacity: 1 });
      gsap.set(answer, { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        defaults: { ease: "none" },
      });

      // las 8 colapsan al centro (scaleX→0) y se desvanecen; el titular se va…
      tl.to(headline, { opacity: 0, y: -28, duration: 0.32 }, 0.14)
        .to(track, { scaleX: 0.03, opacity: 0, ease: "power2.in", duration: 0.4 }, 0.18)
        // …y en su lugar emerge "Ynara es una." (centrada por flexbox)
        .to(answer, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.4 }, 0.52)
        .to({}, { duration: 0.1 });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="pb relative" aria-label={problem.eyebrow}>
      <div className="pb-stage">
        <p className="pb-eyebrow u-tag">{problem.eyebrow}</p>
        <div className="pb-morph">
          <div className="pb-before">
            <h2 className="pb-headline">{problem.problemLine}</h2>
            <ul className="pb-track">
              {problem.apps.map((a) => (
                <li className="pb-chip" key={a}>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <h2 className="pb-answer" aria-hidden>
            <span className="pb-answer-text">
              Ynara es <em className="pb-em">una.</em>
            </span>
          </h2>
        </div>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático local */}
      <style dangerouslySetInnerHTML={{ __html: PB_CSS }} />
    </section>
  );
}

const PB_CSS = `
  .pb { height: 175svh; }
  .pb-stage {
    position: sticky;
    top: 0;
    height: 100svh;
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
    padding: 0 6vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  .pb-eyebrow { color: var(--c-acc); position: absolute; top: 14svh; left: 6vw; }
  .pb-morph { position: relative; }

  .pb-before { display: flex; flex-direction: column; align-items: center; gap: clamp(2rem, 4vw, 3.5rem); }
  .pb-headline {
    margin: 0;
    text-align: center;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(2.2rem, 5vw, 5rem);
    line-height: 0.98;
    letter-spacing: -0.04em;
    color: var(--c-text-bright);
  }
  /* las OCHO apps en una FILA horizontal */
  .pb-track {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.7rem;
    transform-origin: center center;
    max-width: 1000px;
  }
  .pb-chip {
    padding: 0.6rem 1.15rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(8px);
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.85rem, 1vw, 1.05rem);
    font-weight: 500;
    color: var(--c-ivory);
    white-space: nowrap;
  }

  /* la respuesta — capa centrada por FLEXBOX sobre el mismo punto; oculta por
     defecto (la revela el scrub). transform-origin center → escala sin descentrar. */
  .pb-answer {
    position: absolute;
    inset: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    transform-origin: center center;
  }
  .pb-answer-text {
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(2.8rem, 7vw, 7.5rem);
    line-height: 0.96;
    letter-spacing: -0.045em;
    color: var(--c-text-bright);
  }
  .pb-em { font-style: normal; color: var(--c-blue-bright); }

  @media (max-width: 767px) {
    .pb-headline { font-size: clamp(2rem, 9vw, 3rem); }
    .pb-answer-text { font-size: clamp(2.6rem, 13vw, 3.6rem); }
  }

  /* Reduced-motion: sin scrub, todo estático y legible (la respuesta en flujo). */
  @media (prefers-reduced-motion: reduce) {
    .pb { height: auto; }
    .pb-stage { position: static; height: auto; padding-block: clamp(8svh, 14svh, 16svh); }
    .pb-eyebrow { position: static; margin-bottom: 1.6rem; }
    .pb-answer {
      position: static;
      inset: auto;
      opacity: 1;
      justify-content: flex-start;
      text-align: left;
      margin-top: clamp(2rem, 4vw, 3rem);
    }
  }
`;
