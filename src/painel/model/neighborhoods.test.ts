import { describe, expect, it } from "vitest";
import { neighborhoodsOf } from "./neighborhoods";
import { buildSeed } from "./seed";
import type { Status } from "./types";

const at = (status: Status, neighborhood: string, city = "Belo Horizonte") => ({ status, neighborhood, city });

describe("neighborhoodsOf", () => {
  it("lists every neighbourhood of the seed listings, all of them published", () => {
    const result = neighborhoodsOf(buildSeed().listings);
    expect(result.reduce((sum, item) => sum + item.count, 0)).toBe(12);
    expect(result.find((item) => item.name === "Vale do Sol")?.city).toBe("Nova Lima");
  });

  it("counts published and reserved listings only", () => {
    const result = neighborhoodsOf([
      at("Publicado", "Lourdes"),
      at("Reservado", "Lourdes"),
      at("Rascunho", "Savassi"),
      at("Em revisão", "Savassi"),
      at("Retirado", "Sion"),
      at("Vendido", "Sion"),
      at("Alugado", "Serra"),
    ]);
    expect(result).toEqual([{ name: "Lourdes", city: "Belo Horizonte", count: 2 }]);
  });

  it("adds a neighbourhood when a listing is published there and drops it when none is left", () => {
    const before = neighborhoodsOf([at("Publicado", "Lourdes")]);
    const after = neighborhoodsOf([at("Publicado", "Lourdes"), at("Publicado", "Pampulha")]);
    const gone = neighborhoodsOf([at("Retirado", "Lourdes"), at("Publicado", "Pampulha")]);
    expect(before.map((item) => item.name)).toEqual(["Lourdes"]);
    expect(after.map((item) => item.name)).toEqual(["Lourdes", "Pampulha"]);
    expect(gone.map((item) => item.name)).toEqual(["Pampulha"]);
  });

  it("ignores blank neighbourhoods and orders by count, then name", () => {
    const result = neighborhoodsOf([
      at("Publicado", " "),
      at("Publicado", "Sion"),
      at("Publicado", "Belvedere"),
      at("Publicado", "Belvedere"),
      at("Publicado", "Anchieta"),
    ]);
    expect(result.map((item) => item.name)).toEqual(["Belvedere", "Anchieta", "Sion"]);
  });
});
