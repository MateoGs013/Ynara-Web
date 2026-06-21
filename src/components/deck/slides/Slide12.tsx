"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { d12 } from "@/content/deck";
import "./Slide12.css";

/**
 * L12 · Lanzamiento — en vivo (Nerdearla). Mundo oscuro, registro CALMA (azul).
 *
 * Telón de escenario: la foto real del escenario de Nerdearla va a sangre
 * completa de fondo (absolute, inset 0, object-fit cover), MUY atenuada y bajo
 * un velo navy→void para que el texto respire contraste AA. No se explica el
 * evento: se ENTRA en él. Encima, centrado, el statement protagónico
 * (deck-mega) y la marquesina venue + stage.
 *
 * El fondo NO lleva data-reveal (no debe parpadear): la cascada entra sólo en
 * el contenido. El <img> es decorativo del telón (aria-hidden vía figure), pero
 * conserva su alt para lectores que sí lo expongan.
 */
export function Slide12() {
  return (
    <Slide index={11} contentClassName="s12">
      {/* Telón: foto real a sangre completa, atenuada + velo oscuro. */}
      <figure className="s12__backdrop" aria-hidden>
        <img
          className="s12__photo"
          src={d12.image}
          alt={d12.imageAlt}
          loading="lazy"
          decoding="async"
        />
        <span className="s12__veil" />
      </figure>

      {/* Contenido (cascada): se ENTRA al escenario. */}
      <div className="s12__stage">
        <DeckEyebrow>{d12.eyebrow}</DeckEyebrow>

        <h2 className="deck-mega s12__statement" data-reveal>
          {d12.statement}
        </h2>

        <div className="s12__marquee" data-reveal>
          <span className="s12__rule" aria-hidden />
          <p className="s12__credits">
            <span className="deck-lead s12__venue">{d12.venue}</span>
            <span className="deck-meta s12__where">{d12.stage}</span>
          </p>
          <span className="s12__rule" aria-hidden />
        </div>
      </div>
    </Slide>
  );
}
