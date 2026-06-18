"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { nav } from "@/content/ynara";
import { reducedMotion } from "@/lib/motion";

/**
 * Chrome mínimo persistente (alma infinitefield): un CTA quieto arriba-derecha y
 * la marca arriba-izquierda que APARECE A SU ENCUENTRO cuando el wordmark del
 * hero sube y se encoge (fusión hero→nav, estilo tiwis). Nada de barra SaaS.
 *
 * Conmuta a tinta OSCURA cuando un panel wipe marfil pasa bajo el header, para
 * no quedar marfil-sobre-marfil (legibilidad AA del único CTA).
 */
export function SiteNav() {
  const [brandOp, setBrandOp] = useState(0);
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    if (reducedMotion()) {
      setBrandOp(1);
      return;
    }
    // Los paneles wipe marfil son estáticos tras el mount → cachear la lista.
    const ivoryWipes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-wipe-tone="ivory"]'),
    );
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      // La marca entra mientras el hero se funde (~0.4vh → 0.9vh de scroll).
      setBrandOp(Math.min(1, Math.max(0, (window.scrollY / vh - 0.4) / 0.5)));
      // ¿Hay un wipe marfil cubriendo la franja del header?
      let light = false;
      for (const w of ivoryWipes) {
        const r = w.getBoundingClientRect();
        if (r.top < 88 && r.bottom > 8) {
          light = true;
          break;
        }
      }
      setOnLight(light);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-[var(--gutter)] py-[clamp(1.25rem,4vh,2.25rem)]">
        <a
          href="#top"
          className="flex items-center gap-2.5 transition-opacity duration-200"
          aria-label="Ynara — inicio"
          style={{ opacity: brandOp, pointerEvents: brandOp > 0.5 ? "auto" : "none" }}
        >
          <YnaraMark size={26} variant={onLight ? "blue" : "ivory"} />
          <span
            className="font-display text-base font-semibold tracking-tight transition-colors duration-200"
            style={{ color: onLight ? "var(--c-navy)" : "var(--c-text-bright)" }}
          >
            Ynara
          </span>
        </a>

        <Button
          href={nav.cta.href}
          size="md"
          variant="outline"
          className={
            onLight
              ? "pointer-events-auto !border-transparent !bg-navy-deep !text-ivory hover:!bg-blue"
              : "pointer-events-auto"
          }
        >
          {nav.cta.label}
        </Button>
      </div>
    </header>
  );
}
