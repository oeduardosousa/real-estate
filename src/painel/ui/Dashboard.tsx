"use client";

import { useState } from "react";
import Link from "next/link";
import { averageDaysByStatus, countByStatus, listingsInScope } from "../model/metrics";
import { getPersona, roleLabels } from "../model/personas";
import { STATUSES, type PanelListing, type Persona } from "../model/types";
import { ago, editorHref } from "./format";
import { usePanelState, useSession } from "./hooks";
import { StatusBadge } from "./StatusBadge";

const scopeText = {
  diretoria: "Todos os imóveis da empresa.",
  corretor: "Os imóveis sob a sua responsabilidade.",
  backoffice: "Todos os imóveis, com foco no que falta completar.",
} as const;

const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

function ListingRow({ listing, now, showOwner }: { listing: PanelListing; now: Date; showOwner: boolean }) {
  const owner = getPersona(listing.ownerId);
  return (
    <li className="panel-row">
      <div>
        <p className="panel-row-title">
          <Link href={editorHref(listing.id)} className="panel-row-link">
            {listing.title}
          </Link>
        </p>
        <p className="panel-muted">
          {listing.neighborhood}
          {showOwner && owner ? ` · ${owner.name}` : ""} · {ago(listing.statusChangedAt, now)}
        </p>
        {listing.status === "Devolvido" && listing.returnComment && (
          <p className="panel-return">Comentário da Diretoria: {listing.returnComment}</p>
        )}
      </div>
      <StatusBadge status={listing.status} />
    </li>
  );
}

function Queue({
  title,
  empty,
  listings,
  now,
  showOwner,
}: {
  title: string;
  empty: string;
  listings: PanelListing[];
  now: Date;
  showOwner: boolean;
}) {
  return (
    <section className="panel-card" aria-labelledby="queue-title">
      <h2 id="queue-title" className="panel-card-title">
        {title}
      </h2>
      {listings.length === 0 ? (
        <p className="panel-muted">{empty}</p>
      ) : (
        <ul className="panel-rows">
          {listings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} now={now} showOwner={showOwner} />
          ))}
        </ul>
      )}
    </section>
  );
}

/** The queue that matters most for each role: reviews for Diretoria, own listings for Corretor, drafts for Back-office. */
function roleQueue(persona: Persona, all: PanelListing[], mine: PanelListing[], now: Date) {
  const oldestFirst = (a: PanelListing, b: PanelListing) => a.statusChangedAt.localeCompare(b.statusChangedAt);

  if (persona.role === "diretoria") {
    return (
      <Queue
        title="Aguardando revisão"
        empty="Nenhum imóvel aguardando revisão."
        listings={all.filter((l) => l.status === "Em revisão").sort(oldestFirst)}
        now={now}
        showOwner
      />
    );
  }
  if (persona.role === "corretor") {
    const order = (l: PanelListing) => (l.status === "Devolvido" ? 0 : 1);
    return (
      <Queue
        title="Meus imóveis"
        empty="Você ainda não tem imóveis."
        listings={[...mine].sort((a, b) => order(a) - order(b) || a.title.localeCompare(b.title, "pt-BR"))}
        now={now}
        showOwner={false}
      />
    );
  }
  return (
    <Queue
      title="Para completar"
      empty="Nenhum rascunho ou imóvel devolvido no momento."
      listings={all.filter((l) => l.status === "Rascunho" || l.status === "Devolvido").sort(oldestFirst)}
      now={now}
      showOwner
    />
  );
}

export function Dashboard() {
  const persona = useSession();
  const { listings, activity } = usePanelState();
  // Fixed at mount so the figures do not shift while the page is open.
  const [now] = useState(() => new Date());

  if (!persona) return null;

  const scoped = listingsInScope(persona, listings);
  const counts = countByStatus(scoped);
  const averages = averageDaysByStatus(scoped, activity, now);
  const firstName = persona.name.split(" ")[0];

  return (
    <div className="panel-dashboard">
      <header className="panel-heading">
        <p className="panel-eyebrow">{roleLabels[persona.role]}</p>
        <h1 className="panel-title">Olá, {firstName}</h1>
        <p className="panel-lead">{scopeText[persona.role]}</p>
      </header>

      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="visually-hidden">
          Imóveis por status
        </h2>
        <ul className="panel-stats">
          {STATUSES.map((status) => (
            <li key={status} className="panel-stat">
              <span className="panel-stat-value">{counts[status]}</span>
              <StatusBadge status={status} />
            </li>
          ))}
        </ul>
      </section>

      <div className="panel-columns">
        {roleQueue(persona, listings, scoped, now)}

        <section className="panel-card" aria-labelledby="time-title">
          <h2 id="time-title" className="panel-card-title">
            Tempo médio em cada status
          </h2>
          <table className="panel-table">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col" className="num-col">
                  Média
                </th>
              </tr>
            </thead>
            <tbody>
              {STATUSES.map((status) => {
                const average = averages[status];
                return (
                  <tr key={status}>
                    <th scope="row">{status}</th>
                    <td className="num-col">
                      {average === null ? "–" : `${decimal.format(average)} ${average >= 1.05 || average < 0.95 ? "dias" : "dia"}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
