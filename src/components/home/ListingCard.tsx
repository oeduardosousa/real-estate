import { TransitionLink } from "@/components/layout/TransitionLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { ListingCore } from "@/data/types";
import { formatPrice, formatSpecs, purposeLabel } from "@/lib/format";
import type { RidgeShape } from "@/lib/ridge";

const SHAPES: readonly RidgeShape[] = ["main", "mid", "far"];

/**
 * Listing card (DESIGN.md "Listing card"): 4:5 image, no container around the text, neighbourhood,
 * title, specs and price. The card is one link, so the whole card is the target. Favourite and
 * compare controls arrive with the listings index, where their state lives.
 */
export function ListingCard({ listing, index }: { listing: ListingCore; index: number }) {
  return (
    <article className="group">
      <TransitionLink
        href={`/imoveis/${listing.slug}`}
        data-cursor="Ver"
        className="block outline-offset-4"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="card-image absolute inset-0">
            <ImagePlaceholder
              alt={`${listing.title}, ${listing.neighborhood}. Imagem ilustrativa.`}
              shape={SHAPES[index % SHAPES.length]}
            />
          </div>
          <span className="type-label absolute left-4 top-4 bg-pedra px-3 py-2 text-grafite">
            {purposeLabel[listing.purpose]}
          </span>
        </div>

        <div className="mt-5">
          <p className="type-label text-fg-muted">
            {listing.neighborhood}
            {listing.city !== "Belo Horizonte" && ` · ${listing.city}`}
          </p>
          <h3 className="mt-2 text-title">
            <span className="link-quiet card-title">{listing.title}</span>
          </h3>
          <p className="mt-1 tabular-nums text-fg-secondary">{formatSpecs(listing)}</p>
          <p className="type-price mt-4">{formatPrice(listing)}</p>
        </div>
      </TransitionLink>
    </article>
  );
}
