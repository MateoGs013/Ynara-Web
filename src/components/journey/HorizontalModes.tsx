"use client";

import { useRef } from "react";
import { problem } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/motion";
import { lineReveal } from "@/lib/reveal";

/**
 * Capítulo 03 — EL HANDOFF. El campo llega aquí convertido en tablero de
 * cuadros grandes (y se atenúa); el mundo de cards ivory CRECE desde la
 * esquina inferior derecha sobre él, se asienta, y el scroll pasa a ser
 * HORIZONTAL: tres pilares como cards de 50vw alternando espaciadores
 * transparentes donde el campo respira. Mecánica tiwis exacta:
 * pin + scale(0→1, origin 100% 100%) 30% → settle 20% → travel 50% → hold 15%.
 *
 * `data-cascade-end` en la sección = el punto donde el timeline del campo
 * completa (p=1). El tablero ES la antesala de las cards.
 */

// Acentos planos de la identidad: azul · violeta (señal=memoria) · azul violáceo.
const ACCENTS = ["#2f5aa6", "#8165a3", "#5c6fb3"] as const;
const CLAIMS = [
  "Agendar, recordar, cerrar tareas. Ynara aprende cómo trabajás y se adelanta — lista antes de que preguntes.",
  "Nombres, charlas, decisiones. Todo se conecta en silencio y se cita textual: no reescribe tus recuerdos.",
  "Registra tu energía y tus patrones. Está cuando la necesitás y se corre cuando no.",
] as const;
const CARDS = problem.layers.map((l, i) => ({
  word: l.title,
  label: l.note.replace(/\.$/, ""),
  claim: CLAIMS[i],
  features: l.features,
  accent: ACCENTS[i],
}));

function SvgOrbit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden role="presentation">
      <circle cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="18" />
      <line x1="50" y1="12" x2="50" y2="88" />
      <line x1="12" y1="50" x2="88" y2="50" />
    </svg>
  );
}
function SvgNet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden role="presentation">
      <circle cx="50" cy="50" r="40" />
      <line x1="10" y1="50" x2="90" y2="50" />
      <path d="M50 10 Q70 30 50 50 Q30 70 50 90" />
      <path d="M50 10 Q30 30 50 50 Q70 70 50 90" />
    </svg>
  );
}
function SvgPulse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} aria-hidden role="presentation">
      <polyline points="0,30 15,30 25,10 35,50 45,20 55,40 65,30 80,30 90,30 100,30" />
    </svg>
  );
}

const SPACERS = [
  { label: "01 · Organiza", Svg: SvgOrbit },
  { label: "02 · Recuerda", Svg: SvgNet },
  { label: "03 · Acompaña", Svg: SvgPulse },
] as const;

