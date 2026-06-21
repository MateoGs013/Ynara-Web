/**
 * Banco de copy del DECK institucional (/presentacion) — 18 láminas en 11
 * secciones. Mismo canon de voz que `ynara.ts` (voseo, editorial, sin
 * tics de chatbot, sin emojis). Reusa la copy canónica de la landing donde
 * aplica y agrega lo que la landing no tiene (marca, evento, promoción, roadmap).
 *
 * Cambios de §8 aplicados: "Gratuito" (no "Gratis"), 4 verbos LOCKED con
 * Aconseja = intersección, precio en USD y ARS, etimología honesta (sin
 * asterisco, sin "Sara").
 */

import { feel, problem, site } from "@/content/ynara";

/* ──────────────────────────────────────────────────────────────────────────
 * META — fuente ÚNICA del orden, el mundo (oscuro/marfil), el registro
 * (caos/calma/nodos → color del acento) y la fase del campo WebGL por lámina.
 *
 * `field` = progress 0..1 del timeline maestro de CascadeField
 * (window.__setFieldProgress). Mapa de fases:
 *   ~0.05 olas turbulentas (CAOS) · ~0.30 seda serena · ~0.45 plano azul (CALMA)
 *   ~0.60 nodos + violeta (campo de nodos) · ~0.90 seda tenue de cierre.
 * El Deck interpola entre láminas → avanzar de una lámina caos a una calma
 * ES la morfología turbulento→sereno (el motor caos↔calma del brief).
 * ────────────────────────────────────────────────────────────────────────── */

export type DeckWorld = "dark" | "ivory";
export type DeckRegister = "chaos" | "calma" | "nodes";

export interface DeckSlideMeta {
  id: number; // 1..18
  section: string; // sección institucional (§5), para aria/nav
  title: string; // etiqueta corta para el índice
  world: DeckWorld;
  register: DeckRegister;
  field: number; // fase del campo (0..1)
}

export const DECK_SLIDES: readonly DeckSlideMeta[] = [
  { id: 1, section: "Presentarnos", title: "Ynara", world: "dark", register: "calma", field: 0.12 },
  {
    id: 2,
    section: "Presentar la marca",
    title: "Cuatro verbos",
    world: "dark",
    register: "calma",
    field: 0.3,
  },
  {
    id: 3,
    section: "Storytelling de la marca",
    title: "El problema",
    world: "dark",
    register: "chaos",
    field: 0.04,
  },
  {
    id: 4,
    section: "Storytelling de la marca",
    title: "Ocho apps",
    world: "dark",
    register: "chaos",
    field: 0.05,
  },
  {
    id: 5,
    section: "Desarrollo de la marca",
    title: "La corriente",
    world: "dark",
    register: "nodes",
    field: 0.55,
  },
  {
    id: 6,
    section: "Desarrollo de la marca",
    title: "Nombre + logo",
    world: "dark",
    register: "nodes",
    field: 0.62,
  },
  {
    id: 7,
    section: "Landing page",
    title: "La página",
    world: "dark",
    register: "calma",
    field: 0.4,
  },
  {
    id: 8,
    section: "Funcionalidades principales",
    title: "Tres pilares",
    world: "ivory",
    register: "calma",
    field: 0.45,
  },
  {
    id: 9,
    section: "Funcionalidades principales",
    title: "La app",
    world: "ivory",
    register: "calma",
    field: 0.45,
  },
  {
    id: 10,
    section: "Monetización",
    title: "Planes",
    world: "ivory",
    register: "calma",
    field: 0.45,
  },
  {
    id: 11,
    section: "Monetización",
    title: "Viabilidad",
    world: "ivory",
    register: "calma",
    field: 0.45,
  },
  {
    id: 12,
    section: "Lanzamiento",
    title: "En vivo",
    world: "dark",
    register: "calma",
    field: 0.22,
  },
  {
    id: 13,
    section: "Lanzamiento",
    title: "La demo",
    world: "dark",
    register: "calma",
    field: 0.3,
  },
  { id: 14, section: "Promoción", title: "Redes", world: "dark", register: "chaos", field: 0.05 },
  {
    id: 15,
    section: "Promoción",
    title: "La calle",
    world: "dark",
    register: "chaos",
    field: 0.06,
  },
  {
    id: 16,
    section: "Promoción",
    title: "Objetos",
    world: "ivory",
    register: "calma",
    field: 0.45,
  },
  {
    id: 17,
    section: "Próximas funcionalidades",
    title: "Roadmap",
    world: "ivory",
    register: "calma",
    field: 0.45,
  },
  { id: 18, section: "Cierre", title: "Cierre", world: "dark", register: "calma", field: 0.32 },
] as const;

