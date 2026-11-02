import type { ListingCore } from "@/data/types";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** "R$ 6.800.000" for sales, "R$ 3.800/mês" for rentals. */
export function formatPrice(listing: Pick<ListingCore, "price" | "purpose">): string {
  const value = brl.format(listing.price).replace(/\s/g, " ");
  return listing.purpose === "aluguel" ? `${value}/mês` : value;
}

/** "420 m² · 4 quartos". Only facts the brief gives for every listing. */
export function formatSpecs(listing: Pick<ListingCore, "area" | "bedrooms">): string {
  const rooms = listing.bedrooms === 1 ? "1 quarto" : `${listing.bedrooms} quartos`;
  return `${listing.area} m² · ${rooms}`;
}

export const purposeLabel = { venda: "Venda", aluguel: "Aluguel" } as const;

/** "R$ 7.800" for fees and costs that carry no purpose suffix. */
export function formatBRL(value: number): string {
  return brl.format(value).replace(/\s/g, " ");
}

/** Compact sale prices for filter labels: "R$ 3 mi". */
export function formatMillions(value: number): string {
  return `R$ ${value / 1_000_000} mi`;
}
