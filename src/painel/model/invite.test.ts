import { describe, expect, it } from "vitest";
import { buildInvite, INVITE_SENDER } from "./invite";
import type { Persona } from "./types";

const inviter: Persona = { id: "helena", name: "Helena Vasconcelos", role: "diretoria", title: "Diretora" };
const person: Persona = {
  id: "paula-nunes",
  name: "Paula Nunes",
  role: "corretor",
  title: "Corretora, lançamentos",
  email: "paula@curral.example",
};

describe("buildInvite", () => {
  it("addresses the new member and names who invited them", () => {
    const mail = buildInvite(person, inviter);
    expect(mail.to).toBe("Paula Nunes <paula@curral.example>");
    expect(mail.from).toContain(INVITE_SENDER);
    expect(mail.subject).toContain("Helena");
    expect(mail.paragraphs[0]).toBe("Olá, Paula.");
    expect(mail.paragraphs.join(" ")).toContain("Corretora, lançamentos");
  });
});
