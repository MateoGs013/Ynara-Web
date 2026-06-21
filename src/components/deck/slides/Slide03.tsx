"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d03 } from "@/content/deck";
import "./Slide03.css";

/**
 * L03 · Storytelling — el problema (humano). Mundo oscuro, registro CAOS
 * (acento violeta). Empatía pura: "ese soy yo". El statement interpela grande
 * (deck-title); el support se desgrana en las cargas de la vida común y cierra
 * en el golpe "Lo cargás vos, en tu cabeza." Composición sobria, baja densidad:
 * deja ver el campo turbulento detrás (texto a la izquierda, aire a la derecha).
 *
 * Copy VERBATIM de d03: el support se parte por su propia puntuación para
 * enumerar la carga (los fragmentos reconstruyen el texto exacto). No se reescribe.
 */

// Separa la enumeración (antes del último punto) del cierre, sin tocar el texto.
const [enumPart, closingPart] = (() => {
  const i = d03.support.indexOf(". ");
  return [d03.support.slice(0, i + 1), d03.support.slice(i + 2)];
})();

// Fragmentos de la carga: cada coma es una cosa más que cargás. El último
// fragmento conserva el punto final del original; reunidos = enumPart exacto.
const burdens = enumPart.split(", ");

export function Slide03() {
  return (
    <Slide index={2} contentClassName="s03">
      <header className="s03__head">
        <DeckEyebrow>{d03.eyebrow}</DeckEyebrow>
        <h1 className="deck-title s03__statement" data-reveal>
          {d03.statement}
        </h1>
      </header>

      <div className="s03__load">
        <ul className="s03__burdens" aria-label="La carga mental de una vida común">
          {burdens.map((b, i) => (
            <li className="s03__burden" data-reveal key={b}>
              <span className="s03__count" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="s03__item">{b}</span>
            </li>
          ))}
        </ul>

        <p className="deck-lead s03__closing" data-reveal>
          {closingPart}
        </p>
      </div>
    </Slide>
  );
}
