import { daysBetween } from "../model/metrics";

/** "hoje", "há 1 dia", "há 12 dias". */
export function ago(iso: string, now: Date): string {
  const days = daysBetween(iso, now);
  if (days === 0) return "hoje";
  return days === 1 ? "há 1 dia" : `há ${days} dias`;
}

/** Link to the editor. The id travels in the query string because the site is a static export. */
export function editorHref(listingId: number): string {
  return `/painel/imoveis/editar?id=${listingId}`;
}

/** Messages for the errors the store can return, phrased for the user. */
export const errorText = {
  not_found: "Imóvel não encontrado.",
  forbidden: "Você não tem permissão para isso.",
  invalid_transition: "Essa mudança de status não é possível agora.",
  closing_rule: "Imóveis à venda fecham como vendidos; imóveis para aluguel, como alugados.",
  comment_required: "Escreva um comentário.",
  no_changes: "Nada mudou.",
  invalid_owner: "Escolha um responsável da equipe de vendas.",
  owner_required: "Escolha o responsável pelo imóvel.",
  checklist_failed: "A lista de revisão ainda tem pendências.",
} as const;
