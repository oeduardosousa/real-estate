import { describe, expect, it } from "vitest";
import { hasExclamation, reviewChecklist, validateRequired } from "./checklist";
import { vendaListing } from "./fixtures";
import type { PanelListing, PhotoMeta } from "./types";

const photo = (n: number, alt = "Sala de estar"): PhotoMeta => ({
  id: `p${n}`,
  alt,
  width: 1600,
  height: 900,
  bytes: 1000,
});

const LONG_TEXT = "Uma descrição calma e precisa do imóvel, com a luz da manhã e a vista para a serra. ".repeat(2);

/** A listing that passes every checklist item. */
function readyListing(overrides: Partial<PanelListing> = {}): PanelListing {
  return {
    ...vendaListing("Rascunho"),
    featured: false,
    photos: [photo(1), photo(2), photo(3)],
    coverPhotoId: "p1",
    summary: "Apartamento calmo no Savassi.",
    description: [LONG_TEXT],
    ...overrides,
  };
}

describe("validateRequired", () => {
  it("accepts a complete listing", () => {
    expect(validateRequired(readyListing())).toEqual({});
  });

  it("reports each missing field with a message", () => {
    const errors = validateRequired({
      title: "ab",
      type: "Apartamento",
      purpose: "venda",
      price: 0,
      area: 0,
      bedrooms: 0,
      neighborhood: "",
      city: " ",
    });
    expect(Object.keys(errors).sort()).toEqual(["area", "bedrooms", "city", "neighborhood", "price", "title"]);
    expect(errors.price).toMatch(/maior que zero/);
  });
});

describe("reviewChecklist", () => {
  it("is ready when everything is in place", () => {
    const { ready, items } = reviewChecklist(readyListing());
    expect(ready).toBe(true);
    expect(items.every((item) => item.ok && item.problems.length === 0)).toBe(true);
  });

  it("blocks on invalid required fields", () => {
    const { ready, items } = reviewChecklist(readyListing({ price: 0 }));
    expect(ready).toBe(false);
    expect(items.find((i) => i.id === "required")?.ok).toBe(false);
  });

  describe("photos", () => {
    it("needs at least 3", () => {
      const result = reviewChecklist(readyListing({ photos: [photo(1), photo(2)] }));
      expect(result.ready).toBe(false);
      expect(result.items.find((i) => i.id === "photos")?.problems[0]).toMatch(/Falta 1 foto/);
    });

    it("needs 6 for a featured listing", () => {
      const five = readyListing({ featured: true, photos: [1, 2, 3, 4, 5].map((n) => photo(n)) });
      expect(reviewChecklist(five).ready).toBe(false);
      const six = readyListing({ featured: true, photos: [1, 2, 3, 4, 5, 6].map((n) => photo(n)) });
      expect(reviewChecklist(six).ready).toBe(true);
    });

    it("needs alt text on every photo", () => {
      const result = reviewChecklist(readyListing({ photos: [photo(1), photo(2, "  "), photo(3, "")] }));
      expect(result.ready).toBe(false);
      expect(result.items.find((i) => i.id === "photos")?.problems).toContain("2 fotos estão sem texto alternativo.");
    });
  });

  it("needs a cover that is one of the photos", () => {
    expect(reviewChecklist(readyListing({ coverPhotoId: null })).ready).toBe(false);
    expect(reviewChecklist(readyListing({ coverPhotoId: "gone" })).ready).toBe(false);
  });

  describe("text", () => {
    it("needs a summary", () => {
      expect(reviewChecklist(readyListing({ summary: " " })).ready).toBe(false);
    });

    it("needs a description of at least 120 characters", () => {
      expect(reviewChecklist(readyListing({ description: ["Curta."] })).ready).toBe(false);
      expect(reviewChecklist(readyListing({ description: ["a".repeat(119)] })).ready).toBe(false);
      expect(reviewChecklist(readyListing({ description: ["a".repeat(120)] })).ready).toBe(true);
    });

    it("rejects exclamation marks in any copy", () => {
      for (const field of ["title", "summary"] as const) {
        expect(reviewChecklist(readyListing({ [field]: "Incrível!" })).ready).toBe(false);
      }
      expect(reviewChecklist(readyListing({ description: [LONG_TEXT + "Venha ver!"] })).ready).toBe(false);
      expect(reviewChecklist(readyListing({ features: ["Piscina!"] })).ready).toBe(false);
    });
  });

  it("detects exclamation marks", () => {
    expect(hasExclamation(readyListing())).toBe(false);
    expect(hasExclamation(readyListing({ summary: "Oi!" }))).toBe(true);
  });
});
