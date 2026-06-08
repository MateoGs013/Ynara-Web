/**
 * Banco de copy de Ynara — fuente única de texto para todas las secciones.
 * Voz: rioplatense (voseo), directa, sin tics de chatbot, sin emojis, editorial.
 * Basado en Brief, Elección del Nombre, Business Model Canvas y TONE-OF-VOICE.
 */

export const site = {
  name: "Ynara",
  domain: "ynara.app",
  tagline: "La única presencia que necesitás.",
  signoff: "Pensar mejor, recordar siempre.",
  description:
    "Ynara es un asistente personal adaptativo con memoria propia. Organiza, recuerda, acompaña y aconseja desde un solo lugar. On-prem, privado, en rioplatense.",
  verbs: ["Organiza", "Recuerda", "Acompaña", "Aconseja"],
} as const;

export const nav = {
  links: [
    { label: "El nombre", href: "#nombre" },
    { label: "Producto", href: "#producto" },
    { label: "Memoria", href: "#memoria" },
    { label: "Precio", href: "#precio" },
  ],
  cta: { label: "Sumate a la lista", href: "#descargar" },
} as const;

export const hero = {
  eyebrow: "Asistente personal adaptativo",
  wordmark: "Ynara",
  title: "La única *presencia* que necesitás.",
  statement:
    "Tu asistente personal con memoria propia. Organiza, recuerda y te acompaña — todo desde una sola presencia, no desde diez apps sueltas.",
  lead: "Organiza, recuerda y te acompaña: productividad, memoria y bienestar en una sola presencia. Los tres ejes que ninguna otra app cruza.",
  badge: "v0.1 · privado · self-hosted",
  ctaPrimary: { label: "Sumate a la lista", href: "#descargar" },
  ctaSecondary: { label: "Ver cómo funciona", href: "#producto" },
} as const;

export const name = {
  eyebrow: "El nombre",
  wordmark: "Ynara",
  statement:
    "No es una herramienta más en tu vida: es una presencia. Una sola, estable, que está cuando la necesitás y se corre cuando no.",
  title: "Una palabra nueva, con raíces antiguas.",
  lead: "Ynara no existe en ningún idioma previo. Es una construcción de marca, inspirada en raíces reales que ya cargan el sentido de lo uno y de la presencia.",
  etymology: [
    {
      part: "óen · un",
      origin: "Raíz celta de “uno / único”",
      meaning:
        "Inspirada en la idea de unidad: el irlandés óen y el galés un. La presencia que es una, no muchas.",
    },
    {
      part: "-ara",
      origin: "Sufijo de presencia femenina",
      meaning:
        "El cierre que da cuerpo y permanencia. Resuena en nombres como Clara, Lara o Bárbara.",
    },
  ],
  result: "Ynara: la presencia que es una.",
  pull: "El usuario no suma una herramienta a su vida. Instala una presencia.",
  qualities: [
    {
      title: "Singularidad",
      body: "Es una, no muchas. Reemplaza la dispersión de apps por una sola entidad continua.",
    },
    {
      title: "Permanencia",
      body: "Presente de forma sostenida, no intermitente. Una presencia estable en tu día.",
    },
    {
      title: "Cercanía sin invasión",
      body: "Acompaña sin ocupar el primer plano. Está cuando la necesitás; se corre cuando no.",
    },
  ],
} as const;

export const problem = {
  eyebrow: "El problema",
  wordmark: "Una.",
  statement:
    "Saltás entre agenda, notas, recordatorios, una IA y una app de bienestar. Ninguna se habla con la otra: el pegamento sos vos. Ynara es una sola, y vive justo donde se cruzan las tres capas que nadie más conecta.",
  title: "Vivís entre ocho apps. Ynara es una.",
  lead: "Agenda, notas, recordatorios, una app de bienestar, una IA para preguntar. Cinco a ocho herramientas que no se hablan entre sí. Vos sos el pegamento.",
  layers: [
    { key: "productividad", title: "Productividad", note: "Organiza y ejecuta." },
    { key: "memoria", title: "Memoria", note: "Recuerda tu contexto." },
    { key: "bienestar", title: "Bienestar", note: "Acompaña sin invadir." },
  ],
  intersection: "Nadie cruza las tres. Ynara vive donde se tocan.",
  competitors: [
    { name: "Motion", does: "organiza", but: "no recuerda ni acompaña." },
    { name: "Pi", does: "acompaña", but: "no organiza." },
    { name: "Notion AI", does: "produce", but: "no se adapta a vos." },
  ],
} as const;

