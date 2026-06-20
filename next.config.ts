import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["three", "gsap", "lenis"],
  },
};

export default nextConfig;
