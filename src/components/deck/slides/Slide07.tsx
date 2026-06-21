"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d07 } from "@/content/deck";
import "./Slide07.css";

/**
 * L07 · Landing — la página. Mundo oscuro, registro CALMA (azul). Dos columnas:
 * a la izquierda el statement "De curioso a usuario fiel." + support; a la
 * derecha un marco tipo ventana de browser (chrome con tres puntos) que enmarca
 * la captura principal de la landing (shots[0]) y, debajo, una fila con dos
 * miniaturas (shots[1] y shots[2]). Las imágenes son las protagonistas; el
 * texto sólo encuadra. Cascada de reveals; apila bajo ~820px.
 */
export function Slide07() {
  const [hero, ...thumbs] = d07.shots;

  return (
    <Slide index={6} contentClassName="s07">
      <div className="s07__text">
        <DeckEyebrow>{d07.eyebrow}</DeckEyebrow>
        <h2 className="deck-title" data-reveal>
          {d07.statement}
        </h2>
        <p className="deck-lead" data-reveal>
          {d07.support}
        </p>
      </div>

      <div className="s07__gallery">
        <figure className="s07__window" data-reveal>
          <div className="s07__chrome" aria-hidden>
            <span className="s07__dot" />
            <span className="s07__dot" />
            <span className="s07__dot" />
            <span className="s07__addr" />
          </div>
          <div className="s07__screen">
            <img
              className="s07__shot"
              src={hero.img}
              alt={hero.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>

        <div className="s07__thumbs" data-reveal>
          {thumbs.map((shot) => (
            <figure className="s07__thumb" key={shot.img}>
              <img
                className="s07__thumb-shot"
                src={shot.img}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </Slide>
  );
}
