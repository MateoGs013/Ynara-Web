"use client";

import { useRef } from "react";
import { Curtain } from "@/components/motion/Curtain";
import { name } from "@/content/ynara";
import { useReveal } from "@/lib/useReveal";
import { SectionHeader } from "./SectionHeader";

export function NameSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section id="nombre" ref={ref} className="section-pad relative overflow-hidden">
      <Curtain tint="rgba(91,111,179,0.4)" />
      <div className="shell">
        <SectionHeader eyebrow={name.eyebrow} title={name.title} lead={name.lead} />

        {/* Etimología: *aen- + -ara = Ynara */}
        <div
          className="mt-16 flex flex-col items-stretch gap-4 md:flex-row md:items-center"
          data-reveal-group
        >
          {name.etymology.map((e, i) => (
            <div key={e.part} className="flex flex-1 items-center gap-4">
              <div className="surface-card flex-1 p-7" data-reveal>
                <p className="font-display text-3xl font-semibold text-text-bright">
                  {e.part}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-acc">
                  {e.origin}
                </p>
                <p className="text-body-lg mt-3">{e.meaning}</p>
              </div>
              <span
                aria-hidden
                className="font-display text-2xl text-text-muted"
                data-reveal
              >
                {i === 0 ? "+" : "="}
              </span>
            </div>
          ))}
          <div
            className="surface-card-2 flex-1 p-7"
            style={{ boxShadow: "var(--glow-blue)" }}
            data-reveal
          >
            <p className="font-display text-3xl font-semibold text-gradient-blue">
              Ynara
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-acc">
              Resultado
            </p>
            <p className="text-body-lg mt-3 text-text">{name.result}</p>
          </div>
        </div>

        {/* Pull quote */}
        <blockquote
          className="mx-auto mt-20 max-w-3xl text-center text-h3 font-display text-text-bright"
          data-reveal
        >
          “{name.pull}”
        </blockquote>

        {/* Tres cualidades */}
        <div className="mt-16 grid gap-4 md:grid-cols-3" data-reveal-group>
          {name.qualities.map((q) => (
            <div key={q.title} className="surface-card p-7" data-reveal>
              <h3 className="text-h3">{q.title}</h3>
              <p className="text-body-lg mt-3">{q.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