export const TOTAL_SLIDES = DECK_SLIDES.length;

/** Color del acento (diamante de eyebrow, marcadores) por registro. §7: caos→violeta, calma→azul. */
export const REGISTER_ACCENT: Record<DeckRegister, string> = {
  chaos: "var(--c-violet)",
  calma: "var(--c-blue-bright)",
  nodes: "var(--c-violet)",
};

/* ──────────────────────────────────────────────────────────────────────────
 * CONTENIDO POR LÁMINA
 * ────────────────────────────────────────────────────────────────────────── */

// L01 · Presentarnos
export const d01 = {
  eyebrow: "Tesis Da Vinci · 2026",
  wordmark: site.name,
  tagline: site.tagline, // "Tu asistente personal con memoria."
  authors: ["Álvarez", "García", "Sonzogni"],
  meta: "Escuela Da Vinci · 2026",
} as const;

// L02 · El proyecto
export const d02 = {
  eyebrow: "Presentar la marca",
  // Los cuatro ejes de Ynara.
  verbs: ["Productividad", "Memoria", "Compañía", "Adaptación"],
  sub: "Una sola presencia que reemplaza el desorden.",
} as const;

// L03 · Storytelling — el problema (humano)
export const d03 = {
  eyebrow: "El problema",
  statement: "¿Vivís solo, trabajás y estudiás?",
  support:
    "La entrega del martes, el turno del médico, pagar la luz, contestarle a tu vieja, acordarte de comer. Lo cargás vos, en tu cabeza.",
} as const;

// L04 · Storytelling — el caos con humor
export const d04 = {
  eyebrow: "El problema",
  problemLine: problem.problemLine, // "Vivís entre ocho apps."
  answerLine: problem.answerLine, // "Ynara es una."
  apps: problem.apps, // las ocho apps dispersas
  beats: ["Un audio a las 2:47.", "47 pestañas abiertas.", "El pegamento sos vos."],
} as const;

// L05 · Desarrollo de marca — la corriente
export const d05 = {
  eyebrow: "Desarrollo de la marca",
  statement: "Tecnología que se siente como pensar.",
  support: "El desorden es esa misma luz, enredada. La calma es la luz, en orden.",
} as const;

// L06 · Desarrollo de marca — nombre + logo
export const d06 = {
  eyebrow: "La marca",
  wordmark: site.name,
  etymology: "De una raíz celta: uno, único. La única presencia que necesitás.",
  notes: [
    { k: "La figura", v: "Una Y que es un brote abriéndose. Memoria que crece." },
    { k: "El diamante", v: "La presencia: Ynara, ahí, atenta." },
  ],
  // Sistema visual: se MUESTRA, no se describe. Colores desde los tokens de marca.
  palette: [
    { name: "Azul", role: "Marca", token: "var(--c-blue)", hex: "#2F5AA6" },
    { name: "Violeta", role: "Señal", token: "var(--c-violet)", hex: "#8165A3" },
    { name: "Marfil", role: "Luz", token: "var(--c-ivory)", hex: "#F3F0EA" },
    { name: "Noche", role: "Fondo", token: "var(--c-navy)", hex: "#242C3F" },
  ],
  typefaces: [
    { name: "Space Grotesk", role: "Display", varName: "var(--font-display)" },
    { name: "DM Sans", role: "Texto", varName: "var(--font-body)" },
  ],
} as const;

