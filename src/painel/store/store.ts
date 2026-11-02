import { z } from "zod";
import { buildSeed, type PanelState } from "../model/seed";
import type { Actor, EditableFields, PanelListing, Status } from "../model/types";
import {
  applyCreate,
  applyEdit,
  applyReassign,
  applyTransition,
  type Change,
  type Clock,
  type CreateInput,
  type Result,
} from "../model/workflow";
import { clearPhotos, deletePhoto } from "./photos";
import { isStorageDegraded, readJSON, removeItem, writeJSON } from "./storage";

export const STORAGE_KEY = "curral-painel:v1";

/** Light shape check on read. A bad or outdated payload falls back to the seed. */
const envelope = z.object({
  version: z.literal(1),
  listings: z.array(
    z.looseObject({
      id: z.number(),
      slug: z.string(),
      status: z.string(),
      ownerId: z.string(),
      photos: z.array(z.looseObject({ id: z.string() })),
    }),
  ),
  activity: z.array(z.looseObject({ id: z.string(), listingId: z.number(), kind: z.string() })),
});

function parseState(value: unknown): PanelState | null {
  const parsed = envelope.safeParse(value);
  return parsed.success ? (parsed.data as unknown as PanelState) : null;
}

/** Seed shown during SSR and hydration. Built once; storage is never read on the server. */
const serverState: PanelState = buildSeed();

let state: PanelState | null = null;
const listeners = new Set<() => void>();

function loadClientState(): PanelState {
  if (!state) {
    state = readJSON(STORAGE_KEY, parseState) ?? buildSeed();
  }
  return state;
}

function commit(next: PanelState): void {
  state = next;
  writeJSON(STORAGE_KEY, { version: 1, ...next });
  listeners.forEach((listener) => listener());
}

/** For `useSyncExternalStore`. On the server it returns the seed without touching storage. */
export function getSnapshot(): PanelState {
  return typeof window === "undefined" ? serverState : loadClientState();
}

export function getServerSnapshot(): PanelState {
  return serverState;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** False when data could not be written to localStorage and will vanish on reload. */
export function isPersistent(): boolean {
  return !isStorageDegraded();
}

function makeClock(): Clock {
  let counter = 0;
  return {
    now: new Date().toISOString(),
    newId: () =>
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${(counter++).toString(36)}`,
  };
}

function findListing(id: number): PanelListing | undefined {
  return getSnapshot().listings.find((listing) => listing.id === id);
}

/** Replaces one listing and appends its log entries, then persists. */
function save(change: Change): PanelListing {
  const current = loadClientState();
  const exists = current.listings.some((listing) => listing.id === change.listing.id);
  commit({
    listings: exists
      ? current.listings.map((l) => (l.id === change.listing.id ? change.listing : l))
      : [...current.listings, change.listing],
    activity: [...current.activity, ...change.entries],
  });
  return change.listing;
}

function run(id: number, step: (listing: PanelListing, clock: Clock) => Result<Change>): Result<PanelListing> {
  if (typeof window === "undefined") return { ok: false, error: "forbidden" };
  const listing = findListing(id);
  if (!listing) return { ok: false, error: "not_found" };
  const result = step(listing, makeClock());
  return result.ok ? { ok: true, value: save(result.value) } : result;
}

export function createListing(actor: Actor, input: CreateInput): Result<PanelListing> {
  if (typeof window === "undefined") return { ok: false, error: "forbidden" };
  const result = applyCreate(loadClientState().listings, actor, input, makeClock());
  return result.ok ? { ok: true, value: save(result.value) } : result;
}

export function updateListing(actor: Actor, id: number, patch: EditableFields): Result<PanelListing> {
  return run(id, (listing, clock) => applyEdit(listing, actor, patch, clock));
}

export function transitionListing(
  actor: Actor,
  id: number,
  to: Status,
  comment?: string,
): Result<PanelListing> {
  return run(id, (listing, clock) => applyTransition(listing, actor, to, comment, clock));
}

export function reassignListing(actor: Actor, id: number, newOwnerId: string): Result<PanelListing> {
  return run(id, (listing, clock) => applyReassign(listing, actor, newOwnerId, clock));
}

/** Drops photo blobs a listing no longer references. Call after a photo edit succeeds. */
export async function pruneRemovedPhotos(before: PanelListing, after: PanelListing): Promise<void> {
  const kept = new Set(after.photos.map((photo) => photo.id));
  await Promise.all(before.photos.filter((p) => !kept.has(p.id)).map((p) => deletePhoto(p.id)));
}

/** "Restaurar dados de demonstração": back to the 12 seed listings, no photos, empty extra history. */
export async function resetDemo(): Promise<void> {
  removeItem(STORAGE_KEY);
  await clearPhotos();
  state = buildSeed();
  listeners.forEach((listener) => listener());
}
