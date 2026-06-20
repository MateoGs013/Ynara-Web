"use client";

import { Fragment, useRef } from "react";
import { hero, site } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { lineReveal } from "@/lib/reveal";

/**
 * Capítulo 00 — el héroe sobre la seda (olas edge-on). Composición tiwis: el
 * wordmark "Ynara" COLOSAL anclado abajo, y arriba el valor en una línea + CTA.
 * Tensión diagonal, alto contraste (scrim), mucho aire. No es columna centrada.
 */
function Accented({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: texto estático
          <em key={i} className="hero-accent">
            {part}
          </em>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: texto estático
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;
      registerGsap();

      const eyebrow = root.querySelector(".hero-eyebrow");
      // Split sólo sobre el wordmark VISIBLE (.hero-wordmark-text), no sobre el
      // <h1> entero: así el <span class="sr-only"> con la propuesta de valor
      // (SEO/a11y) no entra en el SplitText ni rompe el mask de líneas.
      const word = root.querySelector(".hero-wordmark-text");
      const value = root.querySelector<HTMLElement>(".hero-value");
      const aux = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".hero-aux"));

      gsap.to(root.querySelector(".hero-content"), {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "45% top", scrub: true },
      });

      if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 18 });
      if (aux.length) gsap.set(aux, { opacity: 0, y: 18 });
      const valueTween = value
        ? lineReveal(value, { y: "130%", rot: 2.2, dur: 1.1, stagger: 0.12, immediate: true })
        : null;
      const wordTween = word
        ? lineReveal(word, { y: "118%", rot: 2, dur: 1.5, stagger: 0, immediate: true })
        : null;

      const play = () => {
        const tlIn = gsap.timeline();
        if (eyebrow) tlIn.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
        tlIn.call(() => valueTween?.play(), undefined, 0.1);
        if (aux.length)
          tlIn.to(aux, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.5);
        tlIn.call(() => wordTween?.play(), undefined, 0.55);
      };

      let introSeen = false;
      try {
        introSeen =
          window.__ynaraIntroDone === true || sessionStorage.getItem("ynara-intro") === "1";
      } catch {
        introSeen = window.__ynaraIntroDone === true;
      }
      if (introSeen) {
        gsap.delayedCall(0.2, play);
        return;
      }
      const onDone = () => play();
      window.addEventListener("ynara:intro-done", onDone, { once: true });
      return () => window.removeEventListener("ynara:intro-done", onDone);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="hero relative" aria-label="Ynara">
      <div className="hero-content">
        <div className="hero-grid">
          <div className="hero-head">
            <p className="hero-value">
              <Accented text={hero.value} />
            </p>

            <div className="hero-aux hero-ctas">
              <a className="hero-cta-primary" href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
              </a>
              <a className="hero-cta-secondary" href={hero.ctaSecondary.href}>
                {hero.ctaSecondary.label}
              </a>
            </div>
          </div>
          {/* El <h1> incluye la propuesta de valor para SEO/a11y sin alterar el
              look: "Ynara" sigue siendo lo único visible; el valor va en sr-only. */}
          <h1 className="hero-wordmark">
            <span className="hero-wordmark-text">{site.name}</span>
            <span className="sr-only"> — tu asistente personal con memoria</span>
          </h1>
        </div>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático local */}
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
    </section>
  );
}

const HERO_CSS = `
  .hero { height: 132svh; }
  .hero-content { position: relative; height: 100svh; }
  .hero-grid {
    position: relative;
    height: 100svh;
    max-width: 1500px;
    margin: 0 auto;
    padding: clamp(12svh, 16svh, 18svh) 6vw clamp(3svh, 5svh, 6svh);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .hero-head { max-width: 40ch; }
  .hero-eyebrow { color: var(--c-acc); margin-bottom: 1.6rem; }
  .hero-value {
    margin: 0;
    max-width: 19ch;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 500;
    font-size: clamp(1.6rem, 2.9vw, 2.9rem);
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--c-ivory);
  }
  .hero-accent { font-style: normal; color: var(--c-blue-bright); }
  .hero-sub {
    margin: clamp(1.3rem, 2.2vw, 2rem) 0 0;
    max-width: 40ch;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.95rem, 1.05vw, 1.1rem);
    line-height: 1.6;
    color: var(--c-ivory);
    opacity: 0.72;
  }
  .hero-ctas { display: flex; align-items: center; gap: 1.6rem; flex-wrap: wrap; margin-top: clamp(1.6rem, 2.6vw, 2.2rem); }
  .hero-cta-primary {
    display: inline-flex; align-items: center;
    padding: 0.95rem 2rem; border-radius: 999px;
    background: var(--c-blue); color: #fff;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.95rem; font-weight: 600; text-decoration: none;
    transition: transform 0.35s cubic-bezier(0.77,0,0.175,1), background 0.35s cubic-bezier(0.77,0,0.175,1);
  }
  .hero-cta-primary:hover { background: var(--c-blue-hover); transform: translateY(-2px); }
  .hero-cta-secondary {
    color: var(--c-ivory);
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.9rem; font-weight: 600; text-decoration: none;
    border-bottom: 1px solid rgba(243,240,234,0.3); padding-bottom: 2px;
    transition: border-color 0.35s cubic-bezier(0.77,0,0.175,1);
  }
  .hero-cta-secondary:hover { border-color: var(--c-ivory); }
  .hero-badge {
    margin: clamp(1.8rem, 3vw, 2.6rem) 0 0;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.62rem, 0.72vw, 0.74rem);
    font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--c-acc); opacity: 0.85;
  }
  /* el wordmark colosal, anclado abajo */
  .hero-wordmark {
    margin: 0;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(5rem, 19vw, 21rem);
    line-height: 0.82;
    letter-spacing: -0.05em;
    color: var(--c-text-bright);
  }
  /* span visible del wordmark — caja de bloque para que SplitText mida líneas
     igual que el <h1> previo (el sr-only hermano queda fuera del split). */
  .hero-wordmark-text { display: block; }
  @media (max-width: 767px) {
    .hero-grid { padding-top: 14svh; }
    .hero-value { font-size: clamp(1.5rem, 6.5vw, 2.2rem); max-width: 100%; }
    .hero-wordmark { font-size: clamp(4.5rem, 28vw, 9rem); }
  }
`;
