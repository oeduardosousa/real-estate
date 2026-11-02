import { legalLinks, navLinks, neighborhoods, site } from "@/data";
import { MotionSwitch } from "./MotionSwitch";
import { TransitionLink } from "./TransitionLink";

/**
 * Noite theme. Giant wordmark on one line, cropped by the viewport edge; neighbourhoods; facts from
 * BRIEF.md only (no phone or e-mail exists in the brief, so none is shown); legal links and the
 * mandatory concept-project line.
 */
export function Footer() {
  return (
    <footer id="rodape" className="theme-noite relative overflow-hidden bg-bg text-fg">
      <div className="container-page grid gap-16 pb-16 pt-[clamp(5rem,10vw,9rem)] lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <p className="type-label text-fg-muted">Curral Residências</p>
          <p className="mt-6 max-w-[16ch] text-headline">{site.tagline}</p>
          <p className="mt-8 max-w-measure text-fg-secondary">
            Belo Horizonte e região metropolitana, Minas Gerais. Fundada em {site.founded}, com uma equipe de{" "}
            {site.teamSize} pessoas.
          </p>
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-2 lg:col-start-6">
          <p className="type-label text-fg-muted">Navegar</p>
          <ul className="mt-4">
            {[{ label: "Início", href: "/" }, ...navLinks].map((link) => (
              <li key={link.href}>
                <TransitionLink href={link.href} className="inline-flex min-h-touch items-center">
                  <span className="link-quiet">{link.label}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="type-label text-fg-muted">Bairros atendidos</p>
          <ul className="mt-4 columns-2 gap-6 text-fg-secondary">
            {neighborhoods.map((n) => (
              <li key={n.name} className="py-1">
                {n.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <MotionSwitch />
        </div>
      </div>

      <div className="container-page flex flex-col gap-4 border-t border-line py-8 text-label text-fg-muted md:flex-row md:items-center md:justify-between">
        <p>
          {site.disclaimer.pt} <span lang="en">{site.disclaimer.en}</span>
        </p>
        <ul className="flex gap-6">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <TransitionLink href={link.href} className="inline-flex min-h-touch items-center hover:text-fg">
                {link.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative giant wordmark (Display XL, weight 300), sized to bleed past the viewport edge. */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap pb-[0.04em] pl-gutter text-[11.5vw] font-light leading-[0.8] tracking-[-0.035em] text-fg/90"
      >
        Curral Residências
      </p>
    </footer>
  );
}
