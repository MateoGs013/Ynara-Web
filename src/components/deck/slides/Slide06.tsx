"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { d06 } from "@/content/deck";
import "./Slide06.css";

/**
 * L06 · Desarrollo de la marca — nombre + logo. Mundo oscuro, registro NODOS.
 * Lockup protagónico (isotipo gradient + wordmark, misma proporción), etimología
 * honesta y el SISTEMA VISUAL de marca mostrado, no descripto: el significado
 * del logo (figura / diamante) + las muestras de color y las tipografías.
 */
export function Slide06() {
  return (
    <Slide index={5} contentClassName="s06">
      <DeckEyebrow>{d06.eyebrow}</DeckEyebrow>

      <div className="s06__lockup" data-reveal>
        <YnaraMark className="s06__mark" size={120} variant="gradient" />
        <span className="s06__wordmark">{d06.wordmark}</span>
      </div>

      <p className="deck-lead s06__etymology" data-reveal>
        {d06.etymology}
      </p>

      <div className="s06__system">
        {/* Significado del logo */}
        <dl className="s06__defs" data-reveal>
          {d06.notes.map((item) => (
            <div className="s06__def" key={item.k}>
              <dt className="s06__key">{item.k}</dt>
              <dd className="s06__val">{item.v}</dd>
            </div>
          ))}
        </dl>

        {/* Colores: muestras de la paleta de marca */}
        <div className="s06__block" data-reveal>
          <span className="s06__block-label">Color</span>
          <ul className="s06__swatches">
            {d06.palette.map((c) => (
              <li className="s06__swatch" key={c.name}>
                <span className="s06__chip" style={{ background: c.token }} aria-hidden />
                <span className="s06__chip-name">{c.name}</span>
                <span className="s06__chip-hex">{c.hex}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tipografías: muestra real de cada familia */}
        <div className="s06__block" data-reveal>
          <span className="s06__block-label">Tipografía</span>
          <ul className="s06__fonts">
            {d06.typefaces.map((t) => (
              <li className="s06__font" key={t.name}>
                <span className="s06__font-sample" style={{ fontFamily: t.varName }}>
                  Aa
                </span>
                <span className="s06__font-meta">
                  <span className="s06__font-name" style={{ fontFamily: t.varName }}>
                    {t.name}
                  </span>
                  <span className="s06__font-role">{t.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Slide>
  );
}
