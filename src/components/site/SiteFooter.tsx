import { footer, site } from "@/content/ynara";

/**
 * Footer hairline — el clímax es la forma + el wordmark «Ynara» (escena de Cierre).
 * Acá sólo una línea fina de legal/meta, opaca, que cierra la página sin competir.
 */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-hair bg-void">
      <div className="shell flex flex-col gap-3 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-caption">
          © 2026 {site.name} · {site.signoff}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {footer.columns.map((col) =>
            col.links.map((l) => (
              <a
                key={`${col.title}-${l.label}`}
                href={l.href}
                className="text-caption transition-colors hover:text-text"
              >
                {l.label}
              </a>
            )),
          )}
        </nav>
        <p className="text-caption">{footer.meta}</p>
      </div>
    </footer>
  );
}
