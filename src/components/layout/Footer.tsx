import { legalLinks, navLinks, neighborhoods, site } from "@/data";
import { MotionSwitch } from "./MotionSwitch";
import { TransitionLink } from "./TransitionLink";

/**
 * Dark rounded panel. Facts come from BRIEF.md only (no phone or e-mail exists in the brief, so none is
 * shown); legal links and the mandatory concept-project line close it, under a giant wordmark.
 */
export function Footer() {
  return (
    <footer id="rodape" className="footer-wrap">
      <div className="footer on-dark" data-ambient>
        <div className="footer-glow" aria-hidden="true" />
        <div className="footer-grid">
          <div className="footer-intro">
            <p className="foot-label">Curral Residências</p>
            <p className="footer-tagline">{site.tagline}</p>
            <p className="footer-text">
              Belo Horizonte e região metropolitana, Minas Gerais. Fundada em {site.founded}, com uma equipe de {site.teamSize} pessoas.
            </p>
          </div>

          <nav aria-label="Rodapé">
            <p className="foot-label">Navegar</p>
            <ul className="footer-list">
              {[{ label: "Início", href: "/" }, ...navLinks].map((link) => (
                <li key={link.href}>
                  <TransitionLink href={link.href} className="footer-link">
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="foot-label">Bairros atendidos</p>
            <ul className="footer-list footer-cols">
              {neighborhoods.map((n) => (
                <li key={n.name}>{n.name}</li>
              ))}
            </ul>
          </div>

          <MotionSwitch />
        </div>

        <p className="footer-word" aria-hidden="true">
          Curral <em>Residências</em>
        </p>

        <div className="footer-base">
          <p>
            {site.disclaimer.pt} <span lang="en">{site.disclaimer.en}</span>
          </p>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.href}>
                <TransitionLink href={link.href} className="footer-link">
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
