import type { Metadata, Viewport } from "next";
import { AtmosphereDynamic } from "@/components/atmosphere/AtmosphereDynamic";
import { MemoryThread } from "@/components/MemoryThread";
import { Preloader } from "@/components/Preloader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import SmoothScroll from "@/components/SmoothScroll";
import { pricing, site } from "@/content/ynara";
import { fontBody, fontDisplay } from "./fonts";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Ynara",
      url: `https://${site.domain}`,
      logo: `https://${site.domain}/opengraph-image`,
      description: site.description,
      foundingDate: "2026",
      areaServed: "AR",
    },
    {
      "@type": "SoftwareApplication",
      name: "Ynara",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "iOS, Android",
      description: site.description,
      inLanguage: "es-AR",
      offers: pricing.plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.name === "Free" ? "0" : "4",
        priceCurrency: "USD",
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: "Ynara · La única presencia que necesitás",
    template: "%s · Ynara",
  },
  description: site.description,
  applicationName: "Ynara",
  alternates: { canonical: "/" },
  keywords: [
    "Ynara",
    "asistente personal",
    "IA",
    "memoria",
    "productividad",
    "bienestar",
    "rioplatense",
    "self-hosted",
  ],
  authors: [{ name: "Ynara" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: `https://${site.domain}`,
    siteName: "Ynara",
    title: "Ynara · La única presencia que necesitás",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ynara · La única presencia que necesitás",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD estático y controlado */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD estático y controlado
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-[var(--r-md)] focus:bg-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <AtmosphereDynamic />
        <SmoothScroll />
        <Preloader />
        <MemoryThread />
        <SiteNav />
        <main id="top" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
