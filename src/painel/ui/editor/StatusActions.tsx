"use client";

import { useState } from "react";
import { reviewChecklist } from "../../model/checklist";
import { availableTransitions, findEdge } from "../../model/permissions";
import type { PanelListing, Persona, Status } from "../../model/types";
import { transitionListing } from "../../store/store";
import { errorText } from "../format";

function actionLabel(from: Status, to: Status): string {
  if (to === "Em revisão") return "Enviar para revisão";
  if (to === "Reservado") return "Marcar como reservado";
  if (from === "Reservado" && to === "Publicado") return "Cancelar reserva";
  if (to === "Vendido") return "Fechar como vendido";
  if (to === "Alugado") return "Fechar como alugado";
  if (to === "Retirado") return "Retirar do site";
  if (to === "Publicado") return "Publicar novamente";
  return "Reabrir como rascunho";
}

/** Moves that cannot be taken back lightly get a second click. */
const NEEDS_CONFIRMATION: readonly Status[] = ["Retirado", "Vendido", "Alugado"];

/**
 * The status moves the persona can make on this listing. Approving and returning a review have
 * their own screen, so they are left out here.
 */
export function StatusActions({
  listing,
  persona,
  beforeAction,
}: {
  listing: PanelListing;
  persona: Persona;
  /** Runs first, to save pending edits. */
  beforeAction: () => void;
}) {
  const [confirming, setConfirming] = useState<Status | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const moves = availableTransitions(persona, listing).filter((to) => {
    const action = findEdge(listing.status, to)?.action;
    return action !== "approve" && action !== "return";
  });
  const ready = reviewChecklist(listing).ready;

  const run = (to: Status) => {
    beforeAction();
    const result = transitionListing(persona, listing.id, to);
    setConfirming(null);
    setMessage(result.ok ? `Status alterado para ${to}.` : errorText[result.error]);
  };

  if (moves.length === 0 && !message) return null;

  return (
    <div className="panel-status-actions">
      <div className="panel-actions">
        {moves.map((to) => {
          const label = actionLabel(listing.status, to);
          const blocked = to === "Em revisão" && !ready;

          if (confirming === to) {
            return (
              <span key={to} role="group" aria-label={`Confirmar: ${label}`} className="panel-reset-confirm">
                <button type="button" className="panel-button panel-button-danger" onClick={() => run(to)}>
                  Confirmar: {label.toLowerCase()}
                </button>
                <button type="button" className="panel-link" onClick={() => setConfirming(null)}>
                  Cancelar
                </button>
              </span>
            );
          }
          return (
            <button
              key={to}
              type="button"
              className={`panel-button${to === "Em revisão" ? " panel-button-primary" : ""}`}
              disabled={blocked}
              aria-describedby={blocked ? "review-blocked" : undefined}
              onClick={() => (NEEDS_CONFIRMATION.includes(to) ? setConfirming(to) : run(to))}
            >
              {label}
            </button>
          );
        })}
      </div>
      {moves.includes("Em revisão") && !ready && (
        <p id="review-blocked" className="panel-muted">
          A lista de revisão tem pendências. Veja a etapa Pré-visualização.
        </p>
      )}
      <p role="status" className="panel-muted">
        {message}
      </p>
    </div>
  );
}
