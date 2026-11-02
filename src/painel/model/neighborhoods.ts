import type { PanelListing } from "./types";

export interface AvailableNeighborhood {
  name: string;
  city: string;
  count: number;
}

/** Statuses in which a listing is on the public site and can be asked about. */
export function isAvailable(listing: Pick<PanelListing, "status">): boolean {
  return listing.status === "Publicado" || listing.status === "Reservado";
}

/**
 * The neighbourhoods that currently have an available listing, with counts. Most listings first, then
 * alphabetical, so the order is stable between renders.
 */
export function neighborhoodsOf(
  listings: readonly Pick<PanelListing, "status" | "neighborhood" | "city">[],
): AvailableNeighborhood[] {
  const byKey = new Map<string, AvailableNeighborhood>();
  for (const listing of listings) {
    const name = listing.neighborhood.trim();
    if (!isAvailable(listing) || name === "") continue;
    const key = `${name}|${listing.city}`;
    const entry = byKey.get(key) ?? { name, city: listing.city, count: 0 };
    entry.count += 1;
    byKey.set(key, entry);
  }
  return [...byKey.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));
}
