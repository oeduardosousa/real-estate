import { describe, expect, it } from "vitest";
import {
  availableTransitions,
  can,
  canTransition,
  canTransitionListing,
  closingStatus,
} from "./permissions";
import { aluguelListing, bruno, camila, helena, tiago, vendaListing } from "./fixtures";
import { ROLES, STATUSES, type Action, type Role, type Status } from "./types";

const T = true;
const F = false;

/** The expected matrix, written out from PAINEL.md. Camila owns the listing; Bruno does not. */
const matrix: [Action, Status, boolean, boolean, boolean, boolean][] = [
  // action, status, helena (diretoria), camila (owner), bruno (other corretor), tiago (back-office)
  ["view", "Rascunho", T, T, F, T],
  ["view", "Em revisão", T, T, F, T],
  ["view", "Publicado", T, T, T, T],
  ["view", "Reservado", T, T, T, T],
  ["view", "Retirado", T, T, F, T],
  ["create", "Rascunho", T, T, T, T],
  ["edit", "Rascunho", T, T, F, T],
  ["edit", "Devolvido", T, T, F, T],
  ["edit", "Em revisão", T, F, F, F],
  ["edit", "Publicado", T, F, F, F],
  ["edit", "Reservado", T, F, F, F],
  ["edit", "Vendido", F, F, F, F],
  ["edit", "Alugado", F, F, F, F],
  ["photos", "Rascunho", T, T, F, T],
  ["photos", "Devolvido", T, T, F, T],
  ["photos", "Em revisão", T, F, F, F],
  ["photos", "Vendido", F, F, F, F],
  ["send_to_review", "Rascunho", T, T, F, T],
  ["send_to_review", "Publicado", F, F, F, F],
  ["approve", "Em revisão", T, F, F, F],
  ["approve", "Rascunho", F, F, F, F],
  ["return", "Em revisão", T, F, F, F],
  ["return", "Publicado", F, F, F, F],
  ["unpublish", "Publicado", T, F, F, F],
  ["unpublish", "Reservado", F, F, F, F],
  ["publish", "Retirado", T, F, F, F],
  ["publish", "Em revisão", F, F, F, F],
  ["reserve", "Publicado", T, T, F, F],
  ["reserve", "Reservado", T, T, F, F],
  ["reserve", "Rascunho", F, F, F, F],
  ["close", "Reservado", T, T, F, F],
  ["close", "Publicado", F, F, F, F],
  ["close", "Vendido", F, F, F, F],
  ["reopen", "Devolvido", T, T, F, T],
  ["reopen", "Retirado", T, T, F, T],
  ["reopen", "Publicado", F, F, F, F],
  ["reassign", "Rascunho", T, F, F, F],
  ["reassign", "Publicado", T, F, F, F],
  ["view_team", "Publicado", T, T, T, T],
  ["manage_team", "Publicado", T, F, F, F],
];

describe("can: permission matrix", () => {
  it.each(matrix)("%s while %s", (action, status, h, c, b, t) => {
    const listing = vendaListing(status);
    expect(can(helena, action, listing), "diretoria").toBe(h);
    expect(can(camila, action, listing), "corretor (owner)").toBe(c);
    expect(can(bruno, action, listing), "corretor (not owner)").toBe(b);
    expect(can(tiago, action, listing), "back-office").toBe(t);
  });

  it("denies listing actions when there is no listing", () => {
    expect(can(helena, "edit")).toBe(false);
    expect(can(helena, "approve")).toBe(false);
  });

  it("allows create and the team pages without a listing", () => {
    expect(can(tiago, "create")).toBe(true);
    expect(can(bruno, "view_team")).toBe(true);
    expect(can(helena, "manage_team")).toBe(true);
    expect(can(camila, "manage_team")).toBe(false);
  });
});

/** Every legal edge and the roles allowed on it, written independently of the implementation. */
const legal: Record<string, Role[]> = {
  "Rascunho>Em revisão": ["diretoria", "corretor", "backoffice"],
  "Em revisão>Publicado": ["diretoria"],
  "Em revisão>Devolvido": ["diretoria"],
  "Devolvido>Rascunho": ["diretoria", "corretor", "backoffice"],
  "Publicado>Retirado": ["diretoria"],
  "Publicado>Reservado": ["diretoria", "corretor"],
  "Reservado>Publicado": ["diretoria", "corretor"],
  "Reservado>Vendido": ["diretoria", "corretor"],
  "Reservado>Alugado": ["diretoria", "corretor"],
  "Retirado>Rascunho": ["diretoria", "corretor", "backoffice"],
  "Retirado>Publicado": ["diretoria"],
};

