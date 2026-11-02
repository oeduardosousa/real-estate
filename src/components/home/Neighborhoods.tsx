"use client";

import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { neighborhoodsOf } from "@/painel/model/neighborhoods";
import { usePanelState } from "@/painel/ui/hooks";

/**
 * Neighbourhoods as large pills, each linking to the listings index filtered by that neighbourhood.
 * The list is derived from the listings that are available right now: a neighbourhood appears when a
 * listing is published or reserved there and disappears when the last one is retired, sold or let.
 * It reads the same data the company view edits, so changes made there show up here.
 */
export function Neighborhoods() {
  const { listings } = usePanelState();
  const hoods = useMemo(() => neighborhoodsOf(listings), [listings]);

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
            {hoods.length === 0
              ? "No momento não há imóveis disponíveis."
              : `Temos imóveis disponíveis em ${hoods.length} ${hoods.length === 1 ? "bairro" : "bairros"}. Escolha um para ver.`}
          </Reveal>
        </div>

        <ul className="hoods-cloud">
          {hoods.map((neighborhood, index) => (
            <Reveal as="li" key={`${neighborhood.name}-${neighborhood.city}`} delay={Math.min(index, 8) * 0.04}>
              <TransitionLink
                href={`/imoveis?bairro=${encodeURIComponent(neighborhood.name)}`}
                className="pill-link"
              >
                <span className="pill-name">{neighborhood.name}</span>
                {neighborhood.city !== "Belo Horizonte" && <span className="pill-city">{neighborhood.city}</span>}
                <span className="pill-count num">
                  {neighborhood.count} {neighborhood.count === 1 ? "imóvel" : "imóveis"}
                </span>
                <ArrowUpRight className="pill-arrow" size={20} strokeWidth={1.6} aria-hidden="true" />
              </TransitionLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
