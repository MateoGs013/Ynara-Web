"use client";

import dynamic from "next/dynamic";

// La forma es client-only (WebGL). Sin SSR para el canvas.
const LightForm = dynamic(() => import("./LightForm"), { ssr: false });

/**
 * Capa de fondo persistente: la FORMA de luz fija detrás de todo el contenido,
 * sobre la base void de marca. Vive de principio a fin; el scroll la morfea
 * (ver MasterScroll). El grano y la viñeta dan textura nocturna.
 */
export function Field() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Base void — casi negro, el lienzo del drama de valor. */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 80% at 50% 0%, #0c1018 0%, #0a0c12 55%, #08090e 100%)",
        }}
      />
      {/* La forma. */}
      <div className="absolute inset-0">
        <LightForm className="h-full w-full" />
      </div>
      {/* Viñeta para hundir los bordes y concentrar la luz al centro. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(8,9,14,0.55) 100%)",
        }}
      />
      {/* Grano sutil. */}
      <div className="grain absolute inset-0" />
    </div>
  );
}
