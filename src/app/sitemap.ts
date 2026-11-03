import type { MetadataRoute } from "next";
import { site } from "@/content/ynara";

// Prerenderizado en build (requerido con output: "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${site.domain}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
