"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import { reducedMotion } from "@/lib/motion";
import { fieldTarget } from "./fieldState";

/* ────────────────────────────────────────────────────────────────────────────
 * LA FORMA — un único terreno de luz que vive de principio a fin y MORFEA.
 * Técnica infinitefield: PlaneGeometry muy subdividido + simplex-noise de Ashima
 * en el vertex (frecuencias bajas → orgánico), AdditiveBlending, cámara en ángulo.
 * El SCROLL no toca este componente: mueve `fieldTarget`; la forma lo lee y lerpea.
 * ──────────────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uFlat;
  uniform float uSolid;
  uniform float uStreams;
  uniform float uConverge;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  varying float vH;
  varying vec2  vUv;
  varying float vMouse;

  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // 3 octavas de ruido de BAJA frecuencia → colinas anchas, armoniosas (no picos).
  float field(vec2 p){
    float sp = uNoiseSpeed;
    float d  = snoise(p * uNoiseScale       + vec2(uTime * 0.045 * sp,  uTime * 0.018));
    d += 0.50 * snoise(p * uNoiseScale * 2.0 - vec2(uTime * 0.035 * sp,  uTime * 0.045));
    d += 0.18 * snoise(p * uNoiseScale * 4.0 + vec2(uTime * 0.050 * sp, -uTime * 0.020));
    return d;
  }

  // Tres corrientes direccionales (120° entre sí) que CONVERGEN hacia el centro.
  // El diferencial de Ynara: tres capas que nadie más conecta, hechas una.
  float streams(vec2 p, float conv){
    float h = 0.0;
    for(int i = 0; i < 3; i++){
      float a = float(i) * 2.0943951 + 0.5;
      vec2 dir  = vec2(cos(a), sin(a));
      vec2 perp = vec2(-dir.y, dir.x);
      float along = dot(p, dir);
      float trans = dot(p, perp);
      float travel = along * 0.5 - uTime * 0.5 * uNoiseSpeed;
      float wave = sin(travel) * 0.5 + 0.5;
      wave *= wave;                          // crestas más definidas
      float laneW = mix(6.0, 3.4, conv);     // se angosta pero NO se apilan en el centro
      float lane = exp(-(trans * trans) / (laneW * laneW));
      h += wave * lane * 0.5;                // amplitud acotada por corriente
    }
    float r2 = dot(p, p);
    float peakW = mix(5.0, 2.8, conv);
    float peak = exp(-r2 / (peakW * peakW)) * conv * 0.45;   // realce central chico
    return h + peak;
  }

  void main(){
    vUv = uv;
    float h = field(position.xy);
    if (uStreams > 0.001) {
      h = mix(h, streams(position.xy, uConverge), uStreams);
    }
    // Hinchazón suave y ANCHA que sigue al cursor (no un bump filoso).
    float md = distance(position.xy, uMouse);
    float swell = smoothstep(4.2, 0.0, md) * uMouseStrength;
    vMouse = swell;
    h += swell * 0.95;
    h *= (1.0 - clamp(uFlat + uSolid, 0.0, 1.0)); // aplana hacia plano / sólido calmo
    vH = h;
    vec3 pos = position;
    pos.z += h * uAmp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uBrightness;
  uniform float uBand;
  uniform float uDots;
  uniform float uConnect;
  uniform float uSolid;
  uniform float uContour;
  uniform float uGridScale;
  uniform float uDotRadius;
  uniform float uTintMix;
  uniform vec3  uTint;
  uniform float uReveal;
  uniform vec3  uLow;
  uniform vec3  uMid;
  uniform vec3  uHigh;
  varying float vH;
  varying vec2  vUv;
  varying float vMouse;

  void main(){
    float t = smoothstep(-1.1, 1.8, vH);

    // ── Rampa DUSK: valle slate-púrpura → cuerpo slate-azul → cresta malva/rosa.
    // El drama es VALOR + tono cálido en las crestas (gráfico de marca de Ynara).
    vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.55, t));
    col = mix(col, uHigh, smoothstep(0.5, 1.0, t));

    float glow = pow(t, 2.0);

    // Sheen lavanda en las crestas (no revienta a blanco — bajo contraste).
    col += vec3(0.16, 0.17, 0.22) * pow(t, 3.0);

    // Bandas de luz que fluyen por las crestas (sutiles, dusk).
    float s = fract(uTime * 0.05 + vUv.y * 3.0 - vH * 0.16);
    float band = smoothstep(0.0, 0.5, s) * (1.0 - smoothstep(0.5, 1.0, s));
    col += uHigh * band * pow(t, 3.0) * 0.22 * uBand;

    // ── CURVAS DE NIVEL: linework fino que recorre el terreno (el del gráfico).
    float cn = vH * 3.4;
    float cf = abs(fract(cn) - 0.5);
    float contour = (1.0 - smoothstep(0.0, 0.055, cf)) * uContour;
    col += vec3(0.62, 0.65, 0.82) * contour * (0.30 + glow * 0.5);

    // Realce donde está el cursor.
    glow += vMouse * 0.4;

    // Tint de modo — SUTIL.
    col = mix(col, uTint * (0.6 + glow), uTintMix * 0.5);

    // Borde que se funde en el fondo dusk (la forma no tiene marco).
    float ex = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float ey = smoothstep(0.0, 0.07, vUv.y) * smoothstep(1.0, 0.90, vUv.y);
    float edge = ex * ey;

    // ── NODOS + CONEXIONES (Memoria): la malla se vuelve red de nodos UNIDOS.
    vec2 gp = fract(vUv * uGridScale) - 0.5;
    float dd = length(gp);
    float dotShape = 1.0 - smoothstep(uDotRadius * 0.5, uDotRadius, dd);
    // retícula de líneas que conectan los nodos (ejes de cada celda).
    float lh = 1.0 - smoothstep(0.0, 0.05, abs(gp.y));
    float lv = 1.0 - smoothstep(0.0, 0.05, abs(gp.x));
    float link = max(lh, lv) * uConnect;

    // Contribución SUPERFICIE continua (olas dusk).
    vec3  colSurface = col * (0.7 + glow * 0.7);
    float aSurface   = (0.5 + glow * 0.5) * 0.92;

    // Contribución RED: nodos brillantes + líneas de conexión.
    vec3  nodeCol = mix(col, vec3(0.80, 0.82, 0.96), 0.45);
    vec3  colDots = nodeCol * (dotShape + link * 0.55) * (0.7 + glow * 1.1);
    float aDots   = clamp(dotShape * (0.55 + glow * 0.7) + link * (0.22 + glow * 0.3), 0.0, 1.0);

    // Mezcla superficie ↔ red según el morfeo.
    vec3  outc  = mix(colSurface, colDots, uDots);
    float alpha = mix(aSurface, aDots, uDots);

    // ── PLANO SÓLIDO de calma: todo colapsa a un único color sereno, pleno.
    vec3 calm = vec3(0.30, 0.27, 0.40);
    outc  = mix(outc, calm, uSolid);
    alpha = mix(alpha, 1.0, uSolid);

    outc *= uBrightness;

    // Borde que se funde + génesis radial (el plano sólido NO se recorta).
    float rad  = distance(vUv, vec2(0.5));
    float grow = smoothstep(0.0, 1.0, uReveal * 1.7 - rad);
    alpha *= mix(edge * grow, 1.0, uSolid);

    gl_FragColor = vec4(outc, alpha);
  }
`;

type Props = {
  className?: string;
  /** Calidad de la malla. mobile usa menos segmentos. */
  quality?: "high" | "low";
};