export const product = {
  eyebrow: "Cinco modos, una identidad",
  wordmark: "Modos",
  statement:
    "Cinco modos que se activan solos según el contexto. No configurás nada: Ynara entiende si estás produciendo, estudiando o necesitás un respiro, y cambia con vos.",
  hint: "Arrastrá para recorrerlos →",
  title: "Se adapta sola. Vos no configurás nada.",
  lead: "Un solo producto con cinco modos que se activan según el contexto. No hay versiones separadas: la propuesta es la integración.",
  modes: [
    {
      key: "productividad",
      title: "Productividad",
      tagline: "Agendar, recordar y ejecutar.",
      gradient: "var(--grad-blue)",
      color: "#2f5aa6",
    },
    {
      key: "estudio",
      title: "Estudio",
      tagline: "Tutoría, explicar y procesar.",
      gradient: "var(--grad-blue-soft)",
      color: "#4b7ee6",
    },
    {
      key: "bienestar",
      title: "Bienestar",
      tagline: "Descarga y acompañamiento.",
      gradient: "var(--grad-jade)",
      color: "#4a9c8c",
    },
    {
      key: "vida",
      title: "Vida",
      tagline: "Charla casual y consejos.",
      gradient: "var(--grad-amber)",
      color: "#d9a24a",
    },
    {
      key: "memoria",
      title: "Memoria",
      tagline: "Recuperá cualquier conversación.",
      gradient: "var(--grad-violet)",
      color: "#7c4fa3",
    },
  ],
} as const;

export const memory = {
  eyebrow: "Memoria",
  wordmark: "Memoria",
  statement:
    "Te recuerda de verdad: nombres, charlas, tu forma de hacer las cosas. Y es tuyo — la inferencia corre on-prem, privada. Nada se vende, nada sale del perímetro.",
  title: "Recuerda por vos. Con discreción, no con vigilancia.",
  lead: "Tu contexto es tuyo. La inferencia corre sobre infraestructura propia, on-prem. Nada se vende, nada sale del perímetro.",
  layers: [
    { title: "Semántica", body: "Lo que sos y lo que te importa: nombres, gustos, rutinas." },
    { title: "Episódica", body: "Lo que pasó: cada conversación, con su fecha y su contexto." },
    { title: "Procedural", body: "Cómo hacés las cosas: tus atajos, tu forma de trabajar." },
  ],
  pull: "Cita textual lo que recuerda. No reescribe tus recuerdos.",
  privacy: ["Sin venta de datos", "Sin publicidad", "Inferencia propia"],
} as const;

export const feel = {
  eyebrow: "La voz",
  wordmark: "Voz",
  statement:
    "Habla como vos: rioplatense, directa, sin sermones. Cierra una tarea en un mensaje y, cuando no sabe algo, te lo dice.",
  title: "Habla como vos. Sin vueltas, sin sermones.",
  lead: "Rioplatense natural. Directa cuando hay que cerrar una tarea, cálida cuando hace falta. Honesta cuando no sabe algo.",
  chats: [
    {
      mode: "Productividad",
      user: "agendá dentista mañana a las 7",
      ynara: "Listo, agendado mañana 19hs.",
    },
    {
      mode: "Estudio",
      user: "no sé por dónde empezar la tesis",
      ynara: "¿Qué parte tenés más clara? Arrancamos por ahí.",
    },
    {
      mode: "Memoria",
      user: "¿cómo se llamaba el libro que me recomendaron?",
      ynara: "“La sustancia”, te lo pasó Sofi el 12 de mayo.",
    },
  ],
} as const;

export const pricing = {
  eyebrow: "Precio",
  wordmark: "Gratis",
  statement:
    "Los cinco modos y la memoria reciente, gratis para siempre. Premium suma memoria extendida, modos avanzados y multidispositivo por USD 4–6 al mes.",
  title: "Empezá gratis. Subí cuando lo necesites.",
  lead: "Funciones core gratis, para siempre. La suscripción suma memoria extendida y modos avanzados.",
  plans: [
    {
      name: "Free",
      price: "$0",
      period: "para siempre",
      features: ["Los cinco modos", "Memoria reciente", "Un dispositivo"],
      cta: "Sumate a la lista",
      featured: false,
    },
    {
      name: "Premium",
      price: "USD 4–6",
      period: "por mes",
      features: [
        "Memoria extendida",
        "Modos avanzados",
        "Multidispositivo",
        "Prioridad de respuesta",
      ],
      cta: "Sumate a la lista",
      featured: true,
    },
  ],
  note: "Sin publicidad. Sin venta de datos. Nunca.",
} as const;

export const cta = {
  eyebrow: "Disponible pronto",
  title: "Pensar mejor, recordar siempre.",
  statement:
    "La única presencia que necesitás. MVP en el segundo semestre de 2026, para iOS y Android. Sumate a la lista y entrá entre los primeros.",
  lead: "La única presencia que necesitás. MVP en el segundo semestre de 2026, para iOS y Android.",
  primary: { label: "Sumate a la lista", href: "mailto:hola@ynara.app" },
  stores: ["App Store · Próximamente", "Google Play · Próximamente"],
} as const;

export const footer = {
  tagline: "Organiza. Recuerda. Acompaña. Aconseja.",
  columns: [
    {
      title: "Producto",
      links: [
        { label: "El nombre", href: "#nombre" },
        { label: "Cinco modos", href: "#producto" },
        { label: "Memoria", href: "#memoria" },
        { label: "Precio", href: "#precio" },
      ],
    },
    {
      title: "Marca",
      links: [
        { label: "Privacidad", href: "#" },
        { label: "Términos", href: "#" },
        { label: "Contacto", href: "mailto:hola@ynara.app" },
      ],
    },
  ],
  meta: "Tesis Da Vinci 2026 · Self-hosted · Hecho en Argentina",
} as const;
