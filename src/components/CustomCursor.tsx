"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/motion";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const d = dot.current;
    const r = ring.current;
    if (!fine || reducedMotion() || !d || !r) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const interactive = (e.target as HTMLElement)?.closest?.(
        "a,button,[data-cursor],input,textarea",
      );
      gsap.to(r, { scale: interactive ? 1.8 : 1, duration: 0.3 });
      gsap.to(d, { scale: interactive ? 0 : 1, duration: 0.3 });
    };
    const hide = (e: PointerEvent) => {
      if (!e.relatedTarget) gsap.to([d, r], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", hide);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-10 w-10 rounded-full border border-white"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 rounded-full bg-white"
        style={{ mixBlendMode: "difference" }}
      />
    </>
  );
}
