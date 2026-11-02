import { describe, expect, it } from "vitest";
import { parseWhole, splitLines, splitParagraphs, toFormValues, toPatch } from "./form";
import { buildSeed } from "./seed";
import { applyEdit } from "./workflow";
import { camila, fakeClock, vendaListing } from "./fixtures";

describe("parseWhole", () => {
  it("reads digits and ignores separators and symbols", () => {
    expect(parseWhole("1.350.000")).toBe(1350000);
    expect(parseWhole("R$ 3 800")).toBe(3800);
    expect(parseWhole("42")).toBe(42);
  });

  it("reads empty or junk as 0", () => {
    expect(parseWhole("")).toBe(0);
    expect(parseWhole("abc")).toBe(0);
  });
});

describe("text splitting", () => {
  it("splits lines and drops blanks", () => {
    expect(splitLines(" Piscina \n\n Lareira\r\n")).toEqual(["Piscina", "Lareira"]);
  });

  it("splits paragraphs on blank lines", () => {
    expect(splitParagraphs("Um.\nainda um.\n\n\nDois.")).toEqual(["Um.\nainda um.", "Dois."]);
  });
});

describe("form round trip", () => {
  it("turns every seed listing into a patch that changes nothing", () => {
    for (const listing of buildSeed().listings) {
      const result = applyEdit({ ...listing, status: "Rascunho" }, { id: listing.ownerId, role: "diretoria" }, toPatch(toFormValues(listing)), fakeClock());
      expect(result, listing.slug).toEqual({ ok: false, error: "no_changes" });
    }
  });

  it("carries edits through to the listing", () => {
    const values = { ...toFormValues(vendaListing("Rascunho")), title: "  Novo nome ", price: "2.000.000", features: "A\nB" };
    const result = applyEdit(vendaListing("Rascunho"), camila, toPatch(values), fakeClock());
    if (!result.ok) throw new Error(result.error);
    expect(result.value.listing).toMatchObject({ title: "Novo nome", price: 2_000_000, features: ["A", "B"] });
  });
});
