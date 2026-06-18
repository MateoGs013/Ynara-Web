"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * CONSTELACIÓN — capa decorativa del gráfico de marca de Ynara que flota SOBRE
 * el campo (no lo reemplaza): destellos ✦, rombos ◆/◇ y puntos con bloom real.
 * Parallax sutil por mouse + scroll en dos profundidades. Titilan y flotan.
 * La opacidad se aquieta cuando el campo entra en su «plano sólido» de calma.
 * Lee el progreso del morfeo desde `window.__ynProgress` (lo escribe el driver).
 * ──────────────────────────────────────────────────────────────────────────── */

type Mark = {
  t: "spark" | "diaF" | "diaO" | "dot";
  x: number; // %
  y: number; // %
  s: number; // px
  c?: keyof typeof C;
  z?: "near" | "far";
};

const C = {
  mauve: "#c4a6d4",
  blue: "#93a3e0",
  lav: "#cfd2f0",
  rose: "#d9b3c8",
  white: "#eef0fb",
} as const;

const STAR = "M0,-44 C6,-7 7,-6 44,0 C7,6 6,7 0,44 C-6,7 -7,6 -44,0 C-7,-6 -6,-7 0,-44 Z";
const DIAMOND = "M0,-40 L40,0 L0,40 L-40,0 Z";

// Sparse y elegante — un espolvoreo, no un enjambre.
const MARKS: Mark[] = [
  { t: "spark", x: 38, y: 24, s: 26, c: "white", z: "near" },
  { t: "spark", x: 71, y: 19, s: 15, c: "lav", z: "far" },
  { t: "spark", x: 26, y: 57, s: 15, c: "white", z: "near" },
  { t: "spark", x: 84, y: 55, s: 12, c: "lav", z: "far" },
  { t: "diaF", x: 19, y: 34, s: 15, c: "mauve", z: "near" },
  { t: "diaF", x: 77, y: 33, s: 11, c: "blue", z: "far" },
  { t: "diaO", x: 51, y: 47, s: 17, c: "lav", z: "near" },
  { t: "diaF", x: 64, y: 69, s: 13, c: "rose", z: "near" },
  { t: "diaO", x: 33, y: 20, s: 12, c: "blue", z: "far" },
  { t: "dot", x: 11, y: 26, s: 9, c: "blue", z: "far" },
  { t: "dot", x: 67, y: 43, s: 7, c: "white", z: "near" },
  { t: "dot", x: 90, y: 15, s: 8, c: "white", z: "far" },
  { t: "dot", x: 31, y: 49, s: 6, c: "mauve", z: "far" },
  { t: "dot", x: 88, y: 71, s: 6, c: "rose", z: "near" },
  { t: "dot", x: 45, y: 37, s: 4, c: "white", z: "far" },
];

function MarkSvg({ m, i }: { m: Mark; i: number }) {
  const color = C[m.c ?? "lav"];
  const dur = 4.5 + (i % 6) * 0.9;
  const delay = (i % 8) * 0.55;
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${m.x}%`,
    top: `${m.y}%`,
    transform: "translate(-50%, -50%)",
    translate: "0 0",
    animation: `cn-tw ${dur}s ease-in-out ${delay}s infinite, cn-fl ${dur * 1.9}s ease-in-out ${delay}s infinite`,
    willChange: "translate, opacity",
  };

  if (m.t === "spark") {
    const w = m.s * 2.6;
    return (
      <span style={style}>
        <svg width={w} height={w} viewBox="-66 -66 132 132" aria-hidden="true">
          <path d={STAR} fill={color} filter="url(#cn-bloom)" opacity={0.6} />
          <path d={STAR} fill={C.white} />
        </svg>
      </span>
    );
  }
  if (m.t === "dot") {
    const w = m.s * 6.2;
    return (
      <span style={style}>
        <svg width={w} height={w} viewBox="-50 -50 100 100" aria-hidden="true">
          <circle r={16} fill={color} filter="url(#cn-bloom)" opacity={0.5} />
          <circle r={8} fill={C.white} />
        </svg>
      </span>
    );
  }
  const w = m.s * 2.6;
  return (
    <span style={style}>
      <svg width={w} height={w} viewBox="-60 -60 120 120" aria-hidden="true">
        {m.t === "diaF" ? (
          <>
            <path d={DIAMOND} fill={color} filter="url(#cn-bloom)" opacity={0.4} />
            <path d={DIAMOND} fill={color} />
            <path d={DIAMOND} fill="none" stroke={C.white} strokeWidth={3} opacity={0.5} />
          </>
        ) : (
          <path d={DIAMOND} fill="none" stroke={color} strokeWidth={4} />
        )}
      </svg>
    </span>
  );
}

export default function Constellation({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    // mouse objetivo / suavizado
    const mt = { x: 0, y: 0 };
    const mc = { x: 0, y: 0 };
    let scy = 0;

    const onMove = (e: PointerEvent) => {
      mt.x = (e.clientX / window.innerWidth) * 2 - 1;
      mt.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const tick = () => {
      const p =
        typeof window !== "undefined" && typeof window.__ynProgress === "number"
          ? window.__ynProgress
          : 0;
      mc.x = lerp(mc.x, mt.x, 0.06);
      mc.y = lerp(mc.y, mt.y, 0.06);
      scy = lerp(scy, p, 0.08);

      // drift hacia arriba con el scroll + parallax de mouse, por profundidad
      const driftFar = -scy * 26;
      const driftNear = -scy * 52;
      if (far.current)
        far.current.style.transform = `translate3d(${(mc.x * 10).toFixed(2)}px, ${(mc.y * 8 + driftFar).toFixed(2)}px, 0)`;
      if (near.current)
        near.current.style.transform = `translate3d(${(mc.x * 22).toFixed(2)}px, ${(mc.y * 16 + driftNear).toFixed(2)}px, 0)`;

      // se aquieta en la fase «plano sólido de calma»
      if (root.current) {
        const op = 1 - (p > 0.78 ? (p - 0.78) / 0.22 : 0) * 0.62;
        root.current.style.opacity = op.toFixed(3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const farMarks = MARKS.filter((m) => m.z === "far");
  const nearMarks = MARKS.filter((m) => m.z !== "far");

  return (
    <div
      ref={root}
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      aria-hidden
    >
      {/* defs compartidos para el bloom */}
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="cn-bloom" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
      </svg>
      <div ref={far} className="absolute inset-0" style={{ willChange: "transform" }}>
        {farMarks.map((m) => (
          <MarkSvg key={`${m.t}-${m.x}-${m.y}`} m={m} i={MARKS.indexOf(m)} />
        ))}
      </div>
      <div ref={near} className="absolute inset-0" style={{ willChange: "transform" }}>
        {nearMarks.map((m) => (
          <MarkSvg key={`${m.t}-${m.x}-${m.y}`} m={m} i={MARKS.indexOf(m)} />
        ))}
      </div>
      <style>{`
        @keyframes cn-tw { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes cn-fl { 0%,100%{translate:0 0} 50%{translate:0 -8px} }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden] span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

declare global {
  interface Window {
    __ynProgress?: number;
  }
}
