/**
 * Safe localStorage access. Nothing here touches storage on the server. When storage is blocked,
 * full or cleared, values live in memory for the rest of the visit instead of throwing.
 */

/** Values that could not be written to localStorage. Read first so a failed write is not shadowed. */
const memory = new Map<string, string>();
let degraded = false;

function backend(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    // Accessing localStorage throws when site data is blocked.
    return null;
  }
}

/** True once any write fell back to memory, meaning data will not survive a reload. */
export function isStorageDegraded(): boolean {
  return degraded;
}

export function readItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  const held = memory.get(key);
  if (held !== undefined) return held;
  try {
    return backend()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** Returns false when the value only made it to memory (or nowhere, on the server). */
export function writeItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const store = backend();
    if (!store) throw new Error("localStorage unavailable");
    store.setItem(key, value);
    memory.delete(key);
    return true;
  } catch {
    memory.set(key, value);
    degraded = true;
    return false;
  }
}

export function removeItem(key: string): void {
  memory.delete(key);
  try {
    backend()?.removeItem(key);
  } catch {
    // Nothing to remove if storage is blocked.
  }
}

/** Reads JSON and runs it through `parse`, which returns null for anything malformed. */
export function readJSON<T>(key: string, parse: (value: unknown) => T | null): T | null {
  const raw = readItem(key);
  if (raw === null) return null;
  try {
    return parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    return writeItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}