describe("canTransition: status machine", () => {
  for (const role of ROLES) {
    for (const from of STATUSES) {
      for (const to of STATUSES) {
        const expected = legal[`${from}>${to}`]?.includes(role) ?? false;
        it(`${role}: ${from} → ${to} is ${expected ? "legal" : "illegal"}`, () => {
          expect(canTransition(role, from, to)).toBe(expected);
        });
      }
    }
  }

  it("treats Vendido and Alugado as terminal", () => {
    for (const role of ROLES) {
      for (const to of STATUSES) {
        expect(canTransition(role, "Vendido", to)).toBe(false);
        expect(canTransition(role, "Alugado", to)).toBe(false);
      }
    }
  });

  it("never lets a listing skip Reservado on its way to closed", () => {
    for (const role of ROLES) {
      expect(canTransition(role, "Publicado", "Vendido")).toBe(false);
      expect(canTransition(role, "Publicado", "Alugado")).toBe(false);
    }
  });
});

describe("Reservado", () => {
  it("is entered only from Publicado", () => {
    for (const from of STATUSES) {
      expect(canTransition("diretoria", from, "Reservado")).toBe(from === "Publicado");
    }
  });

  it("can be cancelled back to Publicado, or closed", () => {
    const reserved = vendaListing("Reservado");
    expect(canTransitionListing(helena, reserved, "Publicado")).toBe(true);
    expect(canTransitionListing(camila, reserved, "Publicado")).toBe(true);
    expect(canTransitionListing(camila, reserved, "Vendido")).toBe(true);
    expect(canTransitionListing(camila, reserved, "Retirado")).toBe(false);
  });

  it("is off limits to back-office and to a corretor who does not own the listing", () => {
    const published = vendaListing("Publicado");
    expect(canTransitionListing(tiago, published, "Reservado")).toBe(false);
    expect(canTransitionListing(bruno, published, "Reservado")).toBe(false);
    expect(canTransitionListing(camila, published, "Reservado")).toBe(true);
  });
});

describe("closing rule: venda closes as Vendido, aluguel as Alugado", () => {
  it("maps purpose to the closing status", () => {
    expect(closingStatus("venda")).toBe("Vendido");
    expect(closingStatus("aluguel")).toBe("Alugado");
  });

  it("lets a venda listing close only as Vendido", () => {
    const listing = vendaListing("Reservado");
    expect(canTransitionListing(helena, listing, "Vendido")).toBe(true);
    expect(canTransitionListing(helena, listing, "Alugado")).toBe(false);
    expect(can(helena, "close", listing)).toBe(true);
  });

  it("lets an aluguel listing close only as Alugado", () => {
    const listing = aluguelListing("Reservado");
    const marina = { id: "marina-alvarenga", role: "corretor" } as const;
    expect(canTransitionListing(helena, listing, "Alugado")).toBe(true);
    expect(canTransitionListing(helena, listing, "Vendido")).toBe(false);
    expect(canTransitionListing(marina, listing, "Alugado")).toBe(true);
    expect(canTransitionListing(marina, listing, "Vendido")).toBe(false);
  });
});

describe("availableTransitions", () => {
  it("lists what each persona can do with a published venda listing", () => {
    const listing = vendaListing("Publicado");
    expect(availableTransitions(helena, listing).sort()).toEqual(["Reservado", "Retirado"]);
    expect(availableTransitions(camila, listing)).toEqual(["Reservado"]);
    expect(availableTransitions(bruno, listing)).toEqual([]);
    expect(availableTransitions(tiago, listing)).toEqual([]);
  });

  it("offers only the matching close for a reserved listing", () => {
    expect(availableTransitions(helena, vendaListing("Reservado")).sort()).toEqual([
      "Publicado",
      "Vendido",
    ]);
    expect(availableTransitions(helena, aluguelListing("Reservado")).sort()).toEqual([
      "Alugado",
      "Publicado",
    ]);
  });
});
