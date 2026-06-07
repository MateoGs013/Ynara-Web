import { RevealText } from "@/components/motion/RevealText";
import { YnaraMark } from "@/components/ui/YnaraMark";
import { footer, site } from "@/content/ynara";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-hair">
      {/* Wordmark masivo — cierre estilo editorial */}
      <div className="shell overflow-hidden pt-[clamp(4rem,8vw,8rem)]">
        <RevealText
          as="p"
          text="Ynara"
          stagger={0.05}
          className="select-none text-[clamp(4.5rem,23vw,21rem)] font-display font-bold leading-[0.74] tracking-[-0.05em] text-text-bright"
        />
      </div>
      <div className="shell pb-[clamp(3rem,3rem+5vw,7rem)] pt-12 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <YnaraMark size={38} variant="gradient" />
              <span className="font-display text-2xl font-semibold text-text-bright">
                Ynara
              </span>
            </div>
            <p className="text-body-lg mt-5 max-w-xs">{footer.tagline}</p>
            <p className="text-caption mt-6">{site.domain}</p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-caption uppercase tracking-[0.2em] text-text-muted">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-text-soft transition-colors hover:text-text"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hair pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption">{footer.meta}</p>
          <p className="text-caption">© 2026 Ynara · {site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