export function HorizontalModes() {
  const rootRef = useRef<HTMLElement>(null);
  const textPinRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const claimSplitsRef = useRef<Map<number, SplitText>>(new Map());
  const revealedRef = useRef<Set<number>>(new Set());
  const firstCardTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      registerGsap();
      if (reducedMotion()) return; // CSS deja el stack vertical legible

      // matchMedia: re-corre el setup correcto al cruzar 479px (antes se leía
      // una sola vez al montar → rotar/redimensionar dejaba el modo equivocado)
      // y revierte todo (triggers, pin, splits) al cambiar de query o desmontar.
      const mm = gsap.matchMedia();
      mm.add("(max-width: 479px)", () => {
        setupMobileFallback();
      });
      mm.add("(min-width: 480px)", () => setupDesktop());
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  function setupMobileFallback() {
    slideRefs.current.forEach((el) => {
      if (!el) return;
      const texts = el.querySelectorAll<HTMLElement>(".h-slide__claim, .h-slide__word, .h-slide__label");
      texts.forEach((t) => {
        lineReveal(t, { y: "140%", rot: 2.5, dur: 0.7, stagger: 0.05, start: "top 80%" });
      });
    });
  }

  function setupDesktop() {
    const root = rootRef.current;
    if (!root) return;
    const section = root.querySelector<HTMLElement>(".horizontal-section");
    const wrapper = root.querySelector<HTMLElement>(".horizontal-wrapper");
    const track = root.querySelector<HTMLElement>(".track");
    const textPin = textPinRef.current;
    if (!section || !wrapper || !track) return;

    const dist = () => track.scrollWidth - window.innerWidth;

    gsap.set(wrapper, { scale: 0, x: 0, transformOrigin: "100% 100%" });
    gsap.set(track, { x: 0 });

    prepareSlideReveals();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${dist() + window.innerHeight * 0.5}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "none" },
    });

    tl.addLabel("scaleStart")
      // FASE 1 (30%): el mundo de cards crece desde la esquina inferior derecha
      .to(wrapper, { scale: 1, x: "50vw", duration: 0.3 })
      // primer card: claim + label + palabra, gateados al fin de la escala
      .call(
        () => {
          firstCardTweenRef.current?.play();
          const first = slideRefs.current[0];
          if (first) {
            const label = first.querySelector<HTMLElement>(".h-slide__label");
            const word = first.querySelector<HTMLElement>(".h-slide__word");
            const feats = first.querySelectorAll<HTMLElement>(".h-slide__features li");
            if (label)
              gsap.to(label, { opacity: 0.55, duration: 0.5, ease: "power3.out", delay: 0.1 });
            if (word)
              gsap.to(word, { y: "0%", opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 });
            if (feats.length)
              gsap.to(feats, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.2 });
          }
        },
        undefined,
        ">",
      )
      .addLabel("scaleEnd")
      // FASE 2 (20%): settle a x:0
      .to(wrapper, { x: "0vw", duration: 0.2 })
      // FASE 3 (50%): el viaje lateral
      .to(track, { x: () => -dist(), duration: 0.5 })
      // FASE 4 (15%): hold de salida
      .to({}, { duration: 0.15 });

    if (textPin) {
      ScrollTrigger.create({
        trigger: section,
        start: "top 20%",
        end: () => {
          const st = tl.scrollTrigger;
          if (!st) return "+=0";
          const s = st.start + tl.labels.scaleStart * (st.end - st.start);
          const e = st.start + tl.labels.scaleEnd * (st.end - st.start);
          return s + (e - s) * 0.7;
        },
        pin: textPin,
        pinSpacing: false,
        scrub: true,
        anticipatePin: 1,
      });
    }

    const observer = setupIntersectionObserver();

    // Reveal del bloque pinneado (viene de abajo, está below-fold al cargar)
    const pinLabel = textPin?.querySelector<HTMLElement>(".hm-pin-label");
    const pinText = textPin?.querySelector<HTMLElement>(".hm-pin-text");
    if (pinLabel) {
      gsap.set(pinLabel, { opacity: 0, y: 14 });
      gsap.to(pinLabel, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: textPin, start: "clamp(top 80%)" },
      });
    }
    if (pinText) lineReveal(pinText, { y: "150%", rot: 2.5, dur: 1.2, stagger: 0.15 });

    // cleanup: matchMedia revierte triggers/pin/splits; el IO se desconecta acá.
    return () => observer?.disconnect();
  }

  function prepareSlideReveals() {
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const isCard = i % 2 === 0;
      if (isCard) {
        const claim = el.querySelector<HTMLElement>(".h-slide__claim");
        const label = el.querySelector<HTMLElement>(".h-slide__label");
        const word = el.querySelector<HTMLElement>(".h-slide__word");
        const feats = el.querySelectorAll<HTMLElement>(".h-slide__features li");
        if (feats.length) gsap.set(feats, { opacity: 0, y: 14 });
        if (i === 0) {
          if (claim) {
            firstCardTweenRef.current = lineReveal(claim, {
              y: "140%",
              rot: 0,
              dur: 0.7,
              stagger: 0.05,
              immediate: true,
            });
          }
        } else if (claim) {
          // partir YA y esconder las LÍNEAS dentro de sus máscaras
          const split = SplitText.create(claim, { type: "lines", mask: "lines" });
          gsap.set(split.lines, { y: "140%" });
          claimSplitsRef.current.set(i, split);
        }
        if (label) gsap.set(label, { opacity: 0 });
        if (word) gsap.set(word, { y: "140%", opacity: 0 });
      } else {
        const paths = el.querySelectorAll<SVGGeometryElement>(
          ".slide-side__svg path, .slide-side__svg circle, .slide-side__svg line, .slide-side__svg polyline",
        );
        paths.forEach((p) => {
          if (p.getTotalLength) {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          }
        });
        const label = el.querySelector<HTMLElement>(".slide-side__label");
        if (label) gsap.set(label, { opacity: 0, y: "20px" });
      }
    });
  }

  function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.slideIndex);
          if (Number.isNaN(idx) || revealedRef.current.has(idx)) return;
          revealedRef.current.add(idx);
          observer.unobserve(entry.target);
          revealSlide(idx);
        });
      },
      { threshold: 0.5 },
    );
    slideRefs.current.forEach((el, i) => {
      if (!el || i === 0) return;
      el.dataset.slideIndex = String(i);
      observer.observe(el);
    });
    return observer;
  }

  function revealSlide(idx: number) {
    const el = slideRefs.current[idx];
    if (!el) return;
    const isCard = idx % 2 === 0;

    if (isCard) {
      const label = el.querySelector<HTMLElement>(".h-slide__label");
      const word = el.querySelector<HTMLElement>(".h-slide__word");
      const feats = el.querySelectorAll<HTMLElement>(".h-slide__features li");
      const split = claimSplitsRef.current.get(idx);
      if (split) gsap.to(split.lines, { y: "0%", duration: 0.7, ease: "power3.out", stagger: 0.05 });
      if (label) gsap.to(label, { opacity: 0.55, duration: 0.5, ease: "power3.out", delay: 0.1 });
      if (word) gsap.to(word, { y: "0%", opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 });
      if (feats.length)
        gsap.to(feats, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.2 });
    } else {
      const paths = el.querySelectorAll<SVGGeometryElement>(
        ".slide-side__svg path, .slide-side__svg circle, .slide-side__svg line, .slide-side__svg polyline",
      );
      paths.forEach((p, pi) => {
        gsap.to(p, { strokeDashoffset: 0, duration: 1.5, ease: "power3.inOut", delay: pi * 0.1 });
      });
      const label = el.querySelector<HTMLElement>(".slide-side__label");
      if (label) gsap.to(label, { opacity: 0.65, y: "0px", duration: 0.7, ease: "power3.out", delay: 0.3 });
    }
  }

  function setSlideRef(idx: number) {
    return (el: HTMLDivElement | null) => {
      slideRefs.current[idx] = el;
    };
  }

  return (
    <section ref={rootRef} id="producto" aria-label="Producto">
      {/* Bloque pinneado: queda quieto mientras el mundo de cards crece encima */}
      <div className="hm-text-pin" ref={textPinRef}>
        <p className="hm-pin-label">{problem.pillarsEyebrow}</p>
        <p className="hm-pin-text">{problem.pillarsIntro}</p>
      </div>

      {/* La sección horizontal — acá COMPLETA la cascada del campo */}
      <div className="horizontal-section" data-cascade-end>
        <div className="horizontal-wrapper">
          <div className="track">
            {CARDS.map((card, ci) => {
              const spacer = SPACERS[ci];
              const SpacerSvg = spacer.Svg;
              return (
                <div key={card.word} style={{ display: "contents" }}>
                  <div
                    className="h-slide"
                    ref={setSlideRef(ci * 2)}
                    data-wipe-tone="ivory"
                    style={{ "--card-acc": card.accent } as React.CSSProperties}
                  >
                    <div className="h-slide__top">
                      <p className="h-slide__claim">{card.claim}</p>
                      <ul className="h-slide__features">
                        {card.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="h-slide__bot">
                      <span className="h-slide__accent" aria-hidden />
                      <span className="h-slide__label">{card.label}</span>
                      <h2 className="h-slide__word">{card.word}</h2>
                    </div>
                  </div>
                  <div className="h-slide side" ref={setSlideRef(ci * 2 + 1)}>
                    <div className="slide-side__content">
                      <span className="slide-side__label">{spacer.label}</span>
                      <SpacerSvg className="slide-side__svg" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático local */}
      <style dangerouslySetInnerHTML={{ __html: HM_CSS }} />
    </section>
  );
}

const HM_CSS = `
  .hm-text-pin {
    padding: 10svh 6vw 6svh;
  }
  .hm-pin-label {
    margin: 0 0 1rem;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-acc);
  }
  .hm-pin-text {
    margin: 0;
    max-width: 760px;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(1.8rem, 1rem + 3.5vw, 3.8rem);
    line-height: 1.08;
    letter-spacing: -0.035em;
    color: var(--c-text-bright);
  }

  .horizontal-section {
    width: 100vw;
    height: 100svh;
    margin-top: -50vh;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .horizontal-wrapper {
    transform-origin: 100% 100%;
    width: 100vw;
    height: 100svh;
    position: relative;
    overflow: hidden;
  }
  .track {
    display: flex;
    flex: none;
    justify-content: flex-start;
    align-items: stretch;
    height: 100%;
    position: relative;
  }

  .h-slide {
    flex: 0 0 50vw;
    height: 100%;
    background-color: var(--c-ivory);
    color: var(--c-navy);
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    padding: 4.167vw 4.167vw 3.167vw;
    overflow: hidden;
  }
  .h-slide.side {
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .h-slide__top {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 5.5rem;
  }
  .h-slide__claim {
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.9rem, 0.5rem + 1vw, 1.1rem);
    font-weight: 400;
    line-height: 1.55;
    color: var(--c-navy);
    opacity: 0.78;
    max-width: 360px;
    margin: 0;
  }
  .h-slide__features {
    list-style: none;
    margin: 1.8rem 0 0;
    padding: 0;
    max-width: 380px;
  }
  .h-slide__features li {
    padding: 0.6rem 0;
    border-top: 1px solid rgba(36, 44, 63, 0.14);
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--c-navy);
    opacity: 0.8;
  }
  .h-slide__bot {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .h-slide__accent {
    display: block;
    width: 2.6rem;
    height: 3px;
    margin-bottom: 0.9rem;
    background: var(--card-acc, var(--c-blue));
  }
  .h-slide__label {
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-navy);
    opacity: 0.55;
  }
  .h-slide__word {
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(3.2rem, 1rem + 6.4vw, 7rem);
    line-height: 0.88;
    letter-spacing: -0.05em;
    color: var(--c-navy-deep);
    margin: 0;
  }

  .slide-side__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .slide-side__label {
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-ivory);
    opacity: 0.65;
  }
  .slide-side__svg {
    width: clamp(80px, 8vw, 130px);
    height: clamp(80px, 8vw, 130px);
    overflow: visible;
  }
  .slide-side__svg path,
  .slide-side__svg circle,
  .slide-side__svg line,
  .slide-side__svg polyline {
    fill: none;
    stroke: var(--c-blue-violet);
    stroke-width: 1.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (max-width: 479px) {
    .horizontal-section { height: auto; margin-top: 0; position: static; }
    .horizontal-wrapper { overflow: visible; }
    .track { flex-direction: column; height: auto; }
    .h-slide { flex: none; width: 100%; height: auto; min-height: 70svh; padding: 10vw 6vw 8vw; }
    .h-slide.side { min-height: 40svh; }
  }
  @media (prefers-reduced-motion: reduce) {
    .horizontal-section { height: auto; margin-top: 0; position: static; }
    .horizontal-wrapper { overflow: visible; transform: none !important; }
    .track { flex-direction: column; height: auto; transform: none !important; }
    .h-slide { flex: none; width: 100%; height: auto; min-height: 60svh; }
    .h-slide.side { min-height: 30svh; }
  }
`;
