import type { CSSProperties } from "react";
import type { Status } from "../model/types";

/** Tone per status. The label always carries the meaning, the colour is a second cue. */
const TONES: Record<Status, string> = {
  Rascunho: "var(--sand-2)",
  "Em revisão": "var(--butter)",
  Devolvido: "var(--rose)",
  Publicado: "var(--sage)",
  Reservado: "var(--sky)",
  Retirado: "var(--lilac)",
  Vendido: "var(--peach)",
  Alugado: "var(--peach)",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="status-badge" style={{ "--tone": TONES[status] } as CSSProperties}>
      {status}
    </span>
  );
}
