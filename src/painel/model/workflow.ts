import {
  can,
  canTransitionListing,
  closingRuleAllows,
  findEdge,
  transitionRequiresComment,
} from "./permissions";
import { getOwnerCandidates } from "./personas";
import type {
  ActivityEntry,
  Actor,
  EditableFields,
  PanelListing,
  Status,
} from "./types";

export type WorkflowError =
  | "not_found"
  | "forbidden"
  | "invalid_transition"
  | "closing_rule"
  | "comment_required"
  | "no_changes"
  | "invalid_owner"
  | "owner_required"
  | "checklist_failed";

export type Result<T> = { ok: true; value: T } | { ok: false; error: WorkflowError };

/** What a pure workflow step produces: the new listing and the log entries to append. */
export interface Change {
  listing: PanelListing;
  entries: ActivityEntry[];
}

/** Injected so the functions stay pure and tests are deterministic. */
export interface Clock {
  now: string;
  newId: () => string;
}

const fail = (error: WorkflowError): Result<never> => ({ ok: false, error });

export function applyTransition(
  listing: PanelListing,
  actor: Actor,
  to: Status,
  comment: string | undefined,
  clock: Clock,
): Result<Change> {
  const edge = findEdge(listing.status, to);
  if (!edge) return fail("invalid_transition");
  // Check the closing rule before permissions so the caller learns why a close was refused.
  if (!closingRuleAllows(to, listing.purpose)) return fail("closing_rule");
  if (!canTransitionListing(actor, listing, to)) return fail("forbidden");

  const trimmed = comment?.trim() || undefined;
  if (transitionRequiresComment(to) && !trimmed) return fail("comment_required");

  const next: PanelListing = {
    ...listing,
    status: to,
    statusChangedAt: clock.now,
    updatedAt: clock.now,
    returnComment:
      to === "Devolvido" ? (trimmed ?? null) : to === "Em revisão" ? null : listing.returnComment,
  };
  const entry: ActivityEntry = {
    id: clock.newId(),
    listingId: listing.id,
    actorId: actor.id,
    at: clock.now,
    kind: "transition",
    from: listing.status,
    to,
    ...(trimmed ? { comment: trimmed } : {}),
  };
  return { ok: true, value: { listing: next, entries: [entry] } };
}

/**
 * Applies an edit. Fields whose value did not change are ignored. Editing a Devolvido listing
 * moves it back to Rascunho and logs that transition too.
 */
export function applyEdit(
  listing: PanelListing,
  actor: Actor,
  patch: EditableFields,
  clock: Clock,
): Result<Change> {
  const changed = (Object.keys(patch) as (keyof EditableFields)[]).filter(
    (key) => JSON.stringify(patch[key]) !== JSON.stringify(listing[key]),
  );
  if (changed.length === 0) return fail("no_changes");

  const touchesPhotos = changed.some((key) => key === "photos" || key === "coverPhotoId");
  const touchesData = changed.some((key) => key !== "photos" && key !== "coverPhotoId");
  if (touchesPhotos && !can(actor, "photos", listing)) return fail("forbidden");
  if (touchesData && !can(actor, "edit", listing)) return fail("forbidden");

  const entries: ActivityEntry[] = [
    {
      id: clock.newId(),
      listingId: listing.id,
      actorId: actor.id,
      at: clock.now,
      kind: "edit",
      fields: changed.map(String),
    },
  ];

  let next: PanelListing = { ...listing, updatedAt: clock.now };
  for (const key of changed) {
    next = { ...next, [key]: patch[key] };
  }

  if (listing.status === "Devolvido") {
    next = { ...next, status: "Rascunho", statusChangedAt: clock.now };
    entries.push({
      id: clock.newId(),
      listingId: listing.id,
      actorId: actor.id,
      at: clock.now,
      kind: "transition",
      from: "Devolvido",
      to: "Rascunho",
    });
  }
  return { ok: true, value: { listing: next, entries } };
}

export function applyReassign(
  listing: PanelListing,
  actor: Actor,
  newOwnerId: string,
  clock: Clock,
): Result<Change> {
  if (!can(actor, "reassign", listing)) return fail("forbidden");
  if (!getOwnerCandidates().some((persona) => persona.id === newOwnerId)) return fail("invalid_owner");
  if (newOwnerId === listing.ownerId) return fail("no_changes");

  return {
    ok: true,
    value: {
      listing: { ...listing, ownerId: newOwnerId, agent: newOwnerId, updatedAt: clock.now },
      entries: [
        {
          id: clock.newId(),
          listingId: listing.id,
          actorId: actor.id,
          at: clock.now,
          kind: "reassign",
          fromOwnerId: listing.ownerId,
          toOwnerId: newOwnerId,
        },
      ],
    },
  };
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CreateInput extends EditableFields {
  title: string;
  /** Required when a back-office user creates the listing; otherwise defaults to the creator. */
  ownerId?: string;
}

/** A blank draft. Required-field validation happens in the editor and the review checklist. */
export function applyCreate(
  existing: readonly PanelListing[],
  actor: Actor,
  input: CreateInput,
  clock: Clock,
): Result<Change> {
  if (!can(actor, "create")) return fail("forbidden");

  const { ownerId: requestedOwner, ...fields } = input;
  let ownerId: string;
  if (actor.role === "corretor") ownerId = actor.id;
  else if (requestedOwner) ownerId = requestedOwner;
  else if (actor.role === "backoffice") return fail("owner_required");
  else ownerId = actor.id;
  if (!getOwnerCandidates().some((persona) => persona.id === ownerId)) return fail("invalid_owner");

  const base = slugify(input.title) || "imovel";
  const taken = new Set(existing.map((item) => item.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;
  const id = existing.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  const listing: PanelListing = {
    id,
    slug,
    type: "Apartamento",
    purpose: "venda",
    price: 0,
    area: 0,
    bedrooms: 0,
    neighborhood: "",
    city: "Belo Horizonte",
    featured: false,
    suites: 0,
    bathrooms: 0,
    parking: 0,
    condominio: 0,
    iptu: 0,
    coordinates: { lat: -19.9167, lng: -43.9345 },
    features: [],
    description: [],
    summary: "",
    views: [],
    photos: [],
    coverPhotoId: null,
    ...fields,
    agent: ownerId,
    ownerId,
    status: "Rascunho",
    returnComment: null,
    origin: "panel",
    createdAt: clock.now,
    updatedAt: clock.now,
    statusChangedAt: clock.now,
  };
  return {
    ok: true,
    value: {
      listing,
      entries: [
        { id: clock.newId(), listingId: id, actorId: actor.id, at: clock.now, kind: "create" },
      ],
    },
  };
}
