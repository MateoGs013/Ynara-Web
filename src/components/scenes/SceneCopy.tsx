"use client";

import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  statement?: string;
  cta?: { label: string; href: string };
  align?: "left" | "right";
  /** Variante del CTA. */
  ctaVariant?: "primary" | "outline";
};

/**
 * Bloque editorial legible anclado a una esquina (alma tiwis: tipo gigante +
 * párrafo LEGIBLE al costado). Comunica de verdad — no es una micro-label.
 */
export function SceneCopy({
  eyebrow,
  statement,
  cta,
  align = "left",
  ctaVariant = "outline",
}: Props) {
  return (
    <div
      className={cn(
        "flex max-w-[42ch] flex-col gap-4",
        align === "right" && "items-end text-right",
      )}
    >
      <span className="corner-label">{eyebrow}</span>
      {statement ? <p className="text-lead text-pretty scrim-text">{statement}</p> : null}
      {cta ? (
        <Magnetic strength={0.4}>
          <Button
            href={cta.href}
            size="md"
            variant={ctaVariant}
            className="pointer-events-auto mt-1"
          >
            {cta.label}
          </Button>
        </Magnetic>
      ) : null}
    </div>
  );
}
