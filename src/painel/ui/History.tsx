"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { describeHistory } from "../model/history";
import { can } from "../model/permissions";
import { getPersona } from "../model/personas";
import { editorHref } from "./format";
import { usePanelState, useSession, useTeam } from "./hooks";
import { Notice } from "./Notice";
import { StatusBadge } from "./StatusBadge";

const when = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const firstName = (id: string) => getPersona(id)?.name.split(" ")[0] ?? "Alguém da equipe";

/** Histórico: everything that happened to one listing, newest first. */
export function History() {
  const persona = useSession();
  const { listings, activity } = usePanelState();
  useTeam();
  const idParam = useSearchParams().get("id");

  if (!persona) return null;
  const listing = idParam ? listings.find((item) => String(item.id) === idParam) : undefined;
  if (!listing) return <Notice title="Imóvel não encontrado">Esse endereço não corresponde a nenhum imóvel.</Notice>;
  if (!can(persona, "view", listing)) {
    return <Notice title="Sem acesso">Você só vê os seus imóveis e os que já estão publicados.</Notice>;
  }

  const lines = describeHistory(activity, listing.id, firstName);

  return (
    <div className="panel-narrow">
      <p className="panel-muted">
        <Link href={editorHref(listing.id)} className="panel-row-link">
          ← {listing.title}
        </Link>
      </p>
      <header className="panel-heading">
        <h1 className="panel-title">Histórico</h1>
        <p className="panel-meta">
          <span className="panel-muted">{listing.title}</span>
          <StatusBadge status={listing.status} />
        </p>
      </header>

      {lines.length === 0 ? (
        <p className="panel-muted">Ainda não há registros para este imóvel.</p>
      ) : (
        <ol className="panel-timeline">
          {lines.map((line) => (
            <li key={line.id}>
              <p>{line.text}</p>
              {line.comment && <p className="panel-return">“{line.comment}”</p>}
              <time dateTime={line.at} className="panel-muted">
                {when.format(new Date(line.at))}
              </time>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
