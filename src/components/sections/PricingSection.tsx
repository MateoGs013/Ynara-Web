"use client";

import { useRef } from "react";
import { Curtain } from "@/components/motion/Curtain";
import { Button } from "@/components/ui/Button";
import { pricing } from "@/content/ynara";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/useReveal";
import { SectionHeader } from "./SectionHeader";

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section id="precio" ref={ref} className="section-pad relative overflow-hidden">
      <Curtain tint="rgba(47,90,166,0.42)" />
      <div className="shell">
        <SectionHeader
          center
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          lead={pricing.lead}
        />

        <div
          className="mx-auto mt-16 grid max-w-3xl gap-5 md:grid-cols-2"
          data-reveal-group
        >
          {pricing.plans.map((plan) => (
            <div
              key={plan.name}
              data-reveal
              className={cn(
                "relative flex flex-col p-8",
                plan.featured
                  ? "surface-card-2 border-blue/40"
                  : "surface-card",
              )}
              style={plan.featured ? { boxShadow: "var(--glow-blue)" } : undefined}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 chip border-blue/40 text-blue-bright">
                  Recomendado
                </span>
              )}
              <h3 className="text-h3">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-text-bright">
                  {plan.price}
                </span>
                <span className="text-caption">{plan.period}</span>
              </div>
              <ul className="mt-7 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-text-soft">
                    <span
                      aria-hidden
                      className="flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] text-blue-bright"
                      style={{ background: "rgba(75,126,230,0.16)" }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="#descargar"
                variant={plan.featured ? "primary" : "outline"}
                size="lg"
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-caption mt-8 text-center" data-reveal>
          {pricing.note}
        </p>
      </div>
    </section>
  );
}
