"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d16 } from "@/content/deck";
import "./Slide16.css";

/**
 * L16 · Promoción — objetos. Mundo marfil, registro CALMA. "La marca que se
 * toca." Grilla 3×2 de renders reales de producto (Funda, Soporte-cargador,
 * Lapicera, Remera, Buzo, Tote): la identidad hecha objeto. Cada tarjeta es un
 * contenedor de aspect-ratio fijo con la imagen a object-fit cover y el nombre
 * como rótulo sobreimpreso. 3 columnas en desktop, cae a 2 y 1 en mobile.
 * Cascada de reveals card por card.
 */
export function Slide16({ index }: { index: number }) {
  return (
    <Slide index={index} contentClassName="s16">
      <div className="s16__head">
        <DeckEyebrow>{d16.eyebrow}</DeckEyebrow>
        <h2 className="deck-title s16__statement" data-reveal>
          {d16.statement}
        </h2>
      </div>

      <ul className="s16__grid">
        {d16.objects.map((obj, i) => (
          <li className="s16__cell" data-reveal key={obj.img}>
            <figure className="s16__card">
              <span className="s16__num" aria-hidden>{`0${i + 1}`}</span>
              <div className="s16__frame">
                <img
                  className="s16__img"
                  src={obj.img}
                  alt={obj.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="s16__label">{obj.name}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Slide>
  );
}
