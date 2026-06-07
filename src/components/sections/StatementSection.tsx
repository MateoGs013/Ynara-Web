"use client";

import { useRef } from "react";
import FlowField from "@/components/atmosphere/FlowField";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";

const LINE1 = "Menos fricción.";
const LINE2 = "Más vida.";

function Words({ text, lineClass }: { text: string; lineClass: string }) {
  return (
    <span className={`block ${lineClass}`}>
      {text.split(" ").map((w, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: palabras estáticas
        <span key={i} className="st-word inline-block">
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/**
 * Beat tipográfico full-bleed: la filosofía de Ynara se enciende palabra por
 * palabra al scrollear (pinned + scrub). Tipografía como arquitectura.
 */
export function StatementSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q(".st-word"), { opacity: 1 });
        gsap.set(q(".st-glow"), { opacity: 1 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-st-stage]");
        const pin = root.querySelector<HTMLElement>("[data-st-pin]");
        if (!stage || !pin) return;

        gsap.set(q(".st-l1 .st-word"), { opacity: 0.14 });
        gsap.set(q(".st-l2 .st-word"), { opacity: 0.14 });
        gsap.set(q(".st-glow"), { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=120%",
            scrub: 0.6,
            pin,
            anticipatePin: 1,
          },
        });
        tl.to(q(".st-l1 .st-word"), { opacity: 0.5, stagger: 0.2, duration: 1, ease: "none" })
          .to(q(".st-glow"), { opacity: 1, duration: 1 }, "<0.3")
          .to(
            q(".st-l2 .st-word"),
            { opacity: 1, stagger: 0.28, duration: 1.2, ease: "none" },
            ">-0.1",
          )
          .to({}, { duration: 0.4 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="filosofia" className="relative">
      <div data-st-stage className="relative">
        <div
          data-st-pin
          className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 -z-[1] opacity-55">
            <FlowField density={0.7} speed={0.85} />
          </div>
          <div
            className="st-glow -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[680px] max-w-full"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 50%, rgba(75,126,230,0.18), transparent 70%)",
            }}
          />
          <p className="text-display relative px-6 text-center leading-[0.98]">
            <Words text={LINE1} lineClass="st-l1 text-text-bright" />
            <Words text={LINE2} lineClass="st-l2 text-gradient-blue" />
          </p>
        </div>
      </div>
    </section>
  );
}
