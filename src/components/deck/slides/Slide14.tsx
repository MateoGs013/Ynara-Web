"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { d14 } from "@/content/deck";
import "./Slide14.css";

/**
 * L14 · Promoción — redes (Instagram). Mundo oscuro, registro CAOS.
 * Texto a la izquierda enmarca; las 4 publicaciones reales (9:16) son la
 * protagonista, en fila tipo pantalla de teléfono. El logo sólo firma el handle.
 */
export function Slide14({ index }: { index: number }) {
  return (
    <Slide index={index} contentClassName="s14">
      <div className="s14__text">
        <DeckEyebrow>{d14.eyebrow}</DeckEyebrow>
        <h2 className="deck-h2" data-reveal>
          {d14.statement}
        </h2>
        <p className="deck-lead" data-reveal>
          {d14.support}
        </p>
        <p className="deck-meta s14__handle" data-reveal>
          <YnaraMark size={24} variant="ivory" className="s14__mark" />
          <span className="s14__at">{d14.handle}</span>
        </p>
      </div>

      <ul className="s14__feed">
        {d14.posts.map((post, i) => (
          <li
            className={i === 0 ? "s14__post s14__post--hero" : "s14__post"}
            data-reveal
            key={post.img}
          >
            <img
              className="s14__img"
              src={post.img}
              alt={post.alt}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </Slide>
  );
}
