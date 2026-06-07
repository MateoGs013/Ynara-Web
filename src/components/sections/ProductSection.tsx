"use client";

import { useRef } from "react";
import { product } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { useReveal } from "@/lib/useReveal";
import { SectionHeader } from "./SectionHeader";

const MODE_DESC: Record<string, string> = {
  productividad: "Agendá, recordá y cerrá loops. Ejecuta, no solo conversa.",
  estudio: "Explica desde lo que ya sabés: un ejemplo concreto antes que la respuesta.",
  bienestar: "Frases cortas, mucho silencio. Acompaña sin diagnosticar.",
  vida: "Habla como una amiga cercana. Recomendaciones con razones cortas.",
  memoria: "Cita textual lo que recordás — con fecha, sin reescribir.",
};

export function ProductSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (reducedMotion()) return;
        const root = ref.current;
        const stage = root?.querySelector<HTMLElement>("[data-modes-stage]");
        const pin = root?.querySelector<HTMLElement>("[data-modes-pin]");
        if (!stage || !pin) return;

        const slides = gsap.utils.toArray<HTMLElement>(".mode-slide", pin);
        const washes = gsap.utils.toArray<HTMLElement>(".mode-wash", pin);
        const idx = gsap.utils.toArray<HTMLElement>(".mode-idx", pin);
        const n = slides.length;

        gsap.set(slides, { opacity: 0, y: 50 });
        gsap.set(washes, { opacity: 0 });
        gsap.set(idx, { opacity: 0.3 });
        gsap.set(slides[0], { opacity: 1, y: 0 });
        gsap.set(washes[0], { opacity: 1 });
        gsap.set(idx[0], { opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${n * 85}%`,
            scrub: 0.5,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < n; i++) {
          tl.to([slides[i - 1], washes[i - 1]], { opacity: 0, duration: 0.5 }, `m${i}`)
            .to(slides[i - 1], { y: -50, duration: 0.5 }, "<")
            .to(idx[i - 1], { opacity: 0.3, duration: 0.4 }, "<")
            .to([slides[i], washes[i]], { opacity: 1, duration: 0.6 }, "<0.15")
            .fromTo(slides[i], { y: 50 }, { y: 0, duration: 0.6 }, "<")
            .to(idx[i], { opacity: 1, duration: 0.4 }, "<")
            .to({}, { duration: 0.6 });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="producto" ref={ref} className="relative">
      {/* DESKTOP — secuencia inmersiva pinned (solo con motion habilitado) */}
      <div data-modes-stage className="relative hidden motion-safe:lg:block">
        <div data-modes-pin className="relative h-[100svh] overflow-hidden">
          {product.modes.map((m) => (
            <div
              key={m.key}
              className="mode-wash pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(65% 75% at 70% 42%, ${m.color}38, transparent 66%), radial-gradient(40% 50% at 22% 75%, ${m.color}1f, transparent 70%)`,
              }}
            />
          ))}

          <div className="shell relative grid h-full grid-cols-[1fr_auto] items-center gap-12">
            <div className="relative">
              <span className="eyebrow">{product.eyebrow}</span>
              <div className="relative mt-8 h-[46vh]">
                {product.modes.map((m, i) => (
                  <div
                    key={m.key}
                    className="mode-slide absolute inset-0 flex flex-col justify-center"
                  >
                    <span
                      className="font-display font-bold leading-[0.8]"
                      style={{
                        fontSize: "clamp(5rem,11vw,10rem)",
                        color: m.color,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <h3 className="text-display mt-3">{m.title}</h3>
                    <p className="text-lead mt-4 max-w-lg">{m.tagline}</p>
                    <p className="text-body-lg mt-2 max-w-md text-text-soft">
                      {MODE_DESC[m.key]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Índice lateral */}
            <ul className="hidden flex-col gap-4 text-right xl:flex">
              {product.modes.map((m, i) => (
                <li
                  key={m.key}
                  className="mode-idx flex items-center justify-end gap-3 text-text"
                >
                  <span className="font-display text-sm font-medium">{m.title}</span>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: m.color }}
                  />
                  <span className="w-6 text-right font-display text-xs text-text-muted">
                    0{i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET — grilla (y fallback en reduced-motion) */}
      <div className="shell section-pad lg:hidden motion-reduce:lg:block">
        <SectionHeader
          eyebrow={product.eyebrow}
          title={product.title}
          lead={product.lead}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2" data-reveal-group>
          {product.modes.map((m, i) => (
            <article
              key={m.key}
              data-reveal
              className="surface-card relative overflow-hidden p-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-50 blur-2xl"
                style={{ background: m.gradient }}
              />
              <div className="relative">
                <span className="font-display text-sm text-text-muted">0{i + 1}</span>
                <h3 className="text-h3 mt-2">{m.title}</h3>
                <p className="text-body-lg mt-1">{m.tagline}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
