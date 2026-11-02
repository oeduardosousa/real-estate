import { describe, expect, it } from "vitest";
import { describeHistory, transitionVerb } from "./history";
import { STATUSES, type ActivityEntry } from "./types";

const names: Record<string, string> = { camila: "Camila", helena: "Helena", marina: "Marina" };
const nameOf = (id: string) => names[id] ?? "Alguém";

let n = 0;
const base = (actorId: string, at: string) => ({ id: `e${++n}`, listingId: 1, actorId, at });
const t = (minutes: number) => new Date(Date.UTC(2026, 0, 1, 10, minutes)).toISOString();

describe("describeHistory", () => {
  it("reads each kind of entry in Portuguese, newest first", () => {
    const entries: ActivityEntry[] = [
      { ...base("camila", t(0)), kind: "create" },
      { ...base("camila", t(60)), kind: "transition", from: "Rascunho", to: "Em revisão" },
      { ...base("helena", t(120)), kind: "transition", from: "Em revisão", to: "Devolvido", comment: "Faltam fotos da sala." },
      { ...base("helena", t(180)), kind: "reassign", fromOwnerId: "camila", toOwnerId: "marina" },
    ];
    const lines = describeHistory(entries, 1, nameOf);
    expect(lines.map((line) => line.text)).toEqual([
      "Helena passou o imóvel de Camila para Marina",
      "Helena devolveu para ajustes",
      "Camila enviou para revisão",
      "Camila criou o imóvel",
    ]);
    expect(lines[1].comment).toBe("Faltam fotos da sala.");
    expect(lines[0].comment).toBeUndefined();
  });

  it("merges consecutive edits by the same person and lists each field once", () => {
    const entries: ActivityEntry[] = [
      { ...base("camila", t(0)), kind: "edit", fields: ["title"] },
      { ...base("camila", t(3)), kind: "edit", fields: ["price", "title"] },
      { ...base("camila", t(9)), kind: "edit", fields: ["neighborhood"] },
    ];
    const lines = describeHistory(entries, 1, nameOf);
    expect(lines).toHaveLength(1);
    expect(lines[0].text).toBe("Camila editou título, preço e bairro");
    expect(lines[0].at).toBe(t(9));
  });

  it("keeps edits apart across a long gap, another person, or another entry kind", () => {
    const entries: ActivityEntry[] = [
      { ...base("camila", t(0)), kind: "edit", fields: ["title"] },
      { ...base("camila", t(30)), kind: "edit", fields: ["title"] },
      { ...base("marina", t(31)), kind: "edit", fields: ["price"] },
      { ...base("marina", t(32)), kind: "transition", from: "Rascunho", to: "Em revisão" },
      { ...base("marina", t(33)), kind: "edit", fields: ["area"] },
    ];
    expect(describeHistory(entries, 1, nameOf)).toHaveLength(5);
  });

  it("only includes the requested listing and labels unknown fields by key", () => {
    const entries: ActivityEntry[] = [
      { ...base("camila", t(0)), kind: "edit", fields: ["algoNovo"] },
      { ...base("camila", t(1)), listingId: 2, kind: "create" },
    ];
    const lines = describeHistory(entries, 1, nameOf);
    expect(lines.map((line) => line.text)).toEqual(["Camila editou algoNovo"]);
  });

  it("orders by time even when the log is out of order, and does not change it", () => {
    const entries: ActivityEntry[] = [
      { ...base("camila", t(10)), kind: "transition", from: "Rascunho", to: "Em revisão" },
      { ...base("camila", t(0)), kind: "create" },
    ];
    const copy = [...entries];
    expect(describeHistory(entries, 1, nameOf)[0].text).toBe("Camila enviou para revisão");
    expect(entries).toEqual(copy);
  });
});

describe("transitionVerb", () => {
  it("has a phrase for every destination status", () => {
    for (const to of STATUSES) expect(transitionVerb("Publicado", to).length).toBeGreaterThan(3);
  });

  it("tells approve, cancel reservation and publish again apart", () => {
    expect(transitionVerb("Em revisão", "Publicado")).toBe("aprovou e publicou");
    expect(transitionVerb("Reservado", "Publicado")).toBe("cancelou a reserva");
    expect(transitionVerb("Retirado", "Publicado")).toBe("publicou novamente");
  });
});
