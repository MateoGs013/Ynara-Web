"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d15 } from "@/content/deck";
import "./Slide15.css";

/**
 * L15 · Promoción — la calle (vía pública). Mundo oscuro, registro CAOS.
 * "Tu propio caos, en la calle." Encabezado breve + galería 2×2 de los 4
 * renders de OOH (cartel, andén, tótem, parada). Los renders llegan con aspect
 * ratios mixtos (apaisados + verticales): los homogeneizamos con marcos 4/3 +
 * object-fit cover, cada uno rotulado y con tilde de acento del registro. Cae
 * a 1 columna en mobile. Cascada de reveals tile por tile.
 */
export function Slide15() {
  return (
    <Slide index={14} contentClassName="s15">
      <header className="s15__head">
        <DeckEyebrow>{d15.eyebrow}</DeckEyebrow>
        <h2 className="deck-h2 s15__statement" data-reveal>
          {d15.statement}
        </h2>
        <p className="deck-lead s15__support" data-reveal>
          {d15.support}
        </p>
      </header>

      <ul className="s15__grid">
        {d15.ooh.map((o) => (
          <li className="s15__cell" data-reveal key={o.img}>
            <figure className="s15__figure">
              <div className="s15__frame">
                <img
                  className="s15__img"
                  src={o.img}
                  alt={o.label}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="deck-meta s15__label">
                <span className="s15__tick" aria-hidden />
                {o.label}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Slide>
  );
}
