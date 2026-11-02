"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { countByStatus } from "../model/metrics";
import { can } from "../model/permissions";
import { getPersona } from "../model/personas";
import { SORT_LABELS, filterListings, sortListings, type SortKey, type StatusFilter } from "../model/query";
import { STATUSES } from "../model/types";
import { ago, editorHref } from "./format";
import { usePanelState, useSession } from "./hooks";
import { StatusBadge } from "./StatusBadge";

const ownerName = (id: string) => getPersona(id)?.name ?? "—";

/** Imóveis: every listing the persona may see, with status filters, search and sorting. */
export function ListingsTable() {
  const persona = useSession();
  const { listings } = usePanelState();
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [now] = useState(() => new Date());
  const searchId = useId();
  const sortId = useId();

  const visible = useMemo(
    () => (persona ? listings.filter((listing) => can(persona, "view", listing)) : []),
    [persona, listings],
  );
  const rows = useMemo(
    () => sortListings(filterListings(visible, { status, query }, ownerName), sort),
    [visible, status, query, sort],
  );

  if (!persona) return null;
  const counts = countByStatus(visible);
  const filtering = status !== "todos" || query.trim() !== "";

  return (
    <div>
      <header className="panel-heading panel-heading-row">
        <div>
          <h1 className="panel-title">Imóveis</h1>
          <p className="panel-lead">
            {persona.role === "corretor"
              ? "Os seus imóveis e os publicados pela equipe, que você pode consultar."
              : "Todos os imóveis da empresa."}
          </p>
        </div>
        <Link href="/painel/imoveis/novo" className="panel-button panel-button-primary">
          Novo imóvel
        </Link>
      </header>

      <div className="panel-filters" role="group" aria-label="Filtrar por status">
        <button type="button" className="panel-chip" aria-pressed={status === "todos"} onClick={() => setStatus("todos")}>
          Todos <span className="panel-chip-count">{visible.length}</span>
        </button>
        {STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            className="panel-chip"
            aria-pressed={status === item}
            onClick={() => setStatus(item)}
          >
            {item} <span className="panel-chip-count">{counts[item]}</span>
          </button>
        ))}
      </div>

      <div className="panel-toolbar">
        <div className="panel-field">
          <label htmlFor={searchId}>Buscar</label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Título, bairro ou responsável"
          />
        </div>
        <div className="panel-field">
          <label htmlFor={sortId}>Ordenar por</label>
          <select id={sortId} value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p role="status" className="panel-muted panel-result-count">
        {rows.length === 1 ? "1 imóvel" : `${rows.length} imóveis`}
      </p>

      {rows.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Nenhum imóvel encontrado.</p>
          {filtering && (
            <button
              type="button"
              className="panel-button"
              onClick={() => {
                setStatus("todos");
                setQuery("");
              }}
            >
              Limpar busca e filtro
            </button>
          )}
        </div>
      ) : (
        <div className="panel-table-wrap" tabIndex={0} role="region" aria-label="Lista de imóveis">
          <table className="panel-table panel-listings">
            <thead>
              <tr>
                <th scope="col">Imóvel</th>
                <th scope="col" className="hide-sm">
                  Tipo
                </th>
                <th scope="col" className="hide-sm">
                  Preço
                </th>
                <th scope="col">Status</th>
                <th scope="col" className="hide-sm">
                  Responsável
                </th>
                <th scope="col" className="hide-sm">
                  Atualizado
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((listing) => (
                <tr key={listing.id}>
                  <th scope="row">
                    <Link href={editorHref(listing.id)} className="panel-row-link">
                      {listing.title}
                    </Link>
                    <span className="panel-muted panel-cell-sub">
                      {listing.neighborhood || "Bairro não definido"}
                    </span>
                    {/* The Preço and Responsável columns are hidden on small screens; their values move here. */}
                    <span className="panel-muted panel-cell-sub show-sm">
                      {listing.price > 0 ? formatPrice(listing) : "Preço não definido"} · {ownerName(listing.ownerId)}
                    </span>
                  </th>
                  <td className="hide-sm">
                    {listing.type}
                    <span className="panel-muted panel-cell-sub">{listing.purpose === "venda" ? "Venda" : "Aluguel"}</span>
                  </td>
                  <td className="hide-sm nowrap">{listing.price > 0 ? formatPrice(listing) : "—"}</td>
                  <td>
                    <StatusBadge status={listing.status} />
                  </td>
                  <td className="hide-sm">{ownerName(listing.ownerId)}</td>
                  <td className="hide-sm nowrap">{ago(listing.updatedAt, now)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
