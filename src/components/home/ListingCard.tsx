import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Scene, TONES } from "@/components/ui/Scene";
import type { ListingCore } from "@/data/types";
import { formatPrice, formatSpecs, purposeLabel } from "@/lib/format";

/**
 * Listing card: a rounded scene with a purpose chip, then neighbourhood, title, specs and price.
 * One link, so the whole card is the target. On hover the image breathes in, its ridges drift apart
 * and the round arrow turns.
 */
export function ListingCard({
  listing,
  index,
  headingLevel = 3,
}: {
  listing: ListingCore;
  index: number;
  /** 2 where no h2 precedes the cards (the listings index), 3 under a section heading. */
  headingLevel?: 2 | 3;
}) {
  const Title = `h${headingLevel}` as const;
  return (
    <article className="lcard">
      <TransitionLink href={`/imoveis/${listing.slug}`} className="lcard-link">
        <div className="lcard-media">
          <Scene
            label={`${listing.title}, ${listing.neighborhood}. Imagem ilustrativa.`}
            tone={TONES[index % TONES.length]}
            variant={index}
          />
          <span className="chip">{purposeLabel[listing.purpose]}</span>
          <span className="lcard-go" aria-hidden="true">
            <ArrowUpRight size={20} strokeWidth={1.8} />
          </span>
        </div>

        <div className="lcard-body">
          <div>
            <p className="lcard-where">
              {listing.neighborhood}
              {listing.city !== "Belo Horizonte" && ` · ${listing.city}`}
            </p>
            <Title className="t-title lcard-title">{listing.title}</Title>
            <p className="t-small num">{formatSpecs(listing)}</p>
          </div>
          <p className="lcard-price num">{formatPrice(listing)}</p>
        </div>
      </TransitionLink>
    </article>
  );
}
