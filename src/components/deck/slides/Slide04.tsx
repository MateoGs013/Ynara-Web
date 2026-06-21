"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d04 } from "@/content/deck";
import "./Slide04.css";

/**
 * L04 · Storytelling — el caos con humor. Mundo oscuro, registro CAOS (violeta).
 * El colapso 8→1 del capítulo Problem, en versión quieta de lámina: ocho apps
 * dispersas como chips (cascada) que no se hablan, contra "Ynara es una." en
 * grande. Los tres beats firman, irónicos, al pie.
 */
export function Slide04() {
  return (
    <Slide index={3} contentClassName="s04">
      <div className="s04__chaos">
        <DeckEyebrow>{d04.eyebrow}</DeckEyebrow>
        <p className="deck-lead s04__problem" data-reveal>
          {d04.problemLine}
        </p>
        <ul className="s04__chips" aria-label="Las ocho apps dispersas">
          {d04.apps.map((app, i) => (
            <li
              className="s04__chip"
              data-reveal
              key={app}
              style={{ "--i": i } as React.CSSProperties}
            >
              {app}
            </li>
          ))}
        </ul>
      </div>

      <div className="s04__answer">
        <p className="deck-title s04__one" data-reveal>
          {d04.answerLine}
        </p>
      </div>

      <ul className="s04__beats" aria-label="Apuntes del caos cotidiano">
        {d04.beats.map((beat) => (
          <li className="deck-meta s04__beat" data-reveal key={beat}>
            {beat}
          </li>
        ))}
      </ul>
    </Slide>
  );
}
