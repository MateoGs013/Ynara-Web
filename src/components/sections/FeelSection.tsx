"use client";

import { useRef } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { feel } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { useReveal } from "@/lib/useReveal";

const CONVO = [
  {
    mode: "Productividad",
    color: "#4b7ee6",
    user: "agendá dentista mañana a las 7",
    ynara: "Listo, agendado mañana 19hs.",
  },
  {
    mode: "Estudio",
    color: "#6f9bf0",
    user: "no sé por dónde empezar la tesis",
    ynara: "¿Qué parte tenés más clara? Arrancamos por ahí.",
  },
  {
    mode: "Memoria",
    color: "#9b78c4",
    user: "¿cómo se llamaba el libro que me recomendaron?",
    ynara: "«La sustancia», te lo pasó Sofi el 12 de mayo.",
  },
];

export function FeelSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q(".cv-type"), { display: "none" });
        return;
      }

      gsap.set(q(".cv-type"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: q(".cv-phone"), start: "top 70%", once: true },
      });

      CONVO.forEach((_, e) => {
        tl.from(q(`.cv-mode-${e}`), { autoAlpha: 0, y: 8, duration: 0.3 })
          .from(
            q(`.cv-user-${e}`),
            { autoAlpha: 0, y: 14, scale: 0.96, duration: 0.4, ease: "back.out(1.5)" },
            "+=0.05",
          )
          .set(q(`.cv-type-${e}`), { autoAlpha: 1 }, "+=0.2")
          .to({}, { duration: 0.55 })
          .set(q(`.cv-type-${e}`), { autoAlpha: 0 })
          .from(q(`.cv-bot-${e}`), {
            autoAlpha: 0,
            y: 14,
            scale: 0.96,
            duration: 0.4,
            ease: "back.out(1.5)",
          })
          .to({}, { duration: 0.3 });
      });
    },
    { scope: ref },
  );

  return (
    <section id="voz" ref={ref} className="section-pad relative">
      <div className="shell grid items-center gap-14 lg:grid-cols-[1fr_auto]">
        {/* Copy editorial */}
        <div>
          <span className="eyebrow" data-reveal>
            {feel.eyebrow}
          </span>
          <RevealText as="h2" text={feel.title} className="text-h2 mt-5 max-w-[14ch]" />
          <p className="text-lead mt-6 max-w-md" data-reveal>
            {feel.lead}
          </p>
          <p className="text-body-lg mt-6 max-w-md text-text-soft" data-reveal>
            Rioplatense de verdad. Cita lo que recuerda, repregunta cuando hace falta,
            y no rellena con frases hechas.
          </p>
        </div>

        {/* Teléfono */}
        <div className="cv-phone mx-auto w-[310px]">
          <div className="rounded-[44px] border border-hair bg-night-2 p-3 shadow-[var(--shadow-lifted)]">
            <div className="flex h-[580px] flex-col overflow-hidden rounded-[34px] bg-[#0e1320]">
              {/* Header */}
              <div className="flex items-center gap-2.5 border-b border-hair px-4 py-3.5">
                <YnaraMark size={26} variant="gradient" />
                <div>
                  <p className="font-display text-sm font-semibold text-text-bright">
                    Ynara
                  </p>
                  <p className="text-[10px] text-text-muted">en línea</p>
                </div>
              </div>

              {/* Chat */}
              <div className="flex flex-1 flex-col justify-end gap-2 px-3.5 py-4">
                {CONVO.map((c, e) => (
                  <div key={c.user} className="flex flex-col gap-1.5">
                    <span
                      className={`cv-mode-${e} self-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]`}
                      style={{ color: c.color, background: `${c.color}1f` }}
                    >
                      {c.mode}
                    </span>
                    <div
                      className={`cv-user-${e} max-w-[80%] self-end rounded-2xl rounded-br-md bg-blue px-3.5 py-2 text-[13px] text-white`}
                    >
                      {c.user}
                    </div>
                    <div
                      className={`cv-type cv-type-${e} flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-md border border-hair bg-white/[0.04] px-3 py-2.5`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                    </div>
                    <div
                      className={`cv-bot-${e} max-w-[82%] self-start rounded-2xl rounded-bl-md border border-hair bg-white/[0.05] px-3.5 py-2 text-[13px] text-text`}
                    >
                      {c.ynara}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
