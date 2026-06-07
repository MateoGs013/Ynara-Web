"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import { reducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uScroll;
  uniform vec2 uMouse;
  varying float vH;
  varying vec2 vUv;

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

  float field(vec2 p){
    float sp = 1.0 + uScroll * 1.1;               // el scroll acelera el flujo
    // Frecuencias bajas → colinas que ruedan, armoniosas (no picos filosos).
    float d = snoise(p * 0.24 + vec2(uTime * 0.04 * sp, uTime * 0.015));
    d += 0.45 * snoise(p * 0.48 - vec2(uTime * 0.03 * sp, uTime * 0.04));
    d += 0.13 * snoise(p * 0.96 + vec2(uTime * 0.05 * sp, -uTime * 0.02));
    return d;
  }

  void main(){
    vUv = uv;
    float h = field(position.xy);
    float md = distance(position.xy, uMouse);
    h += smoothstep(3.2, 0.0, md) * 0.55;          // hinchazón suave y ancha
    vH = h;
    vec3 pos = position;
    pos.z += h * uAmp * (1.0 + uScroll * 0.55);    // el scroll amplifica (gentil)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uLow;
  uniform vec3 uMid;
  uniform vec3 uHigh;
  varying float vH;
  varying vec2 vUv;
  void main(){
    float t = smoothstep(-1.2, 1.7, vH);
    // low -> mid (azul) -> high (violeta), el scroll empuja hacia el violeta
    vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.6, t));
    col = mix(col, uHigh, smoothstep(0.55, 1.0, t) * (0.5 + uScroll * 0.5));
    float glow = pow(t, 2.2);
    // bandas de luz que fluyen por las crestas (técnica infinitefield)
    float s = fract(uTime * 0.05 + vUv.y * 3.0 - vH * 0.15);
    float band = smoothstep(0.0, 0.5, s) * (1.0 - smoothstep(0.5, 1.0, s));
    glow += band * pow(t, 3.0) * 0.6;
    float ex = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
    float ey = smoothstep(0.0, 0.10, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
    float alpha = (0.05 + glow * 0.55) * ex * ey;
    gl_FragColor = vec4(col * (0.35 + glow * 0.9), alpha);
  }
`;

/**
 * WebGLWaves — terreno de luz fluido (técnica infinitefield: PlaneGeometry
 * subdividido + simplex-noise animado en vertex + AdditiveBlending). El SCROLL
 * morfea el shader (amplitud, velocidad, violeta en crestas) vía ScrollTrigger
 * scrub. Bandas de luz fluyentes. Reactivo al cursor. Estático en reduced-motion.
 */
export default function WebGLWaves({
  className,
  amp = 0.95,
}: {
  className?: string;
  amp?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = reducedMotion();

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.85, 5);
    camera.lookAt(0, -0.4, -2);

    const geometry = new THREE.PlaneGeometry(18, 11, 300, 190);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: amp },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(-99, -99) },
        uLow: { value: new THREE.Color(0.03, 0.06, 0.14) },
        uMid: { value: new THREE.Color(0.18, 0.34, 0.78) },
        uHigh: { value: new THREE.Color(0.34, 0.52, 1.0) },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2 + 0.32;
    mesh.position.y = -1.7;
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const targetMouse = new THREE.Vector2(-99, -99);

    const render = () => {
      material.uniforms.uTime.value += clock.getDelta();
      material.uniforms.uMouse.value.lerp(targetMouse, 0.06);
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
      material.uniforms.uTime.value = 12.0;
      renderer.render(scene, camera);
    } else {
      play();
    }

    // Scroll morfea el shader (la transición, estilo infinitefield).
    let st: ScrollTrigger | undefined;
    if (!reduce) {
      registerGsap();
      st = ScrollTrigger.create({
        trigger: canvas,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          material.uniforms.uScroll.value = self.progress;
        },
      });
    }

    const onResize = () => resize();
    const onVis = () => (document.hidden ? pause() : play());
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      targetMouse.set(nx * 7, ny * 4 - 1.3);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) window.addEventListener("pointermove", onMove);

    return () => {
      pause();
      st?.kill();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [amp]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  );
}
