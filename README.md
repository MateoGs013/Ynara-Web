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
  app/                  layout (Field + MasterScroll persistentes) · page (8 escenas) · SEO
  components/
    field/              LA FORMA y su motor
      LightForm.tsx     terreno de luz WebGL (simplex-noise Ashima, morfeo, mouse)
      fieldState.ts     estado compartido (single source of truth del morfeo)
      MasterScroll.tsx  UN ScrollTrigger scrubbeado que tweenea fieldTarget por capítulo
      Field.tsx         canvas fija detrás de todo + base void + grano
    scenes/             los 8 capítulos tejidos sobre la forma (Scene + SplitReveal)
    motion/ ui/ site/   primitivos (RevealText, Magnetic, Button, YnaraMark, nav, footer)
  content/ynara.ts      banco de copy (voz rioplatense)
```

El scroll no mueve cajas: **transforma la forma y el tipo**. `MasterScroll` conduce
los uniforms (amplitud, estado wave↔dots↔plano, brillo, tint de modo, cámara);
`LightForm` los lee y lerpea cada frame.

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
