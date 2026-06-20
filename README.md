# Ynara · sitio

Experiencia web inmersiva para **Ynara** — el asistente personal adaptativo con
memoria propia (tesis Da Vinci 2026). No es una página de secciones: es **un objeto
vivo de luz** que se transforma mientras se recorre.

## La idea

Una sola **forma generativa 3D** (WebGL) persiste de principio a fin y **morfea con
el scroll** a través de 8 capítulos — olas de luz → red de puntos → plenitud. La
tipografía masiva entra como voz. Paleta de marca _locked_: el drama nace del
contraste de valor, la escala y el movimiento, no de colores nuevos.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · three.js 0.164 ·
GSAP 3.15 (ScrollTrigger + SplitText) · Lenis · Biome.

## Arquitectura

```
src/
  app/                  layout (Field persistente) · page · SEO (robots, sitemap, OG)
  components/
    field/              LA FORMA y su motor
      CascadeField.tsx  terreno de luz WebGL (PlaneGeometry muy subdividido + shaders
                        simplex-noise Ashima, morfeo por scroll, mouse reactivo)
      Field.tsx         canvas fija detrás de todo + base void + grano
    journey/            los capítulos tejidos sobre la forma
    lib/
      motion/           utilidades GSAP / ScrollTrigger
      reveal/           RevealText y primitivos de animación
      cn/               classname helper
    ui/ site/           primitivos (YnaraMark, SiteNav, SiteFooter, Button…)
  content/ynara.ts      banco de copy (voz rioplatense)
```

El scroll no mueve cajas: **transforma la forma y el tipo**. `CascadeField` es el
corazón WebGL — `PlaneGeometry` muy subdividido con `RawShaderMaterial` (simplex-noise
Ashima), conducido por el scroll de la página vía ScrollTrigger y montado por `Field`
detrás de todo. Los capítulos viven en `components/journey/*`.

## Desarrollo

```bash
pnpm dev        # http://localhost:3000
pnpm build      # build de producción
pnpm typecheck  # tsc --noEmit
pnpm lint       # biome
```

## Calidad

a11y AA (reduced-motion = frame estático + contenido completo, scrims de legibilidad,
foco visible, semántica), perf (DPR cap, pausa fuera de viewport, dispose, malla
liviana en mobile), SEO (metadata + JSON-LD + OG + sitemap/robots), responsive real.
