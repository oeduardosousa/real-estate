import { getPersona } from "../model/personas";
import type { Persona } from "../model/types";
import { ensureTeamLoaded } from "./team";
import { readItem, removeItem, writeItem } from "./storage";

export const SESSION_KEY = "curral-painel:persona";

/** undefined = not read yet (server and first client render), null = nobody signed in. */
type SessionValue = Persona | null | undefined;

let current: SessionValue;
const listeners = new Set<() => void>();

/** Demo login: just remembers which persona the visitor picked. No credentials exist. */
export function getSession(): SessionValue {
  if (typeof window === "undefined") return undefined;
  if (current === undefined) {
    ensureTeamLoaded();
    const id = readItem(SESSION_KEY);
    current = (id && getPersona(id)) || null;
  }
  return current;
}

export function getServerSession(): SessionValue {
  return undefined;
}

export function signIn(personaId: string): void {
  const persona = getPersona(personaId);
  if (!persona) return;
  current = persona;
  writeItem(SESSION_KEY, persona.id);
  listeners.forEach((listener) => listener());
}

export function signOut(): void {
  current = null;
  removeItem(SESSION_KEY);
  listeners.forEach((listener) => listener());
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
