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

  void main(){
    vUv = uv;
    float h = field(position.xy);
    // Hinchazón suave y ANCHA que sigue al cursor (no un bump filoso).
    float md = distance(position.xy, uMouse);
    float swell = smoothstep(4.2, 0.0, md) * uMouseStrength;
    vMouse = swell;
    h += swell * 0.95;
    h *= (1.0 - uFlat);                 // aplana hacia plano calmo
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

    // Rampa de valor: void → azul de marca → cresta brillante. EL DRAMA ES VALOR.
    vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.55, t));
    col = mix(col, uHigh, smoothstep(0.5, 1.0, t));

    float glow = pow(t, 2.0);

    // Bandas de luz que fluyen por las crestas (infinitefield).
    float s = fract(uTime * 0.05 + vUv.y * 3.0 - vH * 0.16);
    float band = smoothstep(0.0, 0.5, s) * (1.0 - smoothstep(0.5, 1.0, s));
    glow += band * pow(t, 3.0) * 0.7 * uBand;

    // Realce donde está el cursor.
    glow += vMouse * 0.45;

    // Tint de modo — SUTIL (la forma sigue azul-dominante).
    col = mix(col, uTint * (0.55 + glow), uTintMix);

    // Borde que se funde en el void (la forma no tiene marco).
    float ex = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float ey = smoothstep(0.0, 0.07, vUv.y) * smoothstep(1.0, 0.90, vUv.y);
    float edge = ex * ey;

    // Red de puntos de luz (capítulo Memoria): la misma malla → constelación.
    vec2 gp = fract(vUv * uGridScale) - 0.5;
    float dd = length(gp);
    float dotShape = 1.0 - smoothstep(uDotRadius * 0.5, uDotRadius, dd);

    // Contribución SUPERFICIE continua (olas).
    vec3  colSurface = col * (0.30 + glow * 1.05);
    float aSurface   = 0.04 + glow * 0.62;

    // Contribución CONSTELACIÓN: cada punto es luz con piso de brillo (no se apaga).
    vec3  colDots = col * (0.60 + glow * 1.5) * dotShape;
    float aDots   = dotShape * (0.16 + glow * 0.78);

    // Mezcla superficie ↔ constelación según el morfeo.
    vec3  outc  = mix(colSurface, colDots, uDots) * uBrightness;
    float alpha = mix(aSurface, aDots, uDots);

    // Borde que se funde + génesis: la luz crece radialmente desde el centro.
    float rad  = distance(vUv, vec2(0.5));
    float grow = smoothstep(0.0, 1.0, uReveal * 1.7 - rad);
    alpha *= edge * grow;

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
      uMouse: { value: new THREE.Vector2(-99, -99) },
      uMouseStrength: { value: 0 },
      uBrightness: { value: fieldTarget.brightness },
      uBand: { value: fieldTarget.band },
      uDots: { value: fieldTarget.dots },
      uGridScale: { value: fieldTarget.gridScale },
      uDotRadius: { value: fieldTarget.dotRadius },
      uTintMix: { value: fieldTarget.tintMix },
      uTint: { value: new THREE.Color(fieldTarget.tint.r, fieldTarget.tint.g, fieldTarget.tint.b) },
      uReveal: { value: 0 },
      uLow: { value: new THREE.Color(0.02, 0.04, 0.1) },
      uMid: { value: new THREE.Color(0.16, 0.32, 0.72) },
      uHigh: { value: new THREE.Color(0.62, 0.76, 1.0) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: u,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = fieldTarget.rotX;
    mesh.position.y = -1.7;
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
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
      u.uBrightness.value = lerp(u.uBrightness.value, fieldTarget.brightness, k);
      u.uBand.value = lerp(u.uBand.value, fieldTarget.band, k);
      u.uDots.value = lerp(u.uDots.value, fieldTarget.dots, k);
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
