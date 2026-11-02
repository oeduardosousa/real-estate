import type { PanelListing, Status } from "./types";

export type StatusFilter = Status | "todos";
export type SortKey = "recentes" | "titulo" | "preco-desc" | "preco-asc";

export const SORT_LABELS: Record<SortKey, string> = {
  recentes: "Atualizados recentemente",
  titulo: "Título (A a Z)",
  "preco-desc": "Maior preço",
  "preco-asc": "Menor preço",
};

/** Lowercase, no accents: "Funcionários" matches "funcionarios". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export interface ListingFilter {
  status: StatusFilter;
  query: string;
}

/** Search looks at title, neighborhood, city and the owner's name. */
export function filterListings(
  listings: readonly PanelListing[],
  filter: ListingFilter,
  ownerName: (ownerId: string) => string,
): PanelListing[] {
  const query = normalizeText(filter.query);
  return listings.filter((listing) => {
    if (filter.status !== "todos" && listing.status !== filter.status) return false;
    if (!query) return true;
    const haystack = normalizeText(
      [listing.title, listing.neighborhood, listing.city, ownerName(listing.ownerId)].join(" "),
    );
    return haystack.includes(query);
  });
}

export function sortListings(listings: readonly PanelListing[], key: SortKey): PanelListing[] {
  const sorted = [...listings];
  switch (key) {
    case "recentes":
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id - b.id);
    case "titulo":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    case "preco-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "preco-asc":
      return sorted.sort((a, b) => a.price - b.price);
  }
}
