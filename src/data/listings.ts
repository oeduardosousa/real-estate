import type { ListingCore } from "./types";

/**
 * The 12 fictional listings from BRIEF.md. Only the facts in the brief's table are set here;
 * descriptions, images, coordinates and extra costs arrive in the content phase.
 * Listings 1–6 are featured. Prices are BRL (venda: total, aluguel: per month).
 */
export const listings: readonly ListingCore[] = [
  { id: 1, slug: "cobertura-horizonte", title: "Cobertura Horizonte", type: "Cobertura", purpose: "venda", price: 6_800_000, area: 420, bedrooms: 4, neighborhood: "Belvedere", city: "Belo Horizonte", featured: true },
  { id: 2, slug: "casa-serra-do-curral", title: "Casa Serra do Curral", type: "Casa", purpose: "venda", price: 9_500_000, area: 680, bedrooms: 5, neighborhood: "Mangabeiras", city: "Belo Horizonte", featured: true },
  { id: 3, slug: "apartamento-lourdes-14", title: "Apartamento Lourdes 14", type: "Apartamento", purpose: "venda", price: 4_200_000, area: 240, bedrooms: 4, neighborhood: "Lourdes", city: "Belo Horizonte", featured: true },
  { id: 4, slug: "loft-savassi", title: "Loft Savassi", type: "Loft", purpose: "venda", price: 1_350_000, area: 95, bedrooms: 1, neighborhood: "Savassi", city: "Belo Horizonte", featured: true },
  { id: 5, slug: "casa-vale-do-sol", title: "Casa Vale do Sol", type: "Casa em condomínio", purpose: "venda", price: 8_900_000, area: 750, bedrooms: 5, neighborhood: "Vale do Sol", city: "Nova Lima", featured: true },
  { id: 6, slug: "apartamento-santo-agostinho", title: "Apartamento Santo Agostinho", type: "Apartamento", purpose: "venda", price: 2_950_000, area: 180, bedrooms: 3, neighborhood: "Santo Agostinho", city: "Belo Horizonte", featured: true },
  { id: 7, slug: "residencia-pampulha-lago", title: "Residência Pampulha Lago", type: "Casa", purpose: "venda", price: 5_400_000, area: 520, bedrooms: 4, neighborhood: "Pampulha", city: "Belo Horizonte", featured: false },
  { id: 8, slug: "studio-funcionarios", title: "Studio Funcionários", type: "Studio", purpose: "aluguel", price: 3_800, area: 48, bedrooms: 1, neighborhood: "Funcionários", city: "Belo Horizonte", featured: false },
  { id: 9, slug: "apartamento-vila-da-serra", title: "Apartamento Vila da Serra", type: "Apartamento", purpose: "venda", price: 3_600_000, area: 210, bedrooms: 3, neighborhood: "Vila da Serra", city: "Belo Horizonte", featured: false },
  { id: 10, slug: "casa-sion-jardim", title: "Casa Sion Jardim", type: "Casa", purpose: "venda", price: 4_750_000, area: 390, bedrooms: 4, neighborhood: "Sion", city: "Belo Horizonte", featured: false },
  { id: 11, slug: "cobertura-serra", title: "Cobertura Serra", type: "Cobertura", purpose: "venda", price: 5_900_000, area: 350, bedrooms: 4, neighborhood: "Serra", city: "Belo Horizonte", featured: false },
  { id: 12, slug: "apartamento-funcionarios", title: "Apartamento Funcionários", type: "Apartamento", purpose: "aluguel", price: 12_500, area: 130, bedrooms: 2, neighborhood: "Funcionários", city: "Belo Horizonte", featured: false },
];

export function getListing(slug: string) {
  return listings.find((listing) => listing.slug === slug);
}

export const featuredListings = listings.filter((listing) => listing.featured);
