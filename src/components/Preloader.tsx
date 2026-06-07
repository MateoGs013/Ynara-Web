"use client";

import { useRef, useState } from "react";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { gsap, reducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";

const N = 8;
const R = 118;
const C = 150;
const POINTS = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
});

function signalDone() {
  try {
    sessionStorage.setItem("ynara-intro", "1");
  } catch {}
  window.__ynaraIntroDone = true;
  window.dispatchEvent(new Event("ynara:intro-done"));
  document.documentElement.classList.remove("intro-lock");
  window.__lenis?.start();
  // Recalcular triggers contra el layout ya liberado (altura real, sin lock).
  requestAnimationFrame(() => {
    window.__lenis?.resize?.();
    ScrollTrigger.refresh();
    document.getElementById("top")?.focus?.();
  });
}

export function Preloader() {
  const overlay = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [gone, setGone] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const skip = () => {
    tlRef.current?.kill();
    signalDone();
    setGone(true);
  };

  useGSAP(
    () => {
      const root = overlay.current;
      if (!root) return;

      let seen = false;
      try {
        seen = sessionStorage.getItem("ynara-intro") === "1";
      } catch {}

      if (seen || reducedMotion()) {
        signalDone();
        setGone(true);
        return;
      }

      document.documentElement.classList.add("intro-lock");
      window.__lenis?.stop();
      skipRef.current?.focus();

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") skip();
      };
      window.addEventListener("keydown", onKey);

      const q = gsap.utils.selector(root);
      gsap.set(q(".pl-node"), { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(q(".pl-line"), { strokeDashoffset: R });
      gsap.set(q(".pl-mark"), { opacity: 0, scale: 0.62 });
      gsap.set(q(".pl-glow"), { opacity: 0, scale: 0.4 });
      gsap.set(q(".pl-word"), { opacity: 0, y: 14 });
      gsap.set(q(".pl-bar i"), { scaleX: 0, transformOrigin: "left" });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(q(".pl-core"), { scale: 1, opacity: 1, duration: 0.4, ease: "expo.out" })
        .to(
          q(".pl-node"),
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "back.out(1.7)" },
          "-=0.2",
        )
        .to(
          q(".pl-line"),
          { strokeDashoffset: 0, duration: 0.5, stagger: 0.025, ease: "power2.out" },
          "-=0.3",
        )
        .to(q(".pl-glow"), { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }, ">-0.1")
        .to(q(".pl-mark"), { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }, "<")
        .to(
          [q(".pl-node"), q(".pl-line"), q(".pl-core")],
          { opacity: 0, duration: 0.4, ease: "power2.in" },
          "<+0.05",
        )
        .to(q(".pl-word"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.25")
        .to(q(".pl-bar i"), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "-=0.35")
        .addLabel("lift", "+=0.15")
        .call(signalDone, undefined, "lift")
        .to(q(".pl-content"), { y: -24, opacity: 0, duration: 0.6, ease: "power3.in" }, "lift")
        .to(
          root,
          {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: () => setGone(true),
          },
          "lift+=0.12",
        );

      return () => window.removeEventListener("keydown", onKey);
    },
    { scope: overlay },
  );

  if (gone) return null;

  return (
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Intro de Ynara"
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
    >
      <div className="pl-content relative flex flex-col items-center">
        <div className="relative h-[300px] w-[300px]">
          <div
            className="pl-glow -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(75,126,230,0.35), rgba(47,90,166,0.10) 42%, transparent 70%)",
            }}
          />
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
            {POINTS.map((p, i) => (
              <line
                // biome-ignore lint/suspicious/noArrayIndexKey: puntos estáticos
                key={`l${i}`}
                className="pl-line"
                x1={C}
                y1={C}
                x2={p.x}
                y2={p.y}
                stroke="rgba(139,154,208,0.5)"
                strokeWidth="1"
                strokeDasharray={R}
              />
            ))}
            {POINTS.map((p, i) => (
              <circle
                // biome-ignore lint/suspicious/noArrayIndexKey: puntos estáticos
                key={`n${i}`}
                className="pl-node"
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#d2ddfa"
              />
            ))}
            <circle className="pl-core" cx={C} cy={C} r="4" fill="#ffffff" opacity="0" />
          </svg>
          <div className="pl-mark -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2">
            <YnaraMark size={76} variant="gradient" />
          </div>
        </div>

        <p className="pl-word font-display text-2xl font-semibold tracking-tight text-text-bright">
          Ynara
        </p>
        <div className="pl-bar mt-5 h-[2px] w-28 overflow-hidden rounded-full bg-white/10">
          <i className="block h-full w-full bg-[var(--c-blue-bright)]" />
        </div>
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={skip}
        className="absolute bottom-5 right-5 rounded-[var(--r-md)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-text-soft transition-colors hover:text-text"
      >
        Saltar intro
      </button>
    </div>
  );
}
