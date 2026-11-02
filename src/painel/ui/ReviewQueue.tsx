"use client";

import { useState } from "react";
import Link from "next/link";
import { getPersona } from "../model/personas";
import { ago } from "./format";
import { usePanelState, useSession, useTeam } from "./hooks";
import { Notice } from "./Notice";

export const reviewHref = (listingId: number) => `/painel/revisao/ver?id=${listingId}`;

/** Revisão: the listings waiting for the Diretoria, oldest first. */
export function ReviewQueue() {
  const persona = useSession();
  const { listings } = usePanelState();
  useTeam();
  const [now] = useState(() => new Date());

  if (!persona) return null;
  if (persona.role !== "diretoria") {
    return (
      <Notice title="Só a Diretoria revisa" backHref="/painel" backLabel="Voltar para a visão geral">
        A fila de revisão é da Diretoria. Você acompanha o andamento dos seus imóveis em Imóveis.
      </Notice>
    );
  }

  const waiting = listings
    .filter((listing) => listing.status === "Em revisão")
    .sort((a, b) => a.statusChangedAt.localeCompare(b.statusChangedAt));

  return (
    <div>
      <header className="panel-heading">
        <h1 className="panel-title">Revisão</h1>
        <p className="panel-lead">
          Imóveis enviados para revisão, do mais antigo para o mais recente. Abra um para conferir a lista de
          revisão e aprovar ou devolver.
        </p>
      </header>

      {waiting.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Nenhum imóvel aguardando revisão.</p>
          <Link href="/painel/imoveis" className="panel-button">
            Ver todos os imóveis
          </Link>
        </div>
      ) : (
        <ul className="panel-card panel-rows">
          {waiting.map((listing) => (
            <li key={listing.id} className="panel-row">
              <div>
                <p className="panel-row-title">
                  <Link href={reviewHref(listing.id)} className="panel-row-link">
                    {listing.title}
                  </Link>
                </p>
                <p className="panel-muted">
                  {listing.neighborhood || "Bairro não definido"} · {getPersona(listing.ownerId)?.name ?? "—"} · enviado{" "}
                  {ago(listing.statusChangedAt, now)}
                </p>
              </div>
              <Link href={reviewHref(listing.id)} className="panel-button panel-button-primary">
                Revisar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
