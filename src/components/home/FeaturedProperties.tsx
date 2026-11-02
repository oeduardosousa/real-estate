import { TransitionLink } from "@/components/layout/TransitionLink";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { featuredListings } from "@/data";
import { ListingCard } from "./ListingCard";

/** Listings 1–6 from BRIEF.md on an editorial grid: sizes and offsets vary so the page never reads as a table. */
export function FeaturedProperties() {
  return (
    <section id="destaques" aria-labelledby="destaques-titulo" className="section featured">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Imóveis em destaque
              </p>
            </Reveal>
            <Heading id="destaques-titulo" className="t-display section-title" text="Imóveis para *olhar com calma*." />
          </div>
          <Reveal className="section-aside">
            <TransitionLink href="/imoveis" className="link">
              Ver todos os imóveis
            </TransitionLink>
          </Reveal>
        </div>

        <ul className="featured-grid">
          {featuredListings.map((listing, index) => (
            <Reveal as="li" key={listing.id} className="featured-item" delay={(index % 3) * 0.08}>
              <ListingCard listing={listing} index={index} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
