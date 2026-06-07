"use client";

import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { nav } from "@/content/ynara";
import { cn } from "@/lib/cn";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 [transition-timing-function:var(--ease-soft)]",
        scrolled
          ? "border-b border-hair bg-[rgba(10,12,18,0.72)] backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        className="shell flex items-center justify-between"
        style={{ height: "var(--nav-h)" }}
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <YnaraMark size={30} variant="ivory" />
          <span className="font-display text-lg font-semibold tracking-tight text-text-bright">
            Ynara
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-soft transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Magnetic strength={0.4}>
            <Button href={nav.cta.href} size="md">
              {nav.cta.label}
            </Button>
          </Magnetic>
        </div>

        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-[var(--r-md)] border border-hair text-text md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={cn(
                "absolute left-0 block h-[1.5px] w-4 bg-current transition-all",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 block h-[1.5px] w-4 bg-current transition-all",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-[1.5px] w-4 bg-current transition-all",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-hair bg-[rgba(10,12,18,0.94)] backdrop-blur-xl md:hidden"
        >
          <div className="shell flex flex-col gap-1 py-5">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--r-md)] px-2 py-3 text-text-soft transition-colors hover:bg-white/5 hover:text-text"
              >
                {l.label}
              </a>
            ))}
            <Button href={nav.cta.href} size="lg" className="mt-3 w-full">
              {nav.cta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
