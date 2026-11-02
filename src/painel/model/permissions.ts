import type { ListingPurpose } from "@/data";
import {
  TERMINAL_STATUSES,
  type Action,
  type Actor,
  type ListingAccess,
  type Role,
  type Status,
  type TransitionAction,
} from "./types";

const ALL_ROLES: readonly Role[] = ["diretoria", "corretor", "backoffice"];
const DIRETORIA: readonly Role[] = ["diretoria"];
const SALES: readonly Role[] = ["diretoria", "corretor"];

interface Edge {
  from: Status;
  to: Status;
  action: TransitionAction;
  /** Roles allowed to take this edge. Corretor additionally has to own the listing. */
  roles: readonly Role[];
}

/** The status machine from PAINEL.md. Anything not listed here is illegal. */
export const TRANSITIONS: readonly Edge[] = [
  { from: "Rascunho", to: "Em revisão", action: "send_to_review", roles: ALL_ROLES },
  { from: "Em revisão", to: "Publicado", action: "approve", roles: DIRETORIA },
  { from: "Em revisão", to: "Devolvido", action: "return", roles: DIRETORIA },
  { from: "Devolvido", to: "Rascunho", action: "reopen", roles: ALL_ROLES },
  { from: "Publicado", to: "Retirado", action: "unpublish", roles: DIRETORIA },
  { from: "Publicado", to: "Reservado", action: "reserve", roles: SALES },
  { from: "Reservado", to: "Publicado", action: "reserve", roles: SALES },
  { from: "Reservado", to: "Vendido", action: "close", roles: SALES },
  { from: "Reservado", to: "Alugado", action: "close", roles: SALES },
  { from: "Retirado", to: "Rascunho", action: "reopen", roles: ALL_ROLES },
  { from: "Retirado", to: "Publicado", action: "publish", roles: DIRETORIA },
];

const TRANSITION_ACTIONS: ReadonlySet<Action> = new Set(TRANSITIONS.map((edge) => edge.action));

/** Purpose rule: venda closes as Vendido, aluguel as Alugado. */
export function closingStatus(purpose: ListingPurpose): Status {
  return purpose === "venda" ? "Vendido" : "Alugado";
}

/** False when `to` is a closing status that does not match the listing's purpose. */
export function closingRuleAllows(to: Status, purpose: ListingPurpose): boolean {
  return !TERMINAL_STATUSES.includes(to) || to === closingStatus(purpose);
}

/** Whether `to` needs a comment from the person making the transition. */
export function transitionRequiresComment(to: Status): boolean {
  return to === "Devolvido";
}

export function findEdge(from: Status, to: Status): Edge | undefined {
  return TRANSITIONS.find((edge) => edge.from === from && edge.to === to);
}

/**
 * Role-level check of the status machine: is this edge legal for the role at all?
 * Ownership and the venda/aluguel closing rule need the listing, see {@link canTransitionListing}.
 */
export function canTransition(role: Role, from: Status, to: Status): boolean {
  const edge = findEdge(from, to);
  return edge !== undefined && edge.roles.includes(role);
}

/** Corretor acts only on their own listings; the other roles are not tied to an owner. */
function ownsIfCorretor(actor: Actor, listing: ListingAccess): boolean {
  return actor.role !== "corretor" || listing.ownerId === actor.id;
}

/** Statuses in which `role` may change a listing's data or photos. */
function editableIn(role: Role, status: Status): boolean {
  if (role === "diretoria") return !TERMINAL_STATUSES.includes(status);
  return status === "Rascunho" || status === "Devolvido";
}

/** The permission matrix from PAINEL.md. Actions on a listing return false without one. */
export function can(actor: Actor, action: Action, listing?: ListingAccess): boolean {
  switch (action) {
    case "create":
    case "view_team":
      return true;
    case "manage_team":
      return actor.role === "diretoria";
  }
  if (!listing) return false;

  switch (action) {
    case "view":
      return (
        actor.role !== "corretor" ||
        listing.ownerId === actor.id ||
        listing.status === "Publicado" ||
        listing.status === "Reservado"
      );
    case "edit":
    case "photos":
      return editableIn(actor.role, listing.status) && ownsIfCorretor(actor, listing);
    case "reassign":
      return actor.role === "diretoria";
    default:
      if (!TRANSITION_ACTIONS.has(action)) return false;
      return (
        ownsIfCorretor(actor, listing) &&
        TRANSITIONS.some(
          (edge) =>
            edge.action === action &&
            edge.from === listing.status &&
            edge.roles.includes(actor.role) &&
            closingRuleAllows(edge.to, listing.purpose),
        )
      );
  }
}

/** The full check for moving one listing to `to`: machine, role, ownership and closing rule. */
export function canTransitionListing(actor: Actor, listing: ListingAccess, to: Status): boolean {
  const edge = findEdge(listing.status, to);
  return (
    edge !== undefined &&
    closingRuleAllows(to, listing.purpose) &&
    can(actor, edge.action, listing)
  );
}

/** Statuses the actor can move this listing to right now. Handy for building action menus. */
export function availableTransitions(actor: Actor, listing: ListingAccess): Status[] {
  return TRANSITIONS.filter((edge) => edge.from === listing.status)
    .map((edge) => edge.to)
    .filter((to) => canTransitionListing(actor, listing, to));
}
