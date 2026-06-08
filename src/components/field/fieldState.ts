/**
 * Estado compartido de LA FORMA (single source of truth para el morfeo).
 *
 * Un único objeto mutable `fieldTarget` que:
 *  - el MASTER TIMELINE (scrubbeado por scroll) tweenea capítulo a capítulo, y
 *  - `LightForm` lee cada frame, lerpeando sus uniforms hacia él.
 *
 * Desacopla el render loop de WebGL de los re-renders de React. La forma vive
 * sola; el scroll sólo mueve estos números → el shader morfea.
 */

export type ModeTint = { r: number; g: number; b: number };

export type FieldState = {
  /** Amplitud de las olas (altura del terreno de luz). */
  amp: number;
  /** Frecuencia espacial del ruido (bajo = colinas anchas y orgánicas). */
  noiseScale: number;
  /** Velocidad de flujo del ruido. */
  noiseSpeed: number;
  /** 0 = olas plenas · 1 = plano calmo. */
  flat: number;
  /** 0 = superficie continua · 1 = red de puntos de luz (memoria). */
  dots: number;
  /** Densidad de la grilla de puntos cuando dots > 0. */
  gridScale: number;
  /** Radio de cada punto de luz. */
  dotRadius: number;
  /** Luminancia global de la forma. */
  brightness: number;
  /** Intensidad de las bandas de luz que fluyen por las crestas. */
  band: number;
  /** 0 = azul base de marca · 1 = tint de modo pleno (siempre sutil). */
  tintMix: number;
  /** Color del tint de modo (lineal 0..1). */
  tint: ModeTint;
  /** Génesis: 0 = forma sin nacer · 1 = forma plena (radial grow + brillo). */
  reveal: number;
  /** Multiplicador de la perturbación por mouse (algunos capítulos la suben/bajan). */
  mouse: number;
  /** Cámara: altura, distancia y punto de mira (parallax sutil por capítulo). */
  camY: number;
  camZ: number;
  lookY: number;
  /** Inclinación de la malla (terreno ↔ horizonte). */
  rotX: number;
};

/** Azul de marca y acentos en espacio lineal aprox (additive = contribución de luz). */
export const TINT = {
  blue: { r: 0.18, g: 0.4, b: 0.86 },
  estudio: { r: 0.4, g: 0.55, b: 0.96 },
  jade: { r: 0.29, g: 0.61, b: 0.55 },
  amber: { r: 0.85, g: 0.63, b: 0.29 },
  violet: { r: 0.49, g: 0.31, b: 0.64 },
} as const;

/** Estado base = capítulo 00 (Génesis/Hero): olas plenas, azul, dominante. */
export const BASE_FIELD: FieldState = {
  amp: 1.0,
  noiseScale: 0.26,
  noiseSpeed: 1.0,
  flat: 0.0,
  dots: 0.0,
  gridScale: 42.0,
  dotRadius: 0.34,
  brightness: 1.0,
  band: 1.0,
  tintMix: 0.0,
  tint: { ...TINT.blue },
  reveal: 0.0,
  mouse: 1.0,
  camY: 0.85,
  camZ: 5.0,
  lookY: -0.4,
  rotX: -Math.PI / 2 + 0.34,
};

/** El objeto vivo que el timeline tweenea y la forma lee. Mutado in-place. */
export const fieldTarget: FieldState = {
  ...BASE_FIELD,
  tint: { ...BASE_FIELD.tint },
};

/** Reset a base (útil en HMR / cleanup). */
export function resetField() {
  Object.assign(fieldTarget, BASE_FIELD, { tint: { ...BASE_FIELD.tint } });
}

/**
 * Aplica una firma de forma (parcial). Cada ESCENA llama esto en su ventana de
 * scroll para que la forma morfee exactamente donde el usuario mira. LightForm
 * lerpea entre firmas, así que los cambios de escena se sienten continuos.
 */
export function setField(s: Partial<Omit<FieldState, "tint">> & { tint?: ModeTint }) {
  const { tint, ...rest } = s;
  Object.assign(fieldTarget, rest);
  if (tint) {
    fieldTarget.tint.r = tint.r;
    fieldTarget.tint.g = tint.g;
    fieldTarget.tint.b = tint.b;
  }
}
