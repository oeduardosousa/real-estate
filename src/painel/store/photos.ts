/**
 * Photo blobs in IndexedDB, keyed by photo id. If IndexedDB is missing, blocked or failing, blobs
 * are kept in memory for the visit. Every function is safe to call on the server and does nothing there.
 */

const DB_NAME = "curral-painel";
const STORE = "photos";

export const PHOTO_LIMITS = {
  perListing: 12,
  /** Total compressed bytes across all listings. */
  totalBytes: 60 * 1024 * 1024,
} as const;

export type PhotoLimitError = "too_many_photos" | "storage_full";

interface PhotoRecord {
  id: string;
  listingId: number;
  blob: Blob;
}

const memory = new Map<string, PhotoRecord>();
let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" }).createIndex("listingId", "listingId");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

/** Runs one request in a transaction. Resolves undefined if anything goes wrong. */
async function run<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<{ ok: true; value: T } | { ok: false }> {
  const db = await openDb();
  if (!db) return { ok: false };
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, mode);
      const request = action(tx.objectStore(STORE));
      tx.oncomplete = () => resolve({ ok: true, value: request.result });
      tx.onerror = tx.onabort = () => resolve({ ok: false });
    } catch {
      resolve({ ok: false });
    }
  });
}

async function allRecords(): Promise<PhotoRecord[]> {
  const result = await run<PhotoRecord[]>("readonly", (store) => store.getAll());
  return result.ok ? result.value : [...memory.values()];
}

export async function putPhoto(id: string, listingId: number, blob: Blob): Promise<void> {
  const record: PhotoRecord = { id, listingId, blob };
  const result = await run("readwrite", (store) => store.put(record));
  if (!result.ok) memory.set(id, record);
}

export async function getPhoto(id: string): Promise<Blob | null> {
  const held = memory.get(id);
  if (held) return held.blob;
  const result = await run<PhotoRecord | undefined>("readonly", (store) => store.get(id));
  return result.ok ? (result.value?.blob ?? null) : null;
}

export async function deletePhoto(id: string): Promise<void> {
  memory.delete(id);
  await run("readwrite", (store) => store.delete(id));
}

export async function deletePhotosFor(listingId: number): Promise<void> {
  for (const record of await allRecords()) {
    if (record.listingId === listingId) await deletePhoto(record.id);
  }
}

/** Removes every stored photo. Used by the demo reset. */
export async function clearPhotos(): Promise<void> {
  memory.clear();
  await run("readwrite", (store) => store.clear());
}

export interface PhotoUsage {
  count: number;
  bytes: number;
  /** Photo count per listing id. */
  perListing: Record<number, number>;
}

export async function photoUsage(): Promise<PhotoUsage> {
  const usage: PhotoUsage = { count: 0, bytes: 0, perListing: {} };
  for (const record of await allRecords()) {
    usage.count += 1;
    usage.bytes += record.blob.size;
    usage.perListing[record.listingId] = (usage.perListing[record.listingId] ?? 0) + 1;
  }
  return usage;
}

/** Pure cap check, run before storing a new photo. Null means it fits. */
export function checkPhotoCapacity(
  usage: Pick<PhotoUsage, "bytes">,
  listingPhotoCount: number,
  newBytes: number,
): PhotoLimitError | null {
  if (listingPhotoCount >= PHOTO_LIMITS.perListing) return "too_many_photos";
  if (usage.bytes + newBytes > PHOTO_LIMITS.totalBytes) return "storage_full";
  return null;
}
