import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
// Ícono fijo: se prerenderiza en build (requerido con output: "export").
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0c12",
      }}
    >
      {/* Diamante de presencia — rotated square */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 12,
          background: "linear-gradient(135deg, #8165a3, #4B7EE6)",
          transform: "rotate(45deg)",
        }}
      />
    </div>,
    size,
  );
}
