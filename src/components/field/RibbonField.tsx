"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

/* ────────────────────────────────────────────────────────────────────────────
 * BASE DEL CAMPO (premium) — implementación PROPIA del lenguaje de infinitefield.
 *   FORMA: cinta fina que flota, ondula y se RETUERCE sobre su eje.
 *   LUZ:   satinado por normales + especular ANISOTRÓPICO (Kajiya-Kay) = seda real,
 *          + fresnel rim + reflejo de gradiente; tono ACES + bloom HDR.
 *   CASCADA: cinta → plano → PUNTOS (redondos con glow) → TABLERO (orgánico).
 * Aislado en /lab/field. `window.__setFieldProgress`.
 * ──────────────────────────────────────────────────────────────────────────── */

const SNOISE = /* glsl */ `
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
`;

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uLen;
  uniform float uThick;
  uniform float uAmp;
  uniform float uTwist;
  uniform float uFlatten;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vTangent;

  ${SNOISE}

  vec3 ribbonPoint(float u, float v){
    float t = uTime;
    float cy = sin(u * 4.2 + t * 0.45) * 0.55
             + sin(u * 9.1 - t * 0.32) * 0.16
             + snoise(vec2(u * 2.0, t * 0.06)) * 0.28;
    cy *= uAmp;
    float tw = sin(u * 3.6 + t * 0.4) * uTwist
             + sin(u * 7.3 - t * 0.25) * uTwist * 0.45
             + snoise(vec2(u * 1.6 + 5.0, t * 0.05)) * 0.7;
    tw *= (1.0 - uFlatten);
    float thick = uThick * (1.0 + uFlatten * 4.4);
    float across = (v - 0.5) * thick;
    float x = (u - 0.5) * uLen;
    float y = cy * (1.0 - uFlatten) + across * cos(tw);
    float z = across * sin(tw);
    return vec3(x, y, z);
  }

  void main(){
    vUv = uv;
    vec3 P = ribbonPoint(uv.x, uv.y);
    float du = 0.0025, dv = 0.03;
    vec3 Pu = ribbonPoint(uv.x + du, uv.y) - P;
    vec3 Pv = ribbonPoint(uv.x, uv.y + dv) - P;
    vTangent = normalize(Pu);
    vNormal  = normalize(cross(Pu, Pv));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3  uBg;
  uniform vec3  uDark;
  uniform vec3  uMid;
  uniform vec3  uRim;
  uniform float uDots;
  uniform float uChecker;
  uniform float uGrid;
  uniform float uGridC;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vTangent;

  ${SNOISE}

  void main(){
    vec3 N = normalize(vNormal);
    vec3 T = normalize(vTangent);
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L = normalize(vec3(0.25, 0.55, 0.8));
    float facing = abs(N.z);

    // ── base ember: pliegue oscuro → cara ámbar, con un reflejo de gradiente
    //    (las crestas miran “arriba” y se aclaran).
    vec3 base = mix(uDark, uMid, smoothstep(0.0, 1.0, facing));
    base += uMid * 0.22 * smoothstep(-0.3, 0.7, N.y);
    float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
    base *= (0.5 + 0.62 * diff);

    // ── especular ANISOTRÓPICO (Kajiya-Kay): el lustre que corre por la seda.
    float TdotL = dot(T, L);
    float TdotV = dot(T, V);
    float sinTL = sqrt(max(0.0, 1.0 - TdotL * TdotL));
    float sinTV = sqrt(max(0.0, 1.0 - TdotV * TdotV));
    float aniso = pow(max(0.0, sinTL * sinTV - TdotL * TdotV), 22.0);
    vec3 col = base + uRim * aniso * 0.6;

    // ── fresnel rim: los cantos edge-on se ENCIENDEN.
    float rim = pow(1.0 - facing, 2.6);
    col += uRim * rim * 0.8;

    // brillo que viaja a lo largo de la tela.
    float s = fract(uTime * 0.05 + vUv.x * 2.2);
    float trav = smoothstep(0.45, 0.5, s) * (1.0 - smoothstep(0.5, 0.55, s));
    col += uRim * trav * facing * 0.3;

    // ── CASCADA: PUNTOS redondos con glow → TABLERO orgánico ──
    if (uDots > 0.001 || uChecker > 0.001) {
      vec2 g = fract(vUv * uGrid) - 0.5;
      float d = length(g);
      float rad = 0.36;
      float core = smoothstep(rad, rad * 0.45, d);
      float halo = smoothstep(rad * 1.7, 0.0, d);
      vec3 dotCol = mix(uBg, uMid, 0.3) + uRim * (core * 0.6 + halo * 0.16);
      col = mix(col, dotCol, uDots);

      float cx = sin(vUv.x * uGridC * 3.14159);
      float cy = sin(vUv.y * uGridC * 3.14159);
      float raw = cx * cy + snoise(vUv * 3.5 + uTime * 0.04) * 0.22;
      float chk = smoothstep(-0.1, 0.1, raw);
      vec3 chkDark = mix(uBg, uMid, 0.1);
      vec3 chkLight = uMid * 1.5 + uRim * 0.34;
      vec3 chkCol = mix(chkDark, chkLight, chk);
      col = mix(col, chkCol, uChecker);
    }

    // cantos a lo ancho se funden en el carbón (cinta); el plano llena la pantalla.
    float vEdge = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    col = mix(uBg, col, mix(vEdge, 1.0, max(uDots, uChecker)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (a: number, b: number, x: number) => {
  if (x <= a) return 0;
  if (x >= b) return 1;
  const t = (x - a) / (b - a);
  return t * t * (3 - 2 * t);
};

declare global {
  interface Window {
    __setFieldProgress?: (p: number) => void;
    __resetFieldProgress?: () => void;
  }
}

const BG = 0x09090b;

export default function RibbonField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(BG, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // tono cinematográfico
    renderer.toneMappingExposure = 0.82;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.PlaneGeometry(1, 1, 600, 64);
    const bg = new THREE.Color(BG);
    const u = {
      uTime: { value: 0 },
      uLen: { value: 14.0 },
      uThick: { value: 0.82 },
      uAmp: { value: 0.7 },
      uTwist: { value: 1.6 },
      uFlatten: { value: 0 },
      uDots: { value: 0 },
      uChecker: { value: 0 },
      uGrid: { value: 18 },
      uGridC: { value: 9 },
      uBg: { value: bg },
      uDark: { value: new THREE.Color(0.04, 0.012, 0.0) },
      uMid: { value: new THREE.Color(0.34, 0.12, 0.02) },
      uRim: { value: new THREE.Color(0.95, 0.68, 0.34) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
      uniforms: u,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.15;
    scene.add(mesh);

    // composer con MSAA + HDR (HalfFloat) → bordes y bloom limpios.
    const rt = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    const composer = new EffectComposer(renderer, rt);
    composer.setPixelRatio(dpr);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.35, 0.55);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    let manual: number | null = null;
    window.__setFieldProgress = (p) => {
      manual = clamp01(p);
    };
    window.__resetFieldProgress = () => {
      manual = null;
    };
    const readProgress = () => {
      if (manual != null) return manual;
      const l = window.__lenis;
      if (l && l.limit > 0) return clamp01(l.scroll / l.limit);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp01(window.scrollY / max) : 0;
    };

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      const r = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(r);
      renderer.setSize(w, h, false);
      composer.setPixelRatio(r);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const clock = new THREE.Clock();
    let cFlat = 0;
    let cDots = 0;
    let cChecker = 0;
    let cTilt = -0.12;
    let raf = 0;
    const render = () => {
      u.uTime.value += Math.min(clock.getDelta(), 0.05);
      const t = u.uTime.value;
      const p = readProgress();

      const tFlat = smooth(0.3, 0.5, p);
      const tDots = smooth(0.46, 0.66, p) * (1.0 - smooth(0.74, 0.9, p));
      const tChecker = smooth(0.74, 0.92, p);

      cFlat = lerp(cFlat, tFlat, 0.07);
      cDots = lerp(cDots, tDots, 0.07);
      cChecker = lerp(cChecker, tChecker, 0.07);

      u.uFlatten.value = cFlat;
      u.uDots.value = cDots;
      u.uChecker.value = cChecker;
      u.uGrid.value = lerp(18, 24, p);

      // coreografía 3D sutil: la cinta respira con una leve inclinación que se
      // asienta de frente al aplanarse (para que puntos/tablero queden limpios).
      const tiltLive = -0.12 + Math.sin(t * 0.12) * 0.05;
      cTilt = lerp(cTilt, tiltLive * (1 - cFlat), 0.05);
      mesh.rotation.x = cTilt;

      composer.render();
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.__setFieldProgress = undefined;
      window.__resetFieldProgress = undefined;
      geometry.dispose();
      material.dispose();
      rt.dispose();
      bloom.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[120]" style={{ background: "#09090b" }} aria-hidden>
      <canvas ref={ref} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
