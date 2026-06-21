"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { d13 } from "@/content/deck";
import "./Slide13.css";

/**
 * L13 · Lanzamiento — la demo (actuada). Mundo oscuro, registro CALMA. Evoca el
 * hilo de chat de VoiceChapter pero en vidrio sobre nocturno: tres intercambios
 * (user → Ynara) que se arman solos en cascada. La pantalla respalda al orador
 * mientras actúa la demo "en treinta segundos". El Plan B va al pie, discreto.
 */
export function Slide13() {
  return (
    <Slide index={12} contentClassName="s13">
      <header className="s13__head">
        <DeckEyebrow>{d13.eyebrow}</DeckEyebrow>
        <h2 className="deck-h2 s13__statement" data-reveal>
          {d13.statement}
        </h2>
      </header>

      <div className="s13__panel" data-reveal>
        <div className="s13__bar">
          <YnaraMark className="s13__mark" size={22} variant="gradient" />
          <span className="s13__name">Ynara</span>
          <span className="s13__status">
            <span className="s13__pulse" aria-hidden />
            en vivo
          </span>
        </div>

        <ol className="s13__thread">
          {d13.chats.map((c) => (
            <li className="s13__turn" key={c.mode}>
              <span className="s13__mode" data-reveal>
                {c.mode}
              </span>
              <p className="s13__bubble s13__bubble--user" data-reveal>
                {c.user}
              </p>
              <p className="s13__bubble s13__bubble--ynara" data-reveal>
                {c.ynara}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <p className="deck-meta s13__fallback" data-reveal>
        {d13.fallback}
      </p>
    </Slide>
  );
}
