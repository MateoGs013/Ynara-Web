import type { MetadataRoute } from "next";
import { site } from "@/content/ynara";

// Prerenderizado en build (requerido con output: "export").
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = `https://${site.domain}`;
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/lab/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
