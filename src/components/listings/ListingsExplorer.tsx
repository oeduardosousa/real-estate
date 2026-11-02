"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/home/ListingCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { listings } from "@/data";
import type { ListingCore, ListingPurpose, ListingType } from "@/data/types";
import { formatMillions } from "@/lib/format";

const TYPES: readonly ListingType[] = ["Apartamento", "Casa", "Casa em condomínio", "Cobertura", "Loft", "Studio"];
const BEDROOMS = [1, 2, 3, 4] as const;
const MAX_PRICES = [3_000_000, 5_000_000, 7_000_000, 10_000_000] as const;
const SORTS = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "maior-area", label: "Maior área" },
] as const;
type Sort = (typeof SORTS)[number]["value"];

interface Filters {
  purpose: ListingPurpose | "";
  type: string;
  neighborhood: string;
  bedrooms: number;
  maxPrice: number;
  sort: Sort;
}

const NEIGHBORHOODS = [...new Set(listings.map((listing) => listing.neighborhood))].sort((a, b) => a.localeCompare(b, "pt-BR"));

function readFilters(params: URLSearchParams): Filters {
  const purpose = params.get("finalidade");
  const sort = params.get("ordem");
  return {
    purpose: purpose === "venda" || purpose === "aluguel" ? purpose : "",
    type: TYPES.includes(params.get("tipo") as ListingType) ? (params.get("tipo") as string) : "",
    neighborhood: NEIGHBORHOODS.includes(params.get("bairro") ?? "") ? (params.get("bairro") as string) : "",
    bedrooms: Number(params.get("quartos")) || 0,
    maxPrice: Number(params.get("preco")) || 0,
    sort: SORTS.some((option) => option.value === sort) ? (sort as Sort) : "relevancia",
  };
}

/** Sales and rentals never compare on price, so price sorts keep sales first. */
function sortListings(items: ListingCore[], sort: Sort) {
  const byPurpose = (a: ListingCore, b: ListingCore) => (a.purpose === b.purpose ? 0 : a.purpose === "venda" ? -1 : 1);
  const sorted = [...items];
  if (sort === "menor-preco") sorted.sort((a, b) => byPurpose(a, b) || a.price - b.price);
  if (sort === "maior-preco") sorted.sort((a, b) => byPurpose(a, b) || b.price - a.price);
  if (sort === "maior-area") sorted.sort((a, b) => b.area - a.area);
  return sorted;
}

function applyFilters(filters: Filters) {
  const priceActive = filters.purpose === "venda" && filters.maxPrice > 0;
  const result = listings.filter(
    (listing) =>
      (!filters.purpose || listing.purpose === filters.purpose) &&
      (!filters.type || listing.type === filters.type) &&
      (!filters.neighborhood || listing.neighborhood === filters.neighborhood) &&
      listing.bedrooms >= filters.bedrooms &&
      (!priceActive || listing.price <= filters.maxPrice),
  );
  return sortListings(result, filters.sort);
}

/**
 * The "all properties" portal. Filter state lives in the URL (?finalidade=&tipo=&bairro=&quartos=&preco=&ordem=)
 * so a filtered view can be shared or reloaded. Everything is computed from the typed data; nothing is fetched.
 */
export function ListingsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = readFilters(searchParams);
  const results = applyFilters(filters);

  const update = (changes: Partial<Record<"finalidade" | "tipo" | "bairro" | "quartos" | "preco" | "ordem", string>>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const hasFilters = Boolean(filters.purpose || filters.type || filters.neighborhood || filters.bedrooms || filters.maxPrice);
  const showPrice = filters.purpose === "venda";

  return (
    <>
      <form className="filters" role="search" aria-label="Filtrar imóveis" onSubmit={(event) => event.preventDefault()}>
        <div className="seg" role="group" aria-label="Finalidade">
          {([["", "Todos"], ["venda", "Comprar"], ["aluguel", "Alugar"]] as const).map(([value, label]) => (
            <button
              key={label}
              type="button"
              className="seg-btn"
              aria-pressed={filters.purpose === value}
              onClick={() => update({ finalidade: value, preco: value === "venda" ? String(filters.maxPrice || "") : "" })}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="field">
          <span>Tipo</span>
          <select value={filters.type} onChange={(event) => update({ tipo: event.target.value })}>
            <option value="">Todos</option>
            {TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Bairro</span>
          <select value={filters.neighborhood} onChange={(event) => update({ bairro: event.target.value })}>
            <option value="">Todos</option>
            {NEIGHBORHOODS.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Quartos</span>
          <select value={filters.bedrooms || ""} onChange={(event) => update({ quartos: event.target.value })}>
            <option value="">Qualquer</option>
            {BEDROOMS.map((count) => (
              <option key={count} value={count}>
                {count}+
              </option>
            ))}
          </select>
        </label>

        {showPrice && (
          <label className="field">
            <span>Preço até</span>
            <select value={filters.maxPrice || ""} onChange={(event) => update({ preco: event.target.value })}>
              <option value="">Sem limite</option>
              {MAX_PRICES.map((price) => (
                <option key={price} value={price}>
                  {formatMillions(price)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="field">
          <span>Ordenar</span>
          <select value={filters.sort} onChange={(event) => update({ ordem: event.target.value === "relevancia" ? "" : event.target.value })}>
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="results-bar">
        <p className="t-small" role="status" aria-live="polite">
          {results.length === 1 ? "1 imóvel encontrado" : `${results.length} imóveis encontrados`}
        </p>
        {hasFilters && (
          <button type="button" className="link" onClick={() => router.replace(pathname, { scroll: false })}>
            Limpar filtros
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="results-grid">
          {results.map((listing, index) => (
            <Reveal as="li" key={listing.id} delay={(index % 3) * 0.07}>
              <ListingCard listing={listing} index={listing.id - 1} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p className="t-headline">Nenhum imóvel com esses filtros.</p>
          <p className="t-lead">Tente ampliar a busca ou remover algum critério.</p>
          <Button variant="primary" onClick={() => router.replace(pathname, { scroll: false })}>
            Limpar filtros
          </Button>
        </div>
      )}
    </>
  );
}

/** Static fallback while the URL is read on the client. */
export function ListingsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="filters filters--skeleton" />
      <ul className="results-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index}>
            <div className="skeleton skeleton--media" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </li>
        ))}
      </ul>
    </div>
  );
}
