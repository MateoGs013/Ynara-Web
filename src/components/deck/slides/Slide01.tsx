"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { Slide } from "@/components/deck/Slide";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { d01 } from "@/content/deck";
import "./Slide01.css";

/**
 * L01 · Presentarnos — portada. Mundo oscuro. Lockup isotipo `gradient` +
 * wordmark colosal "Ynara" anclado abajo (layout del Hero). Tagline arriba,
 * autores + Da Vinci 2026 al pie.
 */
export function Slide01() {
  return (
    <Slide index={0} contentClassName="s01">
      <div className="s01__top">
        <DeckEyebrow>{d01.eyebrow}</DeckEyebrow>
        <p className="s01__tagline" data-reveal>
          {d01.tagline}
        </p>
      </div>

      <div className="s01__lockup" data-reveal>
        <YnaraMark className="s01__mark" size={130} variant="gradient" />
        <span className="s01__wordmark">{d01.wordmark}</span>
      </div>

      <div className="s01__foot">
        <p className="s01__authors" data-reveal>
          {d01.authors.join("  ·  ")}
        </p>
        <p className="deck-meta" data-reveal>
          {d01.meta}
        </p>
      </div>
    </Slide>
  );
}
