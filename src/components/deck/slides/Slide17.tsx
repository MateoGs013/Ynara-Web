"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d17 } from "@/content/deck";
import "./Slide17.css";

/**
 * L17 · Lo que viene — roadmap. Mundo marfil, registro CALMA. "Subirte ahora es
 * entrar antes que nadie." Línea de tiempo de 3 etapas (MVP·Hoy / V2 / V3): la
 * primera es el presente (resaltada), las siguientes son futuras (atenuadas).
 * Cada etapa entra en cascada (data-reveal).
 */
export function Slide17() {
  return (
    <Slide index={16} contentClassName="s17">
      <div className="s17__head">
        <DeckEyebrow>{d17.eyebrow}</DeckEyebrow>
        <h2 className="deck-title s17__statement" data-reveal>
          {d17.statement}
        </h2>
      </div>

      <ol className="s17__timeline">
        {d17.roadmap.map((stage, i) => {
          const present = i === 0;
          return (
            <li
              className={`s17__stage${present ? " is-present" : " is-future"}`}
              data-reveal
              key={stage.phase}
            >
              <span className="s17__marker" aria-hidden />
              <p className="s17__phase">
                {stage.phase}
                {present && <span className="s17__now">Ahora</span>}
              </p>
              <h3 className="s17__when">{stage.when}</h3>
              <p className="s17__body">{stage.body}</p>
            </li>
          );
        })}
      </ol>
    </Slide>
  );
}
