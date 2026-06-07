"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, reducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
    __ynaraIntroDone?: boolean;
  }
}

/**
 * Smooth scroll Lenis sincronizado con GSAP ScrollTrigger.
 * Si va a correr el preloader (intro no vista y sin reduced-motion), arranca
 * en estado detenido — el preloader lo libera al levantar el telón.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    window.__lenis = lenis;

    // Si el telón va a correr, no dejar scrollear hasta que termine.
    let introWillPlay = false;
    try {
      introWillPlay = sessionStorage.getItem("ynara-intro") !== "1";
    } catch {}
    if (introWillPlay && !window.__ynaraIntroDone) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
