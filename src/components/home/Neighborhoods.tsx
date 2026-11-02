import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { listings, neighborhoods, stats } from "@/data";

const served = stats.find((stat) => stat.label === "bairros atendidos")?.value;

/**
 * The neighbourhoods named in the brief as large pills, each linking to the listings index filtered by
 * that neighbourhood. Counts come from the listings data. No map here: the interactive map belongs to
 * the listings phase.
 */
export function Neighborhoods() {
  return (
    <section id="bairros" aria-labelledby="bairros-titulo" className="section hoods">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Bairros
              </p>
            </Reveal>
            <Heading id="bairros-titulo" className="t-display section-title" text="De Lourdes a *Vale do Sol*." />
          </div>
          <Reveal as="p" className="t-lead section-aside">
            Atendemos {served} bairros em Belo Horizonte e Nova Lima. Escolha um para ver os imóveis.
          </Reveal>
        </div>

        <ul className="hoods-cloud">
          {neighborhoods.map((neighborhood, index) => {
            const count = listings.filter((listing) => listing.neighborhood === neighborhood.name).length;
            return (
              <Reveal as="li" key={neighborhood.name} delay={Math.min(index, 8) * 0.04}>
                <TransitionLink
                  href={`/imoveis?bairro=${encodeURIComponent(neighborhood.name)}`}
                  className="pill-link"
                >
                  <span className="pill-name">{neighborhood.name}</span>
                  {neighborhood.city !== "Belo Horizonte" && <span className="pill-city">{neighborhood.city}</span>}
                  {count > 0 && (
                    <span className="pill-count num">
                      {count} {count === 1 ? "imóvel" : "imóveis"}
                    </span>
                  )}
                  <ArrowUpRight className="pill-arrow" size={20} strokeWidth={1.6} aria-hidden="true" />
                </TransitionLink>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
