"use client";

import { useRef } from "react";
import WebGLWaves from "@/components/atmosphere/WebGLWaves";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { hero, site } from "@/content/ynara";
import { EASE, EASE_EXPO, gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = root.current;
      if (!el) return;

      if (reducedMotion()) {
        gsap.set("[data-hero]", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Entrada coreografiada — pausada hasta que el telón se levanta.
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
      tl.from("[data-hero-mark]", { opacity: 0, scale: 0.7, duration: 1.3, ease: EASE_EXPO }, 0)
        .from("[data-hero-glow]", { opacity: 0, scale: 0.5, duration: 1.6, ease: EASE_EXPO }, 0)
        .from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: 0.7 }, 0.3)
        .from("[data-hero-lead]", { opacity: 0, y: 20, duration: 0.85 }, 0.8)
        .from("[data-hero-cta] > *", { opacity: 0, y: 18, duration: 0.7, stagger: 0.1 }, 0.95)
        .from("[data-hero-badge]", { opacity: 0, y: 12, duration: 0.6 }, 1.1)
        .from("[data-hero-verbs]", { opacity: 0, y: 16, duration: 0.8 }, 1.2);

      const start = () => tl.play();
      let cleanup = () => {};
      if (window.__ynaraIntroDone) {
        start();
      } else {
        const fallback = gsap.delayedCall(6, start);
        const onDone = () => {
          fallback.kill();
          start();
        };
        window.addEventListener("ynara:intro-done", onDone, { once: true });
        cleanup = () => {
          fallback.kill();
          window.removeEventListener("ynara:intro-done", onDone);
        };
      }

      // Float del mark — pausado fuera de viewport.
      gsap.to("[data-hero-mark]", {
        y: -12,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });

      // Parallax de salida al scrollear.
      const px = (sel: string, vars: gsap.TweenVars) =>
        gsap.to(sel, {
          ...vars,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
        });
      px("[data-hero-title-px]", { yPercent: -24, opacity: 0.25 });
      px("[data-hero-mark-px]", { yPercent: -45, opacity: 0 });

      // Constelación reactiva al cursor (parallax de profundidad).
      if (window.matchMedia("(pointer: fine)").matches) {
        const mk = (sel: string, amt: number) => ({
          x: gsap.quickTo(sel, "x", { duration: 0.7, ease: "power3" }),
          y: gsap.quickTo(sel, "y", { duration: 0.7, ease: "power3" }),
          amt,
        });
        const field = mk("[data-hero-field-m]", 14);
        const glow = mk("[data-hero-glow]", 28);
        const mark = mk("[data-hero-mark-m]", -46);
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const l of [field, glow, mark]) {
            l.x(nx * l.amt);
            l.y(ny * l.amt);
          }
        };
        el.addEventListener("pointermove", onMove);
        const prev = cleanup;
        cleanup = () => {
          prev();
          el.removeEventListener("pointermove", onMove);
        };
      }

      return cleanup;
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Terreno de luz WebGL */}
      <div data-hero-field className="absolute inset-0 -z-[1]">
        <div data-hero-field-m className="h-full w-full">
          <WebGLWaves />
        </div>
      </div>

      {/* Scrim de contraste — el manual manda claridad/legibilidad del título */}
      <div
        aria-hidden
        className="-z-[1] pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,12,18,0.94) 0%, rgba(10,12,18,0.6) 40%, rgba(10,12,18,0) 70%)",
        }}
      />

      {/* Mark como plano luminoso, desplazado a la derecha (asimetría) */}
      <div
        data-hero-mark-px
        className="-z-[1] -translate-y-1/2 absolute top-[46%] right-[-7%] hidden lg:block"
      >
        <div data-hero-mark-m>
          <div
            data-hero-glow
            aria-hidden
            className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 h-[640px] w-[640px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(75,126,230,0.26), rgba(47,90,166,0.08) 42%, transparent 70%)",
            }}
          />
          <div data-hero-mark data-hero>
            <YnaraMark size={400} variant="gradient" />
          </div>
        </div>
      </div>

      {/* Glow ambiental para mobile (sin el mark gigante) */}
      <div
        aria-hidden
        className="-z-[1] -translate-x-1/2 pointer-events-none absolute top-[30%] left-1/2 h-[420px] w-[420px] rounded-full lg:hidden"
        style={{
          background:
            "radial-gradient(circle, rgba(75,126,230,0.18), transparent 70%)",
        }}
      />

      {/* Contenido — asimétrico, alineado a la izquierda */}
      <div className="shell relative w-full pt-28 pb-32">
        <span data-hero-eyebrow data-hero className="eyebrow">
          {hero.eyebrow}
        </span>

        <div data-hero-title-px className="mt-7">
          <RevealText
            as="h1"
            text={hero.title}
            markup
            play="intro"
            stagger={0.07}
            className="max-w-[15ch] font-display font-bold leading-[0.88] tracking-[-0.045em] text-text-bright text-[clamp(3rem,10vw,9.5rem)]"
          />
        </div>

        <div className="mt-10 flex max-w-4xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <p data-hero-lead data-hero className="text-lead max-w-md">
            {hero.lead}
          </p>
          <div data-hero-cta className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.5}>
              <Button href={hero.ctaPrimary.href} size="lg">
                {hero.ctaPrimary.label}
              </Button>
            </Magnetic>
            <Button href={hero.ctaSecondary.href} size="lg" variant="ghost">
              {hero.ctaSecondary.label} →
            </Button>
          </div>
        </div>

        <div data-hero-badge data-hero className="mt-8">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-bright" />
            {hero.badge}
          </span>
        </div>
      </div>

      {/* Riel de verbos */}
      <div
        data-hero-verbs
        className="absolute inset-x-0 bottom-0 border-t border-hair"
      >
        <div className="shell flex items-center justify-between gap-4 py-5">
          {site.verbs.map((v) => (
            <span
              key={v}
              className="font-display text-xs font-medium tracking-[0.08em] text-text-soft sm:text-sm"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
