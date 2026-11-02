import { z } from "zod";
import { allPersonas, isSeedPersona, personas, setExtraPersonas } from "../model/personas";
import { can } from "../model/permissions";
import { ROLES, type Actor, type Persona, type Role } from "../model/types";
import { slugify } from "../model/workflow";
import { readJSON, removeItem, writeJSON } from "./storage";

export const TEAM_KEY = "curral-painel:team";

export type TeamError =
  | "forbidden"
  | "name_invalid"
  | "title_invalid"
  | "name_taken"
  | "not_found"
  | "self"
  | "last_director"
  | "has_listings";
export type TeamResult<T> = { ok: true; value: T } | { ok: false; error: TeamError };

export const NAME_MIN = 3;
export const NAME_MAX = 60;
export const TITLE_MAX = 60;

const stored = z.object({
  version: z.literal(1),
  members: z.array(
    z.object({ id: z.string(), name: z.string(), role: z.enum(ROLES), title: z.string() }),
  ),
  removed: z.array(z.string()).default([]),
});

let members: readonly Persona[] = [];
/** Seed people removed from the team. They stay out of the lists but the seed itself is untouched. */
let removedSeed: readonly string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

/** Reads people added in the panel. Client only; the server and hydration see an empty list. */
export function ensureTeamLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const value = readJSON(TEAM_KEY, (raw) => {
    const parsed = stored.safeParse(raw);
    return parsed.success ? parsed.data : null;
  });
  members = value?.members ?? [];
  removedSeed = value?.removed ?? [];
  setExtraPersonas(members, removedSeed);
}

function commit(next: readonly Persona[], removed: readonly string[] = removedSeed): void {
  // A new array every time, so `useSyncExternalStore` sees a change even when only `removed` moved.
  members = [...next];
  removedSeed = removed;
  setExtraPersonas(next, removed);
  writeJSON(TEAM_KEY, { version: 1, members: next, removed });
  listeners.forEach((listener) => listener());
}

/** People added in the panel (not the seed team). Stable between changes, for `useSyncExternalStore`. */
export function getTeam(): readonly Persona[] {
  ensureTeamLoaded();
  return members;
}

const serverTeam: readonly Persona[] = [];
export function getServerTeam(): readonly Persona[] {
  return serverTeam;
}

export function subscribeTeam(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function uniqueId(name: string): string {
  const base = slugify(name) || "pessoa";
  // Seed ids stay taken after their people are removed, so an old id never points at someone new.
  const taken = new Set([...personas, ...members].map((persona) => persona.id));
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  return id;
}

export function addMember(
  actor: Actor,
  input: { name: string; role: Role; title: string },
): TeamResult<Persona> {
  if (typeof window === "undefined" || !can(actor, "manage_team")) return { ok: false, error: "forbidden" };
  ensureTeamLoaded();

  const name = input.name.trim().replace(/\s+/g, " ");
  const title = input.title.trim();
  if (name.length < NAME_MIN || name.length > NAME_MAX) return { ok: false, error: "name_invalid" };
  if (title.length === 0 || title.length > TITLE_MAX) return { ok: false, error: "title_invalid" };
  const lower = name.toLocaleLowerCase("pt-BR");
  if (allPersonas().some((persona) => persona.name.toLocaleLowerCase("pt-BR") === lower)) {
    return { ok: false, error: "name_taken" };
  }

  const person: Persona = { id: uniqueId(name), name, role: input.role, title };
  commit([...members, person]);
  return { ok: true, value: person };
}

/**
 * Removes someone from the team. Not yourself, not the last director, and not anyone who still owns
 * listings (reassign those first). Seed people are hidden rather than deleted, so a reset brings them back.
 */
export function removeMember(
  actor: Actor,
  id: string,
  ownedListingCount: number,
): TeamResult<Persona> {
  if (typeof window === "undefined" || !can(actor, "manage_team")) return { ok: false, error: "forbidden" };
  ensureTeamLoaded();
  if (id === actor.id) return { ok: false, error: "self" };
  const person = allPersonas().find((candidate) => candidate.id === id);
  if (!person) return { ok: false, error: "not_found" };
  if (person.role === "diretoria" && allPersonas().filter((p) => p.role === "diretoria").length <= 1) {
    return { ok: false, error: "last_director" };
  }
  if (ownedListingCount > 0) return { ok: false, error: "has_listings" };

  if (isSeedPersona(id)) commit(members, [...removedSeed, id]);
  else commit(members.filter((member) => member.id !== id));
  return { ok: true, value: person };
}

export function resetTeam(): void {
  removeItem(TEAM_KEY);
  members = [];
  removedSeed = [];
  loaded = true;
  setExtraPersonas([], []);
  listeners.forEach((listener) => listener());
}