// L07 · Landing — capturas reales de la landing (del deck TP3).
export const d07 = {
  eyebrow: "La página",
  statement: "De curioso a usuario fiel.",
  support:
    "Lo primero que ve alguien interesado no es la app: es la landing. Que entre con dudas y salga queriendo la beta.",
  shots: [
    { img: "/promo/tp3-13.png", alt: "Landing de Ynara — hero" },
    { img: "/promo/tp3-16.png", alt: "Landing de Ynara — sección de funcionalidades" },
    { img: "/promo/tp3-19.png", alt: "Landing de Ynara — precio y cierre" },
  ],
} as const;

// L08 · Funcionalidades — los 3 pilares
export const d08 = {
  eyebrow: "Funcionalidades principales",
  intro: "Tres cosas que ninguna app junta.",
  // 3 pilares adelante (Productividad / Memoria / Bienestar). Los 5 modos son el
  // mecanismo; acá van los pilares. Aconseja = la intersección.
  pillars: problem.layers.slice(0, 3).map((l) => ({
    title: l.title,
    note: l.note,
    features: l.features,
  })),
  intersection: "Y de cruzar las tres, aconseja.",
} as const;

// L09 · Funcionalidades — la app. Los 4 verbos funcionando: los 3 chats canónicos
// (Productividad/Memoria/Bienestar) + un 4to que ilustra Aconseja (la intersección).
export const d09 = {
  eyebrow: "La app",
  statement: "Le hablás como a una persona y resuelve.",
  chats: [
    ...feel.chats,
    {
      mode: "Aconseja",
      user: "tengo tres entregas y cero energía",
      ynara: "Arrancá por la del martes, es la más corta. El resto puede esperar a mañana.",
    },
  ],
  placeholder: "UI real de la app",
} as const;

// L10 · Monetización — planes
export const d10 = {
  eyebrow: "Monetización",
  title: "Empezás gratuito. Subís cuando quieras.",
  plans: [
    {
      name: "Gratuito",
      price: "$0",
      period: "para siempre",
      features: ["Los tres pilares", "Memoria reciente", "Un dispositivo"],
      featured: false,
    },
    {
      name: "Premium",
      price: "USD 4–6",
      priceAlt: "≈ $6.900 ARS · por Mercado Pago",
      period: "por mes",
      features: [
        "Memoria extendida",
        "Funciones avanzadas",
        "Multidispositivo",
        "Prioridad de respuesta",
      ],
      featured: true,
    },
  ],
  note: "Sin publicidad. Sin venta de datos. Nunca.",
} as const;

// L11 · Monetización — viabilidad
export const d11 = {
  eyebrow: "Viabilidad",
  statement: "Un negocio que funciona.",
  ledger: [
    { num: "$0", title: "Inversión inicial", body: "Cero capital para arrancar." },
    { num: "US$70", title: "Costo mensual", body: "Lo que cuesta sostener la infraestructura." },
    { num: "~15", title: "Break-even", body: "Rentable desde el suscriptor quince." },
  ],
} as const;

// L12 · Lanzamiento — en vivo (Nerdearla). Imagen real del escenario/stand.
export const d12 = {
  eyebrow: "Lanzamiento",
  statement: "Menos apps. Más continuidad.",
  venue: "Nerdearla 2026",
  stage: "Escenario principal · charla formato TED",
  image: "/promo/tp3-02.jpg",
  imageAlt: "Ynara en el escenario principal de Nerdearla 2026",
} as const;

