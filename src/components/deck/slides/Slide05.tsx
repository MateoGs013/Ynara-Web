"use client";

import { DeckEyebrow } from "@/components/deck/DeckEyebrow";
import { NodeField } from "@/components/deck/NodeField";
import { Slide } from "@/components/deck/Slide";
import { d05 } from "@/content/deck";
import "./Slide05.css";

/**
 * L05 · Desarrollo de marca — la corriente. Mundo oscuro, registro NODES
 * (acento violeta). EL momento del campo: foreground mínimo, mucho vacío, todo
 * a un lado para que la seda/nodos del fondo cuenten el concepto. El NodeField
 * violeta entra como textura tenue detrás del texto; el statement y el support
 * van verbatim de d05.
 */
export function Slide05() {
  return (
    <Slide index={4} contentClassName="s05">
      <div className="s05__block">
        <NodeField className="s05__field" />

        <DeckEyebrow>{d05.eyebrow}</DeckEyebrow>

        <h2 className="deck-title s05__statement" data-reveal>
          {d05.statement}
        </h2>

        <div className="s05__lead-wrap">
          <p className="deck-lead s05__support" data-reveal>
            {d05.support}
          </p>
        </div>
      </div>
    </Slide>
  );
}
