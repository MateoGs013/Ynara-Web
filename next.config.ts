import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: `next build` emite `out/` con HTML prerenderizado (el sitio
  // es 100% estático, sin runtime de Node). Se sirve con nginx en Coolify/VPS.
  output: "export",
  // El indicador de dev de Next cae por defecto en bottom-left, justo sobre la
  // firma de marca del deck (logo + "Ynara"). Lo movemos a top-right para no
  // pisarla (abajo-derecha ya lo ocupa el contador). Solo afecta a `next dev`.
  devIndicators: {
    position: "top-right",
  },
  experimental: {
    optimizePackageImports: ["three", "gsap", "lenis"],
  },
};

export default nextConfig;
