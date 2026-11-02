import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bruno, helena, tiago } from "../model/fixtures";

const rafael = { id: "rafael-mendonca", role: "diretoria" } as const;

function fakeLocalStorage(): Storage & { data: Map<string, string> } {
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
  };
}

/** Loads fresh copies of the team store and the persona registry, as a new page load would. */
async function fresh() {
  vi.resetModules();
  const [team, personas] = await Promise.all([import("./team"), import("../model/personas")]);
  return { ...team, ...personas };
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

const mail = (name: string) => `${name.trim().toLowerCase().replace(/\s+/g, ".")}@curral.example`;

describe("addMember", () => {
  it("adds a person, registers them and persists", async () => {
    const t = await fresh();
    const result = t.addMember(helena, { name: "  Paula   Nunes ", email: mail("  Paula   Nunes "), role: "corretor", title: "Corretora, lançamentos" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ id: "paula-nunes", name: "Paula Nunes", role: "corretor" });
    expect(t.getPersona("paula-nunes")?.name).toBe("Paula Nunes");
    expect(t.getOwnerCandidates().some((p) => p.id === "paula-nunes")).toBe(true);
    expect(storage.data.has(t.TEAM_KEY)).toBe(true);
  });

  it("keeps back-office staff out of the owner list", async () => {
    const t = await fresh();
    t.addMember(helena, { name: "Davi Prado", email: mail("Davi Prado"), role: "backoffice", title: "Back-office, contratos" });
    expect(t.getPersona("davi-prado")).toBeDefined();
    expect(t.getOwnerCandidates().some((p) => p.id === "davi-prado")).toBe(false);
  });

  it("is reloaded from storage on the next page load", async () => {
    const first = await fresh();
    first.addMember(helena, { name: "Paula Nunes", email: mail("Paula Nunes"), role: "corretor", title: "Corretora" });
    const second = await fresh();
    expect(second.getTeam()).toHaveLength(1);
    expect(second.getPersona("paula-nunes")).toBeDefined();
  });

  it("only the Diretoria manages the team", async () => {
    const t = await fresh();
    for (const actor of [bruno, tiago]) {
      expect(t.addMember(actor, { name: "Paula Nunes", email: mail("Paula Nunes"), role: "corretor", title: "Corretora" })).toEqual({
        ok: false,
        error: "forbidden",
      });
    }
  });

  it("requires a valid, unique e-mail and stores it lower-cased", async () => {
    const t = await fresh();
    const base = { name: "Paula Nunes", role: "corretor", title: "Corretora" } as const;
    expect(t.addMember(helena, { ...base, email: "" })).toEqual({ ok: false, error: "email_invalid" });
    expect(t.addMember(helena, { ...base, email: "paula@" })).toEqual({ ok: false, error: "email_invalid" });
    const added = t.addMember(helena, { ...base, email: " Paula@Curral.Example " });
    expect(added.ok && added.value.email).toBe("paula@curral.example");
    expect(t.addMember(helena, { name: "Outra Pessoa", role: "corretor", title: "x", email: "PAULA@curral.example" })).toEqual({
      ok: false,
      error: "email_taken",
    });
  });

  it("rejects short names, empty titles and duplicates, ignoring case", async () => {
    const t = await fresh();
    expect(t.addMember(helena, { name: "Al", email: mail("Al"), role: "corretor", title: "x" })).toEqual({ ok: false, error: "name_invalid" });
    expect(t.addMember(helena, { name: "Paula Nunes", email: mail("Paula Nunes"), role: "corretor", title: " " })).toEqual({ ok: false, error: "title_invalid" });
    expect(t.addMember(helena, { name: "camila drummond", email: mail("camila drummond"), role: "corretor", title: "x" })).toEqual({ ok: false, error: "name_taken" });
  });

  it("gives people with the same slug different ids", async () => {
    const t = await fresh();
    const a = t.addMember(helena, { name: "João Silva", email: "joao1@curral.example", role: "corretor", title: "x" });
    const b = t.addMember(helena, { name: "Joao Silva", email: "joao2@curral.example", role: "corretor", title: "x" });
    expect(a.ok && a.value.id).toBe("joao-silva");
    expect(b.ok && b.value.id).toBe("joao-silva-2");
  });

  it("falls back to an empty team when storage holds garbage", async () => {
    storage.data.set("curral-painel:team", "{nope");
    const t = await fresh();
    expect(t.getTeam()).toEqual([]);
  });
});

describe("removeMember", () => {
  it("removes an added person who owns no listings", async () => {
    const t = await fresh();
    t.addMember(helena, { name: "Paula Nunes", email: mail("Paula Nunes"), role: "corretor", title: "Corretora" });
    expect(t.removeMember(helena, "paula-nunes", 0).ok).toBe(true);
    expect(t.getPersona("paula-nunes")).toBeUndefined();
  });

  it("removes seed people too, and a reset brings them back", async () => {
    const t = await fresh();
    expect(t.removeMember(helena, "camila-drummond", 0).ok).toBe(true);
    expect(t.getPersona("camila-drummond")).toBeUndefined();
    expect(t.getOwnerCandidates().some((p) => p.id === "camila-drummond")).toBe(false);
    const reloaded = await fresh();
    expect(reloaded.getTeam()).toEqual([]);
    expect(reloaded.getPersona("camila-drummond")).toBeUndefined();
    reloaded.resetTeam();
    expect(reloaded.getPersona("camila-drummond")).toBeDefined();
  });

  it("does not hand a removed seed id to a new person", async () => {
    const t = await fresh();
    t.removeMember(helena, "camila-drummond", 0);
    const added = t.addMember(helena, { name: "Camila Drummond", email: mail("Camila Drummond"), role: "corretor", title: "x" });
    expect(added.ok && added.value.id).toBe("camila-drummond-2");
  });

  it("refuses yourself, the last director, people with listings and non-directors", async () => {
    const t = await fresh();
    t.addMember(helena, { name: "Paula Nunes", email: mail("Paula Nunes"), role: "corretor", title: "Corretora" });
    expect(t.removeMember(helena, "helena-vasconcelos", 0)).toEqual({ ok: false, error: "self" });
    expect(t.removeMember(helena, "paula-nunes", 2)).toEqual({ ok: false, error: "has_listings" });
    expect(t.removeMember(bruno, "paula-nunes", 0)).toEqual({ ok: false, error: "forbidden" });
    expect(t.removeMember(helena, "ninguem", 0)).toEqual({ ok: false, error: "not_found" });
    expect(t.removeMember(helena, "rafael-mendonca", 0).ok).toBe(true);
    expect(t.removeMember(rafael, "helena-vasconcelos", 0)).toEqual({ ok: false, error: "last_director" });
  });
});

describe("resetTeam", () => {
  it("drops everyone added", async () => {
    const t = await fresh();
    t.addMember(helena, { name: "Paula Nunes", email: mail("Paula Nunes"), role: "corretor", title: "Corretora" });
    t.resetTeam();
    expect(t.getTeam()).toEqual([]);
    expect(t.getPersona("paula-nunes")).toBeUndefined();
    expect(storage.data.has(t.TEAM_KEY)).toBe(false);
  });
});
