"use client";

import type { CSSProperties, ReactNode } from "react";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { cn } from "@/lib/cn";

type Align = "center" | "left" | "right" | "between" | "edges";
type Scrim = "radial" | "bottom" | "none";
type Corners = { tl?: ReactNode; tr?: ReactNode; bl?: ReactNode; br?: ReactNode };
export type WipeTone = "navy" | "ivory" | "void";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  units?: number;
  sticky?: boolean;
  align?: Align;
  scrim?: Scrim;
  scrimX?: string;
  scrimY?: string;
  corners?: Corners;
  bleed?: boolean;
  /** Panel wipe de ENTRADA (alma tiwis): franja contrastante en el flujo. */
  wipe?: WipeTone;
};

const alignMap: Record<Exclude<Align, "edges">, string> = {
  center: "items-center justify-center text-center",
  left: "items-center justify-start text-left",
  right: "items-center justify-end text-right",
  between: "items-center justify-between",
};

const cornerPos = {
  tl: "left-[var(--gutter)] top-[clamp(1.5rem,5vh,3rem)] origin-top-left",
  tr: "right-[var(--gutter)] top-[clamp(1.5rem,5vh,3rem)] text-right origin-top-right",
  bl: "left-[var(--gutter)] bottom-[clamp(1.5rem,5vh,3rem)] origin-bottom-left",
  br: "right-[var(--gutter)] bottom-[clamp(1.5rem,5vh,3rem)] text-right origin-bottom-right",
} as const;

const WIPE_BG: Record<WipeTone, string> = {
  navy: "var(--c-navy)",
  ivory: "var(--c-paper)",
  void: "var(--c-void)",
};

/**
 * Panel wipe en el flujo (alma tiwis): una franja contrastante de ~90svh que se
 * scrollea entre capítulos y cubre la forma al pasar. Sin JS → no puede romperse
 * ni quedar tapando. Marca centrada para que sea una transición de marca, no un
 * vacío. Se omite en reduced-motion (el contenido fluye directo).
 */
function WipePanel({ tone }: { tone: WipeTone }) {
  const markVariant = tone === "ivory" ? "blue" : "ivory";
  return (
    <div
      aria-hidden
      className="motion-reduce:hidden flex h-[90svh] w-full items-center justify-center"
      style={{ background: WIPE_BG[tone] }}
    >
      <YnaraMark size={40} variant={markVariant} className="opacity-80" />
    </div>
  );
}

/**
 * Un capítulo del viaje continuo. Es un ESCENARIO, no una caja: la forma viva
 * llena el viewport; el contenido es (a) UN tipo masivo y (b) micro-labels en
 * las esquinas. Opcionalmente entra precedido por un panel wipe (alma tiwis).
 */
export function Scene({
  id,
  children,
  className,
  units = 1,
  sticky = false,
  align = "center",
  scrim = "radial",
  scrimX = "30%",
  scrimY = "50%",
  corners,
  bleed = false,
  wipe,
}: Props) {
  const scrimClass = scrim === "radial" ? "scrim-radial" : scrim === "bottom" ? "scrim-bottom" : "";
  // El panel wipe (90svh) suma su alto para no comerse el scroll del contenido.
  const style = {
    minHeight: `${(units + (wipe ? 0.9 : 0)) * 100}svh`,
    "--sx": scrimX,
    "--sy": scrimY,
  } as CSSProperties;

  return (
    <section id={id} className={cn("scene", className)} style={style}>
      {wipe ? <WipePanel tone={wipe} /> : null}
      <div
        className={cn(
          "relative flex w-full",
          sticky ? "sticky top-0 h-[100svh]" : "min-h-[100svh]",
          bleed && "overflow-clip",
          scrimClass,
        )}
      >
        {/* Desktop: micro-labels en las 4 esquinas (alma infinitefield). */}
        <div className="hidden sm:block">
          {corners?.tl && (
            <div className={cn("absolute z-[3] max-w-[45vw]", cornerPos.tl)}>{corners.tl}</div>
          )}
          {corners?.tr && (
            <div className={cn("absolute z-[3] max-w-[45vw]", cornerPos.tr)}>{corners.tr}</div>
          )}
          {corners?.bl && (
            <div className={cn("absolute z-[3] max-w-[60vw]", cornerPos.bl)}>{corners.bl}</div>
          )}
          {corners?.br && (
            <div className={cn("absolute z-[3] max-w-[60vw]", cornerPos.br)}>{corners.br}</div>
          )}
        </div>
        {/* Mobile: las esquinas se apilan al fondo para no colisionar. */}
        {corners && (corners.tl || corners.tr || corners.bl || corners.br) ? (
          <div className="absolute inset-x-0 bottom-0 z-[3] flex flex-col gap-5 px-[var(--gutter)] pb-[clamp(1.5rem,5vh,3rem)] sm:hidden">
            {corners.tl}
            {corners.bl}
            {corners.br}
            {corners.tr}
          </div>
        ) : null}

        {align === "edges" ? (
          <div className="relative z-[1] flex h-full w-full items-center justify-center">
            {children}
          </div>
        ) : (
          <div className={cn("flex h-full w-full flex-col", alignMap[align])}>
            <div className="scene-shell">{children}</div>
          </div>
        )}
      </div>
    </section>
  );
}
