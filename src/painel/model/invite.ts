import { roleLabels, roleSummaries } from "./personas";
import type { Persona } from "./types";

/** `.example` is reserved (RFC 2606), so the simulated sender can never be a real mailbox. */
export const INVITE_SENDER = "convites@curral.example";

export interface InviteEmail {
  from: string;
  to: string;
  subject: string;
  /** Body paragraphs, greeting first. */
  paragraphs: string[];
  /** Label of the button in the mail. */
  action: string;
  footer: string;
}

const firstName = (name: string) => name.split(" ")[0];

/** The invitation a new team member would receive. Nothing is sent: the panel only shows it. */
export function buildInvite(person: Persona, inviter: Persona): InviteEmail {
  return {
    from: `Curral Residências <${INVITE_SENDER}>`,
    to: `${person.name} <${person.email ?? ""}>`,
    subject: `${firstName(inviter.name)} convidou você para a equipe da Curral Residências`,
    paragraphs: [
      `Olá, ${firstName(person.name)}.`,
      `${inviter.name} cadastrou você na equipe como ${person.title} (${roleLabels[person.role]}).`,
      roleSummaries[person.role],
      "Para entrar no painel, aceite o convite e escolha a sua senha.",
    ],
    action: "Aceitar convite",
    footer: "Se você não esperava este convite, ignore esta mensagem.",
  };
}
