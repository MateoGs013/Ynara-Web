/**
 * Capa de atmósfera nocturna global — glows radiales de marca + grano.
 * Fija detrás de todo el contenido. Pura CSS (sin JS).
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 -z-10"
      style={{
        background: [
          "radial-gradient(55% 45% at 50% -8%, rgba(47,90,166,0.20), transparent 70%)",
          "radial-gradient(40% 40% at 88% 12%, rgba(124,79,163,0.10), transparent 72%)",
          "radial-gradient(45% 45% at 8% 82%, rgba(74,156,140,0.06), transparent 72%)",
          "linear-gradient(180deg, #0a0c12 0%, #0c0f18 45%, #0a0c12 100%)",
        ].join(","),
      }}
    />
  );
}
