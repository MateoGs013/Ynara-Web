"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d02 } from "@/content/deck";
import "./Slide02.css";

/**
 * L02 · Presentar la marca — la categoría en una frase. Mundo oscuro, registro
 * calma. Los cuatro ejes de Ynara (Productividad · Memoria · Compañía ·
 * Adaptación) como statement masivo apilado, entrando en cascada (data-reveal
 * por palabra). El 4to lleva el acento violeta de señal + el diamante de
 * presencia. Debajo, el sub. El alma tipográfica de la landing, en una lámina.
 */
export function Slide02() {
  const last = d02.verbs.length - 1;

  return (
    <Slide index={1} contentClassName="s02">
      <DeckEyebrow>{d02.eyebrow}</DeckEyebrow>

      <ul className="s02__verbs" aria-label="Los cuatro ejes de Ynara">
        {d02.verbs.map((verb, i) => {
          const isAdvise = i === last;
          return (
            <li className={`s02__verb${isAdvise ? " is-advise" : ""}`} data-reveal key={verb}>
              {verb}
              {isAdvise && <span className="s02__diamond" aria-hidden />}
            </li>
          );
        })}
      </ul>

      <p className="deck-lead s02__sub" data-reveal>
        {d02.sub}
      </p>
    </Slide>
  );
}
