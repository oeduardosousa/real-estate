import type { ActivityEntry, Status } from "./types";

export interface HistoryLine {
  /** Id of the first entry the line stands for. */
  id: string;
  /** ISO timestamp of the latest entry the line stands for. */
  at: string;
  actorId: string;
  text: string;
  /** The Diretoria's comment on a return. */
  comment?: string;
}

/** Edits by the same person this close together read as one edit (autosave writes many). */
export const EDIT_MERGE_MINUTES = 10;

const fieldLabels: Record<string, string> = {
  title: "título",
  type: "tipo",
  purpose: "finalidade",
  price: "preço",
  area: "área",
  bedrooms: "quartos",
  suites: "suítes",
  bathrooms: "banheiros",
  parking: "vagas",
  neighborhood: "bairro",
  city: "cidade",
  featured: "destaque",
  condominio: "condomínio",
  iptu: "IPTU",
  features: "características",
  description: "descrição",
  summary: "resumo",
  views: "ambientes",
  coordinates: "localização",
  photos: "fotos",
  coverPhotoId: "foto de capa",
};

function fieldList(fields: readonly string[]): string {
  const labels = [...new Set(fields.map((field) => fieldLabels[field] ?? field))];
  if (labels.length <= 1) return labels[0] ?? "dados";
  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
}

/** What the person did, without their name: "enviou para revisão". */
export function transitionVerb(from: Status, to: Status): string {
  switch (to) {
    case "Em revisão":
      return "enviou para revisão";
    case "Devolvido":
      return "devolveu para ajustes";
    case "Publicado":
      if (from === "Em revisão") return "aprovou e publicou";
      if (from === "Reservado") return "cancelou a reserva";
      return "publicou novamente";
    case "Reservado":
      return "marcou como reservado";
    case "Retirado":
      return "retirou do site";
    case "Vendido":
      return "fechou como vendido";
    case "Alugado":
      return "fechou como alugado";
    case "Rascunho":
      return "reabriu como rascunho";
  }
}

/**
 * The activity log of one listing as readable lines, newest first. Consecutive edits by the same person
 * within {@link EDIT_MERGE_MINUTES} become one line. `nameOf` gives the first name for a person id.
 */
export function describeHistory(
  entries: readonly ActivityEntry[],
  listingId: number,
  nameOf: (personId: string) => string,
): HistoryLine[] {
  const own = entries.filter((entry) => entry.listingId === listingId).sort((a, b) => a.at.localeCompare(b.at));
  const lines: (HistoryLine & { fields?: string[] })[] = [];

  for (const entry of own) {
    const name = nameOf(entry.actorId);
    const previous = lines[lines.length - 1];

    if (entry.kind === "edit") {
      const gap = previous ? (Date.parse(entry.at) - Date.parse(previous.at)) / 60_000 : Infinity;
      if (previous?.fields && previous.actorId === entry.actorId && gap <= EDIT_MERGE_MINUTES) {
        previous.fields = [...previous.fields, ...entry.fields];
        previous.at = entry.at;
        previous.text = `${name} editou ${fieldList(previous.fields)}`;
        continue;
      }
      lines.push({ id: entry.id, at: entry.at, actorId: entry.actorId, fields: [...entry.fields], text: `${name} editou ${fieldList(entry.fields)}` });
    } else if (entry.kind === "create") {
      lines.push({ id: entry.id, at: entry.at, actorId: entry.actorId, text: `${name} criou o imóvel` });
    } else if (entry.kind === "reassign") {
      lines.push({
        id: entry.id,
        at: entry.at,
        actorId: entry.actorId,
        text: `${name} passou o imóvel de ${nameOf(entry.fromOwnerId)} para ${nameOf(entry.toOwnerId)}`,
      });
    } else {
      lines.push({
        id: entry.id,
        at: entry.at,
        actorId: entry.actorId,
        text: `${name} ${transitionVerb(entry.from, entry.to)}`,
        ...(entry.comment ? { comment: entry.comment } : {}),
      });
    }
  }

  return lines.map(({ id, at, actorId, text, comment }) => ({ id, at, actorId, text, ...(comment ? { comment } : {}) })).reverse();
}
