"use client";

import { useRef } from "react";
import NodeField from "@/components/atmosphere/NodeField";
import { Curtain } from "@/components/motion/Curtain";
import { memory } from "@/content/ynara";
import { useReveal } from "@/lib/useReveal";
import { SectionHeader } from "./SectionHeader";

export function MemorySection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section id="memoria" ref={ref} className="section-pad relative overflow-hidden">
      <Curtain tint="rgba(124,79,163,0.42)" />
      {/* Campo de nodos sutil — la memoria como red */}
      <div className="absolute inset-0 -z-[1] opacity-40">
        <NodeField density={0.7} />
      </div>

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={memory.eyebrow}
              title={memory.title}
              lead={memory.lead}
            />
            <p className="mt-8 max-w-md text-h3 font-display text-text-bright" data-reveal>
              “{memory.pull}”
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5" data-reveal-group>
              {memory.privacy.map((p) => (
                <span key={p} className="chip" data-reveal>
                  <span className="h-1.5 w-1.5 rounded-full bg-jade" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Tres capas de memoria */}
          <div className="flex flex-col gap-3" data-reveal-group>
            {memory.layers.map((l, i) => (
              <div
                key={l.title}
                className="surface-card flex items-start gap-5 p-6"
                data-reveal
              >
                <span className="mt-1 font-display text-sm font-semibold text-text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="mt-2 h-2 w-2 flex-none rounded-full"
                  style={{
                    background: "var(--c-violet-to)",
                    boxShadow: "0 0 12px var(--c-violet-from)",
                  }}
                />
                <div>
                  <h3 className="text-h3">{l.title}</h3>
                  <p className="text-body-lg mt-1.5">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
