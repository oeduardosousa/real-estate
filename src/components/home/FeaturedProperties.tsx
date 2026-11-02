import { TransitionLink } from "@/components/layout/TransitionLink";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { featuredListings } from "@/data";
import { FeaturedTrack } from "./FeaturedTrack";

/**
 * Featured properties (listings 1–6 from BRIEF.md). The "Ver todos os imóveis" link sits before the
 * pinned track so keyboard and screen-reader users can skip past it (DESIGN.md "Accessibility").
 */
export function FeaturedProperties() {
  return (
    <section id="destaques" aria-labelledby="destaques-titulo" className="bg-bg pt-section">
      <div className="container-page grid gap-8 pb-16 lg:grid-cols-12 lg:gap-x-6 lg:pb-24">
        <div className="lg:col-span-8">
          <SectionLabel>Imóveis em destaque</SectionLabel>
          <SplitHeading id="destaques-titulo" className="mt-8 max-w-[14ch] text-display">
            Seis imóveis para olhar com calma.
          </SplitHeading>
        </div>
        <Reveal className="flex items-end lg:col-span-4 lg:col-start-9">
          <TransitionLink href="/imoveis" className="type-label inline-flex min-h-touch items-center">
            <span className="link-quiet">Ver todos os imóveis</span>
          </TransitionLink>
        </Reveal>
      </div>

      <FeaturedTrack listings={featuredListings} />
    </section>
  );
}