// Evento (Nerdearla) — galería de piezas del lanzamiento (del deck TP3).
export const dEvent = {
  eyebrow: "Lanzamiento · El evento",
  statement: "Ynara, en Nerdearla.",
  support: "Un stand para ver, tocar y probar la app en vivo — con su señalética y folletería.",
  pieces: [
    { img: "/promo/tp3-03.jpg", label: "El stand" },
    { img: "/promo/tp3-07.jpg", label: "Señalética" },
    { img: "/promo/tp3-10.jpg", label: "Folletería + QR" },
    { img: "/promo/tp3-01.jpg", label: "El público" },
  ],
} as const;

// L13 · Lanzamiento — la demo (actuada)
export const d13 = {
  eyebrow: "La demo",
  statement: "Ynara, en treinta segundos.",
  chats: feel.chats,
  fallback: "Plan B: captura fija si no responde en 5 s",
} as const;

// L14 · Promoción — redes. Publicaciones reales de Instagram (del deck TP2).
export const d14 = {
  eyebrow: "Promoción · Redes",
  handle: "@ynara.app",
  statement: "No publicita la solución. Documenta el problema.",
  support: "La cuenta es un museo del desorden cotidiano. Te reís, te reconocés, la necesitás.",
  posts: [
    { img: "/promo/tp2-08.jpg", alt: "Publicación de Instagram de Ynara — 1" },
    { img: "/promo/tp2-09.jpg", alt: "Publicación de Instagram de Ynara — 2" },
    { img: "/promo/tp2-10.jpg", alt: "Publicación de Instagram de Ynara — 3" },
    { img: "/promo/tp2-11.jpg", alt: "Publicación de Instagram de Ynara — 4" },
  ],
} as const;

// L15 · Promoción — la calle. Renders reales de vía pública (del deck TP2).
// Nota: el mapeo imagen↔formato es el mejor esfuerzo (no pude verlas); ajustar si hace falta.
export const d15 = {
  eyebrow: "Promoción · Vía pública",
  statement: "Tu propio caos, en la calle.",
  support:
    "Mismo gesto: te muestran tu desorden hasta que parás y decís «esto soy yo». Más un QR para sumarte.",
  ooh: [
    { img: "/promo/tp2-12.jpg", label: "Cartel de autopista" },
    { img: "/promo/tp2-13.jpg", label: "Andén de subte" },
    { img: "/promo/tp2-14.jpg", label: "Tótem digital" },
    { img: "/promo/tp2-15.jpg", label: "Parada de colectivo" },
  ],
} as const;

// L16 · Promoción — objetos. Renders reales de producto (del deck TP2).
export const d16 = {
  eyebrow: "Promoción · Objetos",
  statement: "La marca que se toca.",
  objects: [
    { name: "Funda", img: "/promo/tp2-01.jpg" },
    { name: "Soporte-cargador", img: "/promo/tp2-03.jpg" },
    { name: "Lapicera que graba reuniones", img: "/promo/tp2-04.jpg" },
    { name: "Remera", img: "/promo/tp2-05.jpg" },
    { name: "Buzo", img: "/promo/tp2-06.jpg" },
    { name: "Tote", img: "/promo/tp2-07.jpg" },
  ],
} as const;

// L17 · Próximas funcionalidades (promesas)
export const d17 = {
  eyebrow: "Próximas funcionalidades",
  statement: "Subirte ahora es entrar antes que nadie.",
  roadmap: [
    { phase: "MVP", when: "Hoy", body: "El asistente con memoria, en tus manos." },
    {
      phase: "V2",
      when: "Infraestructura propia",
      body: "Postgres self-hosted. Soberanía del dato.",
    },
    { phase: "V3", when: "Voz propia", body: "Una voz que suena como vos, no como un manual." },
  ],
} as const;

// L18 · Cierre
export const d18 = {
  eyebrow: "Beta cerrada · 2026",
  synthesis: "El humor existe porque la memoria falla. Ynara existe por lo mismo.",
  signoff: site.signoff, // "Pensar mejor, recordar siempre."
  cta: { label: "Quiero la beta", href: "/#descargar" },
} as const;
