"use client";

import { useRef } from "react";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { problem } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { useReveal } from "@/lib/useReveal";
import { SectionHeader } from "./SectionHeader";

const FRAGMENTS = [
  "Agenda",
  "Notas",
  "Recordatorios",
  "Calendario",
  "Bienestar",
  "ChatGPT",
  "To-do",
  "Diario",
];

const CIRCLES = [
  { cls: "vn-c-mem", grad: "var(--grad-violet)", left: "20%", top: "3%", label: "Memoria", lx: "50%", ly: "-8%" },
  { cls: "vn-c-prod", grad: "var(--grad-blue)", left: "3%", top: "34%", label: "Productividad", lx: "-4%", ly: "104%" },
  { cls: "vn-c-bien", grad: "var(--grad-jade)", left: "37%", top: "34%", label: "Bienestar", lx: "104%", ly: "104%" },
];

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  // Ensamblado cinematográfico pinned — desktop, con reduced-motion off.
  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (reducedMotion()) return;
        const root = ref.current;
        const stage = root?.querySelector<HTMLElement>("[data-stage]");
        const pin = root?.querySelector<HTMLElement>("[data-pin]");
        if (!stage || !pin) return;
        const q = gsap.utils.selector(pin);

        gsap.set(q(".vn-c-mem"), { yPercent: -170, opacity: 0, scale: 0.6 });
        gsap.set(q(".vn-c-prod"), { xPercent: -150, yPercent: 95, opacity: 0, scale: 0.6 });
        gsap.set(q(".vn-c-bien"), { xPercent: 150, yPercent: 95, opacity: 0, scale: 0.6 });
        gsap.set(q(".vn-label"), { opacity: 0 });
        gsap.set(q(".vn-mark"), { opacity: 0, scale: 0.3 });
        gsap.set(q(".vn-glow"), { opacity: 0, scale: 0.5 });
        gsap.set(q(".vn-inter"), { opacity: 0, y: 28 });
        gsap.set(q(".vn-comp"), { opacity: 0, x: 26 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=150%",
            scrub: 0.6,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          [q(".vn-c-mem"), q(".vn-c-prod"), q(".vn-c-bien")],
          { xPercent: 0, yPercent: 0, opacity: 0.42, scale: 1, duration: 1, ease: "power2.out", stagger: 0.1 },
        )
          .to(q(".vn-label"), { opacity: 1, duration: 0.4, stagger: 0.06 }, "-=0.35")
          .to(q(".vn-glow"), { opacity: 1, scale: 1, duration: 0.6 }, "-=0.15")
          .to(q(".vn-mark"), { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, "<")
          .to(q(".vn-inter"), { opacity: 1, y: 0, duration: 0.5 }, "+=0.1")
          .to(q(".vn-comp"), { opacity: 1, x: 0, duration: 0.5, stagger: 0.14 }, "-=0.15")
          .to({}, { duration: 0.5 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="problema" ref={ref} className="relative overflow-hidden">
      <div className="shell pt-[clamp(5rem,3rem+9vw,11rem)]">
        <SectionHeader
          eyebrow={problem.eyebrow}
          title={problem.title}
          lead={problem.lead}
        />
        <div className="mt-10 flex flex-wrap gap-2.5" data-reveal-group>
          {FRAGMENTS.map((f) => (
            <span
              key={f}
              data-reveal
              className="rounded-[var(--r-pill)] border border-hair px-3.5 py-1.5 text-sm text-text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* DESKTOP — ensamblado pinned */}
      <div data-stage className="relative hidden lg:block">
        <div data-pin className="flex h-[100svh] items-center">
          <div className="shell grid grid-cols-2 items-center gap-16">
            {/* Venn */}
            <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden>
              <div
                className="vn-glow -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(75,126,230,0.3), transparent 68%)",
                }}
              />
              {CIRCLES.map((c) => (
                <div
                  key={c.cls}
                  className={`${c.cls} absolute h-[60%] w-[60%] rounded-full border border-white/15`}
                  style={{
                    left: c.left,
                    top: c.top,
                    background: c.grad,
                    opacity: 0.42,
                    mixBlendMode: "screen",
                  }}
                >
                  <span
                    className="vn-label absolute whitespace-nowrap font-display text-sm font-semibold text-text"
                    style={{ left: c.lx, top: c.ly, transform: "translate(-50%,-50%)" }}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
              <div className="vn-mark -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2">
                <YnaraMark size={52} variant="gradient" />
              </div>
            </div>

            {/* Texto */}
            <div>
              <p className="vn-inter text-h2 font-display text-text-bright">
                {problem.intersection}
              </p>
              <ul className="mt-10 flex flex-col divide-y divide-[var(--c-hair)]">
                {problem.competitors.map((c) => (
                  <li key={c.name} className="vn-comp py-4 text-body-lg">
                    <span className="font-display font-semibold text-text-bright">
                      {c.name}
                    </span>{" "}
                    {c.does}, pero <span className="text-text-muted">{c.but}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET — versión apilada */}
      <div className="shell pb-[clamp(5rem,3rem+9vw,11rem)] pt-16 lg:hidden">
        <div className="grid gap-3">
          {problem.layers.map((l) => (
            <div key={l.key} className="surface-card p-5">
              <h3 className="text-h3">{l.title}</h3>
              <p className="text-body-lg mt-1">{l.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-h3 font-display text-text-bright">
          {problem.intersection}
        </p>
        <ul className="mt-6 flex flex-col divide-y divide-[var(--c-hair)]">
          {problem.competitors.map((c) => (
            <li key={c.name} className="py-4 text-body-lg">
              <span className="font-display font-semibold text-text-bright">
                {c.name}
              </span>{" "}
              {c.does}, pero <span className="text-text-muted">{c.but}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
