"use client";

import { useRef } from "react";
import FlowField from "@/components/atmosphere/FlowField";
import { Curtain } from "@/components/motion/Curtain";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { cta } from "@/content/ynara";
import { useReveal } from "@/lib/useReveal";

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section id="descargar" ref={ref} className="section-pad relative overflow-hidden">
      <Curtain tint="rgba(75,126,230,0.48)" />
      <div className="shell">
        <div className="surface-card-2 relative overflow-hidden px-6 py-20 text-center md:py-28">
          {/* Atmósfera dentro del panel */}
          <div className="absolute inset-0 -z-[1] opacity-60">
            <FlowField density={0.85} speed={0.9} />
          </div>
          <div
            aria-hidden
            className="-translate-x-1/2 pointer-events-none absolute left-1/2 top-0 h-[420px] w-[620px] max-w-full"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(75,126,230,0.22), transparent 70%)",
            }}
          />

          <div className="relative">
            <span className="eyebrow eyebrow--center" data-reveal>
              {cta.eyebrow}
            </span>
            <RevealText
              as="h2"
              text={cta.title}
              className="text-display mx-auto mt-6 max-w-[15ch]"
            />
            <p className="text-lead mx-auto mt-6 max-w-[48ch]" data-reveal>
              {cta.lead}
            </p>

            <div className="mt-9 flex flex-col items-center gap-4" data-reveal>
              <Magnetic strength={0.5}>
                <Button href={cta.primary.href} size="lg">
                  {cta.primary.label}
                </Button>
              </Magnetic>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {cta.stores.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
