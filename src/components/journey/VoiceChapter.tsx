"use client";

import { useRef } from "react";
import { feel } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { lineReveal } from "@/lib/reveal";

/**
 * Capítulo Demo — "Cómo se siente". MUNDO CLARO (ivory). Layout distintivo:
 * split editorial a la izquierda + un PANEL de chat (mockup del producto) a la
 * derecha donde la conversación se arma sola. No es una grilla de columnas.
 */

// Acentos por pilar, alineados con HorizontalModes (Productividad/Memoria/Bienestar).
const MODE_ACC: Record<string, string> = {
  Productividad: "#2f5aa6",
  Memoria: "#8165a3",
  Bienestar: "#5c6fb3",
};

export function VoiceChapter() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;
      registerGsap();

      const eyebrow = root.querySelector<HTMLElement>(".vc-eyebrow");
      const hairline = root.querySelector<HTMLElement>(".vc-hairline");
      const title = root.querySelector<HTMLElement>(".vc-title");
      const lead = root.querySelector<HTMLElement>(".vc-lead");

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
      if (hairline) {
        gsap.set(hairline, { width: "0%" });
        gsap.to(hairline, {
          width: "100%",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: root, start: "clamp(top 76%)" },
        });
      }
      if (title) lineReveal(title, { y: "150%", rot: 2.5, dur: 1.2, stagger: 0.15 });
      if (lead) lineReveal(lead, { y: "140%", rot: 2, dur: 1, stagger: 0.1, start: "clamp(top 72%)" });

      // El panel: la conversación "se escribe sola" — cada mensaje sube en cascada.
      const msgs = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".vc-msg"));
      gsap.set(msgs, { opacity: 0, y: 26 });
      gsap.to(msgs, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: { trigger: ".vc-panel", start: "clamp(top 80%)" },
      });
      const panel = root.querySelector<HTMLElement>(".vc-panel");
      if (panel) {
        gsap.from(panel, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "clamp(top 82%)" },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="voz" className="vc relative" aria-label="La voz" data-wipe-tone="ivory">
      <div className="vc-inner">
        <div className="vc-text">
          <p className="vc-eyebrow">{feel.eyebrow}</p>
          <span className="vc-hairline" aria-hidden />
          <h2 className="vc-title">{feel.title}</h2>
          <p className="vc-lead">{feel.support}</p>
        </div>

        <div className="vc-panel">
          <div className="vc-panel-head">
            <span className="vc-dot-mark" aria-hidden />
            <span className="vc-panel-name">Ynara</span>
            <span className="vc-panel-status">en línea</span>
          </div>
          <div className="vc-thread">
            {feel.chats.map((c) => (
              <div
                className="vc-ex"
                key={c.mode}
                style={{ "--mode-acc": MODE_ACC[c.mode] ?? "#5c6fb3" } as React.CSSProperties}
              >
                <span className="vc-msg vc-mode">{c.mode}</span>
                <p className="vc-msg vc-bubble vc-user">{c.user}</p>
                <p className="vc-msg vc-bubble vc-ynara">{c.ynara}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático local */}
      <style dangerouslySetInnerHTML={{ __html: VC_CSS }} />
    </section>
  );
}

const VC_CSS = `
  .vc {
    position: relative;
    z-index: 3;
    background: var(--c-ivory);
    color: var(--c-navy);
    padding: clamp(4svh, 7svh, 9svh) 0 clamp(8svh, 12svh, 14svh);
  }
  .vc-inner {
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
    padding: 0 6vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 6rem);
    align-items: center;
  }
  .vc-eyebrow {
    margin: 0 0 1.5rem;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.62rem, 0.72vw, 0.76rem);
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--c-navy);
    opacity: 0.55;
  }
  .vc-hairline { display: block; width: 0%; height: 1px; margin-bottom: 2.4rem; max-width: 18rem; background: var(--c-navy); opacity: 0.2; }
  .vc-title {
    margin: 0;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(2.4rem, 4.6vw, 4.8rem);
    line-height: 0.98;
    letter-spacing: -0.04em;
    color: var(--c-navy-deep);
  }
  .vc-lead {
    margin: clamp(1.2rem, 2vw, 1.8rem) 0 0;
    max-width: 42ch;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.98rem, 1.15vw, 1.2rem);
    line-height: 1.6;
    color: var(--c-navy);
    opacity: 0.74;
  }

  /* PANEL — mockup del producto */
  .vc-panel {
    background: #fff;
    border: 1px solid rgba(36, 44, 63, 0.1);
    border-radius: 22px;
    box-shadow: 0 30px 80px -40px rgba(20, 23, 35, 0.5);
    overflow: hidden;
  }
  .vc-panel-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 1.4rem;
    border-bottom: 1px solid rgba(36, 44, 63, 0.08);
    background: var(--c-paper);
  }
  .vc-dot-mark { width: 10px; height: 10px; border-radius: 999px; background: var(--c-blue); box-shadow: 0 0 0 4px rgba(47,90,166,0.15); }
  .vc-panel-name {
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600; font-size: 0.95rem; color: var(--c-navy-deep);
  }
  .vc-panel-status {
    margin-left: auto;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--c-blue); opacity: 0.8;
  }
  .vc-thread { display: flex; flex-direction: column; gap: 1.6rem; padding: clamp(1.4rem, 2vw, 2rem); }
  .vc-ex { display: flex; flex-direction: column; gap: 0.6rem; }
  .vc-mode {
    align-self: flex-start;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--mode-acc);
  }
  .vc-bubble {
    margin: 0; padding: 0.8rem 1.05rem;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.95rem; line-height: 1.5; border-radius: 16px; max-width: 86%;
  }
  .vc-user {
    align-self: flex-end; border-bottom-right-radius: 5px;
    background: var(--c-navy-deep); color: var(--c-ivory);
  }
  .vc-ynara {
    align-self: flex-start; border-bottom-left-radius: 5px;
    background: var(--c-paper); border: 1px solid rgba(36,44,63,0.1);
    border-left: 2px solid var(--mode-acc); color: var(--c-navy);
  }
  @media (max-width: 880px) {
    .vc-inner { grid-template-columns: 1fr; gap: clamp(2rem, 6vw, 3rem); }
    .vc-title { font-size: clamp(2.4rem, 9vw, 3.2rem); }
    .vc-lead { max-width: 100%; }
  }
`;
