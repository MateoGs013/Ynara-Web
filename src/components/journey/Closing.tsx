"use client";

import { useRef } from "react";
import { cta, pricing } from "@/content/ynara";
import { gsap, reducedMotion, registerGsap, useGSAP } from "@/lib/motion";
import { lineReveal } from "@/lib/reveal";

/**
 * Capítulo Cierre — el clímax. MUNDO CLARO (ivory). Layout distintivo: precio
 * EDITORIAL (no cards en caja, una franja Free/Premium) + un FINALE con el
 * signoff a escala masiva y el CTA principal. Cierra la venta.
 */
export function Closing() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;
      registerGsap();

      const eyebrow = root.querySelector<HTMLElement>(".cl-eyebrow");
      const priceHead = root.querySelector<HTMLElement>(".cl-price-head");
      const plans = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".cl-plan"));
      const heading = root.querySelector<HTMLElement>(".cl-heading");
      const finaleBits = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".cl-finale-aux"));

      if (eyebrow) {
        gsap.set(eyebrow, { opacity: 0, y: 14 });
        gsap.to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "clamp(top 80%)" },
        });
      }
      if (priceHead) lineReveal(priceHead, { y: "140%", rot: 2.2, dur: 1.1, stagger: 0.12 });

      for (const plan of plans) {
        const line = plan.querySelector<HTMLElement>(".cl-plan-rule");
        if (line) {
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          gsap.to(line, {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: plan, start: "clamp(top 88%)" },
          });
        }
        const bits = plan.querySelectorAll<HTMLElement>(
          ".cl-plan-name, .cl-plan-price, .cl-plan-feat",
        );
        gsap.set(bits, { opacity: 0, y: 18 });
        gsap.to(bits, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: plan, start: "clamp(top 86%)" },
        });
      }

      if (heading) lineReveal(heading, { y: "150%", rot: 2.5, dur: 1.3, stagger: 0.12 });
      if (finaleBits.length) {
        gsap.set(finaleBits, { opacity: 0, y: 18 });
        gsap.to(finaleBits, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".cl-finale", start: "clamp(top 78%)" },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="precio"
      className="cl relative"
      aria-label="Precio y cierre"
      data-wipe-tone="ivory"
    >
      <div className="cl-inner">
        {/* PRECIO — franja editorial */}
        <p className="cl-eyebrow">{pricing.eyebrow}</p>
        <h2 className="cl-price-head">{pricing.title}</h2>
        <div className="cl-plans">
          {pricing.plans.map((p) => (
            <div className={`cl-plan${p.featured ? " is-featured" : ""}`} key={p.name}>
              <span className="cl-plan-rule" aria-hidden />
              <div className="cl-plan-row">
                <h3 className="cl-plan-name">{p.name}</h3>
                <p className="cl-plan-price">
                  {p.price}
                  <span className="cl-plan-period"> · {p.period}</span>
                </p>
              </div>
              <ul className="cl-plan-feats">
                {p.features.map((f) => (
                  <li className="cl-plan-feat" key={f}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="cl-note">{pricing.note}</p>

        {/* FINALE — signoff masivo + CTA */}
        <div className="cl-finale">
          <h2 className="cl-heading">{cta.title}</h2>
          <p className="cl-finale-aux cl-body">{cta.statement}</p>
          <div className="cl-finale-aux cl-cta-row" id="descargar">
            <a className="cl-cta" href={cta.primary.href}>
              {cta.primary.label}
            </a>
            <span className="cl-stores">{cta.stores.join("  ·  ")}</span>
          </div>
        </div>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático local */}
      <style dangerouslySetInnerHTML={{ __html: CL_CSS }} />
    </section>
  );
}

const CL_CSS = `
  .cl {
    position: relative;
    z-index: 3;
    background: var(--c-ivory);
    color: var(--c-navy);
    padding: clamp(6svh, 9svh, 11svh) 0 clamp(8svh, 11svh, 13svh);
  }
  .cl-inner {
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
    padding: 0 6vw;
  }
  .cl-eyebrow {
    margin: 0 0 1.5rem;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.62rem, 0.72vw, 0.76rem);
    font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase;
    color: var(--c-ink-muted);
  }
  .cl-price-head {
    margin: 0 0 clamp(2.4rem, 4vw, 3.5rem);
    max-width: 16ch;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(2rem, 3.8vw, 4rem);
    line-height: 1.0; letter-spacing: -0.035em;
    color: var(--c-navy-deep);
  }
  /* franja de planes: dos columnas editoriales con regla que se dibuja */
  .cl-plans {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(1.5rem, 4vw, 4rem);
  }
  .cl-plan { position: relative; padding-top: 1.4rem; }
  .cl-plan-rule {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--c-ink-hair-strong);
  }
  .cl-plan.is-featured .cl-plan-rule { background: var(--c-violet); height: 3px; }
  .cl-plan-row { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; }
  .cl-plan-name {
    margin: 0;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600; font-size: clamp(1.4rem, 2.2vw, 2rem); letter-spacing: -0.02em;
    color: var(--c-navy-deep);
  }
  .cl-plan-price {
    margin: 0;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 600; font-size: clamp(1.05rem, 1.4vw, 1.3rem);
    color: var(--c-navy-deep);
  }
  .cl-plan.is-featured .cl-plan-price { color: var(--c-violet); }
  .cl-plan-period {
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-weight: 400; font-size: 0.82rem; color: var(--c-ink-muted);
  }
  .cl-plan-feats { list-style: none; margin: 0; padding: 0; }
  .cl-plan-feat {
    padding: 0.5rem 0;
    border-top: 1px solid var(--c-ink-hair);
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.95rem; color: var(--c-ink-soft);
  }
  .cl-note {
    margin: clamp(2rem, 3.4vw, 3rem) 0 0;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(0.62rem, 0.72vw, 0.76rem);
    font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--c-ink-muted);
  }

  /* FINALE */
  .cl-finale {
    margin-top: clamp(8svh, 14svh, 18svh);
    padding-top: clamp(3rem, 6vw, 6rem);
    border-top: 1px solid var(--c-ink-hair-2);
  }
  .cl-heading {
    margin: 0;
    font-family: var(--font-display), "Space Grotesk", system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(2.6rem, 7vw, 8rem);
    line-height: 0.94; letter-spacing: -0.045em;
    color: var(--c-navy-deep);
  }
  .cl-body {
    margin: clamp(1.6rem, 2.6vw, 2.4rem) 0 0;
    max-width: 54ch;
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: clamp(1rem, 1.2vw, 1.2rem);
    line-height: 1.6; color: var(--c-ink-soft);
  }
  .cl-cta-row { display: flex; align-items: center; gap: 1.6rem; flex-wrap: wrap; margin-top: clamp(2rem, 3.4vw, 3rem); }
  .cl-cta {
    display: inline-flex; align-items: center;
    padding: 1.05rem 2.2rem; border-radius: 999px;
    background: var(--c-navy-deep); color: var(--c-ivory);
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 1rem; font-weight: 600; text-decoration: none;
    transition: transform 0.35s cubic-bezier(0.77,0,0.175,1), background 0.35s cubic-bezier(0.77,0,0.175,1);
  }
  .cl-cta:hover { background: var(--c-blue); transform: translateY(-2px); }
  .cl-stores {
    font-family: var(--font-body), "DM Sans", system-ui, sans-serif;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--c-ink-muted);
  }
  @media (max-width: 900px) {
    .cl-plans { grid-template-columns: 1fr; gap: 2.4rem; }
    .cl-heading { font-size: clamp(2.6rem, 12vw, 4rem); }
  }
`;
