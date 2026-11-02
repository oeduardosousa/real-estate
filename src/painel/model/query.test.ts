import { describe, expect, it } from "vitest";
import { filterListings, normalizeText, sortListings } from "./query";
import { getPersona } from "./personas";
import { buildSeed } from "./seed";
import type { PanelListing } from "./types";

const NOW = new Date("2026-06-30T12:00:00.000Z");
const all = buildSeed(NOW).listings;
const owner = (id: string) => getPersona(id)?.name ?? "";

describe("normalizeText", () => {
  it("drops accents and case", () => {
    expect(normalizeText("  Funcionários ")).toBe("funcionarios");
  });
});

describe("filterListings", () => {
  it("returns everything with no filter", () => {
    expect(filterListings(all, { status: "todos", query: "" }, owner)).toHaveLength(12);
  });

  it("filters by status", () => {
    const mixed: PanelListing[] = all.map((l, i) => (i < 2 ? { ...l, status: "Retirado" } : l));
    expect(filterListings(mixed, { status: "Retirado", query: "" }, owner)).toHaveLength(2);
    expect(filterListings(mixed, { status: "Rascunho", query: "" }, owner)).toHaveLength(0);
  });

  it("searches title, neighborhood and owner without caring about accents", () => {
    const run = (query: string) => filterListings(all, { status: "todos", query }, owner).map((l) => l.id);
    expect(run("funcionarios")).toEqual([8, 12]);
    expect(run("cobertura")).toEqual([1, 11]);
    expect(run("camila")).toHaveLength(4);
    expect(run("nova lima")).toEqual([5]);
    expect(run("zzz")).toEqual([]);
  });

  it("combines status and search", () => {
    const mixed: PanelListing[] = all.map((l) => (l.id === 8 ? { ...l, status: "Retirado" } : l));
    expect(filterListings(mixed, { status: "Retirado", query: "funcionarios" }, owner).map((l) => l.id)).toEqual([8]);
    expect(filterListings(mixed, { status: "Publicado", query: "funcionarios" }, owner).map((l) => l.id)).toEqual([12]);
  });
});

describe("sortListings", () => {
  it("sorts by title in Portuguese order", () => {
    const titles = sortListings(all, "titulo").map((l) => l.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  it("sorts by price both ways", () => {
    expect(sortListings(all, "preco-desc")[0].price).toBe(9_500_000);
    expect(sortListings(all, "preco-asc")[0].price).toBe(3_800);
  });

  it("puts the most recently updated first", () => {
    const sorted = sortListings(all, "recentes");
    expect(sorted[0].id).toBe(1); // seeded most recently
  });

  it("does not mutate its input", () => {
    const copy = [...all];
    sortListings(all, "preco-desc");
    expect(all).toEqual(copy);
  });
});
