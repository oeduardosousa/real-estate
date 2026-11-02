"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { reviewChecklist } from "../model/checklist";
import { getPersona } from "../model/personas";
import { transitionListing } from "../store/store";
import { editorHref, errorText } from "./format";
import { usePanelState, useSession, useTeam } from "./hooks";
import { Notice } from "./Notice";
import { PreviewStep } from "./editor/PreviewStep";
import { StatusBadge } from "./StatusBadge";

/** Shortest return comment that still tells the owner what to fix. */
export const MIN_RETURN_COMMENT = 10;

type Mode = "idle" | "approving" | "returning";

/** One listing under review: the preview and checklist, then approve or return with a comment. */
export function ReviewDetail() {
  const persona = useSession();
  const { listings } = usePanelState();
  useTeam();
  const idParam = useSearchParams().get("id");
  const [mode, setMode] = useState<Mode>("idle");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const commentId = useId();

  if (!persona) return null;
  if (persona.role !== "diretoria") {
    return (
      <Notice title="Só a Diretoria revisa" backHref="/painel" backLabel="Voltar para a visão geral">
        A revisão de imóveis é da Diretoria.
      </Notice>
    );
  }
  const listing = idParam ? listings.find((item) => String(item.id) === idParam) : undefined;
  if (!listing) {
    return (
      <Notice title="Imóvel não encontrado" backHref="/painel/revisao" backLabel="Voltar para a Revisão">
        Esse endereço não corresponde a nenhum imóvel.
      </Notice>
    );
  }

  const owner = getPersona(listing.ownerId);
  const inReview = listing.status === "Em revisão";
  const checklist = reviewChecklist(listing);

  const approve = () => {
    const result = transitionListing(persona, listing.id, "Publicado");
    if (result.ok) {
      setDone(`${listing.title} foi aprovado e publicado.`);
      setMode("idle");
    } else setError(errorText[result.error]);
  };

  const sendBack = (event: FormEvent) => {
    event.preventDefault();
    if (comment.trim().length < MIN_RETURN_COMMENT) {
      setError(`Explique o que precisa mudar, com pelo menos ${MIN_RETURN_COMMENT} caracteres.`);
      return;
    }
    const result = transitionListing(persona, listing.id, "Devolvido", comment.trim());
    if (result.ok) {
      setDone(`${listing.title} voltou para ${owner?.name ?? "o responsável"} com o seu comentário.`);
      setMode("idle");
      setComment("");
    } else setError(errorText[result.error]);
  };

  return (
    <div>
      <p className="panel-muted">
        <Link href="/painel/revisao" className="panel-row-link">
          ← Revisão
        </Link>
      </p>

      <header className="panel-heading panel-heading-row">
        <div>
          <h1 className="panel-title">{listing.title || "Sem título"}</h1>
          <p className="panel-meta">
            <StatusBadge status={listing.status} />
            <span className="panel-muted">Responsável: {owner?.name ?? "—"}</span>
            <Link href={`/painel/imoveis/historico?id=${listing.id}`} className="panel-row-link">
              Histórico
            </Link>
            <Link href={editorHref(listing.id)} className="panel-row-link">
              Abrir no editor
            </Link>
          </p>
        </div>
      </header>

      {done && (
        <p role="status" className="panel-done">
          {done}{" "}
          <Link href="/painel/revisao" className="panel-row-link">
            Voltar para a fila
          </Link>
        </p>
      )}

      {!inReview && !done && (
        <p role="status" className="panel-muted">
          Este imóvel não está em revisão agora (status: {listing.status}).
        </p>
      )}

      {inReview && (
        <section className="panel-card panel-review-actions" aria-labelledby="decision-title">
          <h2 id="decision-title" className="panel-card-title">
            Decisão
          </h2>
          {!checklist.ready && (
            <p className="panel-muted">A lista de revisão tem pendências. Confira abaixo antes de aprovar.</p>
          )}

          {mode === "idle" && (
            <div className="panel-actions">
              <button
                type="button"
                className="panel-button panel-button-primary"
                onClick={() => {
                  setMode("approving");
                  setError(null);
                }}
              >
                Aprovar e publicar
              </button>
              <button
                type="button"
                className="panel-button"
                onClick={() => {
                  setMode("returning");
                  setError(null);
                }}
              >
                Devolver com comentário
              </button>
            </div>
          )}

          {mode === "approving" && (
            <div role="group" aria-label="Confirmar aprovação" className="panel-actions">
              <button type="button" className="panel-button panel-button-danger" onClick={approve}>
                Confirmar: aprovar e publicar
              </button>
              <button type="button" className="panel-link" onClick={() => setMode("idle")}>
                Cancelar
              </button>
            </div>
          )}

          {mode === "returning" && (
            <form onSubmit={sendBack} noValidate className="panel-form">
              <div className="panel-field">
                <label htmlFor={commentId}>O que precisa mudar</label>
                <textarea
                  id={commentId}
                  rows={4}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${commentId}-error` : undefined}
                  autoFocus
                />
                <span className="panel-muted">
                  {owner?.name.split(" ")[0] ?? "O responsável"} verá este comentário no imóvel devolvido.
                </span>
              </div>
              <div className="panel-actions">
                <button type="submit" className="panel-button panel-button-primary">
                  Devolver para ajustes
                </button>
                <button type="button" className="panel-link" onClick={() => setMode("idle")}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {error && (
            <p id={`${commentId}-error`} role="alert" className="panel-error">
              {error}
            </p>
          )}
        </section>
      )}

      <PreviewStep listing={listing} />
    </div>
  );
}