export default function LightForm({ className, quality }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = reducedMotion();

    // Calidad adaptativa: mobile / poca potencia → malla más liviana.
    const isMobile =
      quality === "low" || (typeof window !== "undefined" && window.innerWidth < 768);
    const SEG_X = isMobile ? 170 : 320;
    const SEG_Y = isMobile ? 110 : 200;
    const PLANE_W = 22;
    const PLANE_H = 13;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, fieldTarget.camY, fieldTarget.camZ);
    camera.lookAt(0, fieldTarget.lookY, -2);

    const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H, SEG_X, SEG_Y);
    const u = {
      uTime: { value: 0 },
      uAmp: { value: fieldTarget.amp },
      uNoiseScale: { value: fieldTarget.noiseScale },
      uNoiseSpeed: { value: fieldTarget.noiseSpeed },
      uFlat: { value: fieldTarget.flat },
      uSolid: { value: fieldTarget.solid },
      uStreams: { value: fieldTarget.streams },
      uConverge: { value: fieldTarget.converge },
      uMouse: { value: new THREE.Vector2(-99, -99) },
      uMouseStrength: { value: 0 },
      uBrightness: { value: fieldTarget.brightness },
      uBand: { value: fieldTarget.band },
      uDots: { value: fieldTarget.dots },
      uConnect: { value: fieldTarget.connect },
      uContour: { value: fieldTarget.contour },
      uGridScale: { value: fieldTarget.gridScale },
      uDotRadius: { value: fieldTarget.dotRadius },
      uTintMix: { value: fieldTarget.tintMix },
      uTint: { value: new THREE.Color(fieldTarget.tint.r, fieldTarget.tint.g, fieldTarget.tint.b) },
      uReveal: { value: 0 },
      // Paleta DUSK del gráfico de marca: valle slate-púrpura → slate-azul → malva/rosa.
      uLow: { value: new THREE.Color(0.16, 0.17, 0.26) },
      uMid: { value: new THREE.Color(0.4, 0.46, 0.7) },
      uHigh: { value: new THREE.Color(0.74, 0.6, 0.74) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
      uniforms: u,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = fieldTarget.rotX;
    mesh.position.y = -1.7;
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      // Recalcular DPR por si cambió de monitor (relevante en demos/proyector).
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2(-99, -99);
    const targetMouse = new THREE.Vector2(-99, -99);
    let mouseStrength = 0;
    let targetMouseStrength = 0;
    // Génesis: la forma nace de a poco salvo que ya se haya visto la intro.
    let revealT = 0;

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      u.uTime.value += dt;

      // Lerp suave de TODOS los uniforms hacia el estado-objetivo (scroll-driven).
      const k = 0.08;
      u.uAmp.value = lerp(u.uAmp.value, fieldTarget.amp, k);
      u.uNoiseScale.value = lerp(u.uNoiseScale.value, fieldTarget.noiseScale, k);
      u.uNoiseSpeed.value = lerp(u.uNoiseSpeed.value, fieldTarget.noiseSpeed, k);
      u.uFlat.value = lerp(u.uFlat.value, fieldTarget.flat, k);
      u.uSolid.value = lerp(u.uSolid.value, fieldTarget.solid, k);
      u.uStreams.value = lerp(u.uStreams.value, fieldTarget.streams, k);
      u.uConverge.value = lerp(u.uConverge.value, fieldTarget.converge, k);
      u.uBrightness.value = lerp(u.uBrightness.value, fieldTarget.brightness, k);
      u.uBand.value = lerp(u.uBand.value, fieldTarget.band, k);
      u.uDots.value = lerp(u.uDots.value, fieldTarget.dots, k);
      u.uConnect.value = lerp(u.uConnect.value, fieldTarget.connect, k);
      u.uContour.value = lerp(u.uContour.value, fieldTarget.contour, k);
      u.uGridScale.value = lerp(u.uGridScale.value, fieldTarget.gridScale, k);
      u.uDotRadius.value = lerp(u.uDotRadius.value, fieldTarget.dotRadius, k);
      u.uTintMix.value = lerp(u.uTintMix.value, fieldTarget.tintMix, k);
      u.uTint.value.r = lerp(u.uTint.value.r, fieldTarget.tint.r, k);
      u.uTint.value.g = lerp(u.uTint.value.g, fieldTarget.tint.g, k);
      u.uTint.value.b = lerp(u.uTint.value.b, fieldTarget.tint.b, k);

      // Reveal de génesis (independiente del scroll).
      revealT = lerp(revealT, fieldTarget.reveal, 0.05);
      u.uReveal.value = revealT;

      // Cámara — parallax sutil por capítulo.
      camera.position.y = lerp(camera.position.y, fieldTarget.camY, k);
      camera.position.z = lerp(camera.position.z, fieldTarget.camZ, k);
      mesh.rotation.x = lerp(mesh.rotation.x, fieldTarget.rotX, k);
      camera.lookAt(0, fieldTarget.lookY, -2);

      // Mouse — perturbación con inercia.
      mouse.lerp(targetMouse, 0.07);
      mouseStrength = lerp(mouseStrength, targetMouseStrength, 0.06);
      u.uMouse.value.copy(mouse);
      u.uMouseStrength.value = mouseStrength * fieldTarget.mouse;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    const play = () => {
      if (reduce || raf || document.hidden || !visible) return;
      clock.getDelta();
      raf = requestAnimationFrame(render);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reduce) {
      // Reduced-motion: un único frame estático hermoso (forma quieta, plena).
      u.uTime.value = 14.0;
      u.uReveal.value = 1;
      fieldTarget.reveal = 1;
      renderer.render(scene, camera);
    } else {
      play();
    }

    // Génesis: si ya se vio la intro, la forma ya está; si no, nace al terminar.
    let introSeen = false;
    try {
      introSeen = sessionStorage.getItem("ynara-intro") === "1";
    } catch {}
    if (introSeen) fieldTarget.reveal = 1;
    const onIntroDone = () => {
      fieldTarget.reveal = 1;
    };
    window.addEventListener("ynara:intro-done", onIntroDone, { once: true });

    const onResize = () => resize();
    const onVis = () => (document.hidden ? pause() : play());
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      targetMouse.set(nx * 9, ny * 5 - 1.0);
      targetMouseStrength = 1;
    };
    const onLeave = () => {
      targetMouseStrength = 0;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? play() : pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onLeave);
    }

    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("ynara:intro-done", onIntroDone);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [quality]);

  return <canvas ref={ref} className={cn("block h-full w-full", className)} />;
}
