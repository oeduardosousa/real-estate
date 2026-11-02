import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bruno, camila, helena } from "../model/fixtures";
import { listings } from "@/data";
import { personas } from "../model/personas";
import { buildSeed } from "../model/seed";

function fakeLocalStorage(overrides: Partial<Storage> = {}): Storage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => void data.delete(key),
    setItem: (key: string, value: string) => void data.set(key, value),
    ...overrides,
  };
}

/** Loads a fresh copy of the store, as a new page load would. */
async function freshStore() {
  vi.resetModules();
  return import("./store");
}

let storage: ReturnType<typeof fakeLocalStorage>;

beforeEach(() => {
  storage = fakeLocalStorage();
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("seed", () => {
  it("has the 12 listings, all Publicado, each owned by a team member", () => {
    const { listings: seeded, activity } = buildSeed();
    expect(seeded).toHaveLength(12);
    expect(seeded.map((l) => l.id)).toEqual(listings.map((l) => l.id));
    const sellers = new Set(personas.filter((p) => p.role !== "backoffice").map((p) => p.id));
    for (const listing of seeded) {
      expect(listing.status).toBe("Publicado");
      expect(sellers.has(listing.ownerId)).toBe(true);
      expect(listing.ownerId).toBe(listing.agent);
    }
    expect(activity).toHaveLength(12);
  });

  it("keeps every public Listing field", () => {
    const first = buildSeed().listings[0];
    expect(first).toMatchObject({ slug: "cobertura-horizonte", price: 6_800_000, neighborhood: "Belvedere" });
  });
});

describe("store", () => {
  it("returns the seed for the server snapshot without touching storage", async () => {
    vi.unstubAllGlobals();
    const spy = vi.fn();
    vi.stubGlobal("localStorage", fakeLocalStorage({ getItem: spy }));
    const store = await freshStore();
    expect(store.getSnapshot().listings).toHaveLength(12);
    expect(store.getServerSnapshot().listings).toHaveLength(12);
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not write on the server", async () => {
    vi.unstubAllGlobals();
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", fakeLocalStorage({ setItem }));
    const store = await freshStore();
    expect(store.transitionListing(helena, 1, "Retirado")).toEqual({ ok: false, error: "forbidden" });
    expect(setItem).not.toHaveBeenCalled();
  });

  it("starts from the seed and does not write until something changes", async () => {
    const store = await freshStore();
    expect(store.getSnapshot().listings).toHaveLength(12);
    expect(storage.data.size).toBe(0);
  });

  it("persists a transition with its log entry and survives a reload", async () => {
    const store = await freshStore();
    const result = store.transitionListing(helena, 1, "Retirado");
    expect(result.ok).toBe(true);
    expect(storage.data.has(store.STORAGE_KEY)).toBe(true);

    const reloaded = await freshStore();
    const listing = reloaded.getSnapshot().listings.find((l) => l.id === 1);
    expect(listing?.status).toBe("Retirado");
    const entries = reloaded.getSnapshot().activity.filter((a) => a.listingId === 1);
    expect(entries.at(-1)).toMatchObject({ kind: "transition", from: "Publicado", to: "Retirado", actorId: helena.id });
  });

  it("logs edits and creations", async () => {
    const store = await freshStore();
    const created = store.createListing(camila, { title: "Casa Nova" });
    if (!created.ok) throw new Error("create failed");
    expect(store.updateListing(camila, created.value.id, { price: 5 }).ok).toBe(true);
    const kinds = store.getSnapshot().activity.filter((a) => a.listingId === created.value.id).map((a) => a.kind);
    expect(kinds).toEqual(["create", "edit"]);
  });

  it("blocks sending to review until the checklist passes", async () => {
    const store = await freshStore();
    const created = store.createListing(camila, { title: "Casa Nova" });
    if (!created.ok) throw new Error("create failed");
    expect(store.transitionListing(camila, created.value.id, "Em revisão")).toEqual({
      ok: false,
      error: "checklist_failed",
    });
    expect(store.getSnapshot().listings.find((l) => l.id === created.value.id)?.status).toBe("Rascunho");
  });

  it("returns errors without changing anything", async () => {
    const store = await freshStore();
    const before = store.getSnapshot();
    expect(store.transitionListing(bruno, 1, "Reservado")).toEqual({ ok: false, error: "forbidden" });
    expect(store.transitionListing(helena, 999, "Retirado")).toEqual({ ok: false, error: "not_found" });
    expect(store.getSnapshot()).toBe(before);
    expect(storage.data.size).toBe(0);
  });

  it("notifies subscribers on change, and not after unsubscribe", async () => {
    const store = await freshStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.transitionListing(helena, 1, "Retirado");
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.transitionListing(helena, 2, "Retirado");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("gives a new snapshot object after each change", async () => {
    const store = await freshStore();
    const before = store.getSnapshot();
    store.transitionListing(helena, 1, "Retirado");
    expect(store.getSnapshot()).not.toBe(before);
    expect(before.listings.find((l) => l.id === 1)?.status).toBe("Publicado");
  });

  it("restores the demo data", async () => {
    const store = await freshStore();
    store.transitionListing(helena, 1, "Retirado");
    store.createListing(camila, { title: "Casa Nova" });
    await store.resetDemo();
    expect(storage.data.has(store.STORAGE_KEY)).toBe(false);
    const snapshot = store.getSnapshot();
    expect(snapshot.listings).toHaveLength(12);
    expect(snapshot.listings.every((l) => l.status === "Publicado")).toBe(true);
    expect(snapshot.activity).toHaveLength(12);
  });

  describe("safe fallbacks", () => {
    it("falls back to the seed when stored JSON is corrupted", async () => {
      storage.data.set("curral-painel:v1", "{not json");
      const store = await freshStore();
      expect(store.getSnapshot().listings).toHaveLength(12);
    });

    it("falls back to the seed when the stored shape is wrong", async () => {
      storage.data.set("curral-painel:v1", JSON.stringify({ version: 1, listings: [{ id: "x" }], activity: [] }));
      const store = await freshStore();
      expect(store.getSnapshot().listings).toHaveLength(12);
    });

    it("falls back to the seed when the stored version is unknown", async () => {
      storage.data.set("curral-painel:v1", JSON.stringify({ version: 2, listings: [], activity: [] }));
      const store = await freshStore();
      expect(store.getSnapshot().listings).toHaveLength(12);
    });

    it("keeps working in memory when localStorage throws on every call", async () => {
      vi.stubGlobal("localStorage", fakeLocalStorage({
        getItem: () => { throw new Error("blocked"); },
        setItem: () => { throw new Error("blocked"); },
        removeItem: () => { throw new Error("blocked"); },
      }));
      const store = await freshStore();
      expect(store.getSnapshot().listings).toHaveLength(12);
      expect(store.transitionListing(helena, 1, "Retirado").ok).toBe(true);
      expect(store.getSnapshot().listings.find((l) => l.id === 1)?.status).toBe("Retirado");
      expect(store.isPersistent()).toBe(false);
      await expect(store.resetDemo()).resolves.toBeUndefined();
    });

    it("keeps working when the localStorage getter itself throws", async () => {
      vi.unstubAllGlobals();
      vi.stubGlobal("window", {});
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        get() { throw new Error("SecurityError"); },
      });
      try {
        const store = await freshStore();
        expect(store.getSnapshot().listings).toHaveLength(12);
        expect(store.transitionListing(helena, 1, "Retirado").ok).toBe(true);
        expect(store.isPersistent()).toBe(false);
      } finally {
        Reflect.deleteProperty(globalThis, "localStorage");
      }
    });

    it("keeps the change in memory when the quota is exceeded", async () => {
      vi.stubGlobal("localStorage", fakeLocalStorage({
        setItem: () => { throw new DOMException("full", "QuotaExceededError"); },
      }));
      const store = await freshStore();
      expect(store.transitionListing(helena, 1, "Retirado").ok).toBe(true);
      expect(store.getSnapshot().listings.find((l) => l.id === 1)?.status).toBe("Retirado");
      expect(store.isPersistent()).toBe(false);
    });

    it("starts clean when site data was cleared between visits", async () => {
      const store = await freshStore();
      store.transitionListing(helena, 1, "Retirado");
      storage.data.clear();
      const reloaded = await freshStore();
      expect(reloaded.getSnapshot().listings.find((l) => l.id === 1)?.status).toBe("Publicado");
    });
  });
});
