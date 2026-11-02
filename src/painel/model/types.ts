import type { Listing } from "@/data";

export const ROLES = ["diretoria", "corretor", "backoffice"] as const;
export type Role = (typeof ROLES)[number];

/** Workflow states, named as in PAINEL.md. */
export const STATUSES = [
  "Rascunho",
  "Em revisão",
  "Devolvido",
  "Publicado",
  "Reservado",
  "Retirado",
  "Vendido",
  "Alugado",
] as const;
export type Status = (typeof STATUSES)[number];

/** Terminal states: the listing is closed and can no longer change. */
export const TERMINAL_STATUSES: readonly Status[] = ["Vendido", "Alugado"];

/** Actions that move a listing along the status machine. */
export type TransitionAction =
  | "send_to_review"
  | "approve"
  | "return"
  | "publish"
  | "unpublish"
  | "reserve"
  | "close"
  | "reopen";

/** Every action the permission matrix in PAINEL.md talks about. */
export type Action =
  | TransitionAction
  | "view"
  | "create"
  | "edit"
  | "photos"
  | "reassign"
  | "view_team"
  | "manage_team";

/** A demo team member. `id` matches a `TeamMember` id for the five public members. */
export interface Persona {
  id: string;
  name: string;
  role: Role;
  /** PT-BR job title shown in the panel. */
  title: string;
}

/** Who is performing an action. A persona satisfies this. */
export type Actor = Pick<Persona, "id" | "role">;

export interface PhotoMeta {
  /** Key of the blob in IndexedDB. */
  id: string;
  /** Required by the review checklist. */
  alt: string;
  width: number;
  height: number;
  /** Compressed size in bytes. */
  bytes: number;
}

export type ListingOrigin = "seed" | "panel";

/** A public `Listing` plus the back-office fields. Extends it, so the public site is unaffected. */
export type PanelListing = Listing & {
  status: Status;
  /** Id of the persona that owns the listing. Mirrors `agent` on the public side. */
  ownerId: string;
  photos: PhotoMeta[];
  coverPhotoId: string | null;
  /** Diretoria's comment from the last return; cleared on the next send to review. */
  returnComment: string | null;
  origin: ListingOrigin;
  createdAt: string;
  updatedAt: string;
  statusChangedAt: string;
};

/** The slice of a listing the permission functions need. */
export type ListingAccess = Pick<PanelListing, "status" | "ownerId" | "purpose">;

interface ActivityBase {
  id: string;
  listingId: number;
  actorId: string;
  /** ISO timestamp. */
  at: string;
}

export type ActivityEntry =
  | (ActivityBase & { kind: "create" })
  | (ActivityBase & { kind: "edit"; fields: string[] })
  | (ActivityBase & { kind: "transition"; from: Status; to: Status; comment?: string })
  | (ActivityBase & { kind: "reassign"; fromOwnerId: string; toOwnerId: string });

/** Fields an edit may change. Slug and the public `agent` are controlled elsewhere. */
export type EditableFields = Partial<Omit<Listing, "id" | "slug" | "agent">> &
  Partial<Pick<PanelListing, "photos" | "coverPhotoId">>;
