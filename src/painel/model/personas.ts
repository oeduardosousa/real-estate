import type { Persona, Role } from "./types";

export const roleLabels: Record<Role, string> = {
  diretoria: "Diretoria",
  corretor: "Corretor",
  backoffice: "Back-office",
};

/** One line per role for the persona picker, drawn from the permission matrix in PAINEL.md. */
export const roleSummaries: Record<Role, string> = {
  diretoria: "Aprova, devolve e publica. Vê todos os imóveis.",
  corretor: "Cadastra e acompanha os próprios imóveis.",
  backoffice: "Cadastra e completa imóveis de toda a equipe.",
};

/**
 * Demo personas (PAINEL.md). The first five are the BRIEF.md team and share their ids with `team`;
 * the last two are invented back-office staff.
 */
export const personas: readonly Persona[] = [
  { id: "helena-vasconcelos", name: "Helena Vasconcelos", role: "diretoria", title: "Sócia-diretora" },
  { id: "rafael-mendonca", name: "Rafael Mendonça", role: "diretoria", title: "Diretor comercial" },
  { id: "camila-drummond", name: "Camila Drummond", role: "corretor", title: "Corretora, alto padrão" },
  { id: "bruno-teixeira", name: "Bruno Teixeira", role: "corretor", title: "Corretor, investimentos" },
  { id: "marina-alvarenga", name: "Marina Alvarenga", role: "corretor", title: "Corretora, locação e relacionamento" },
  { id: "tiago-pimentel", name: "Tiago Pimentel", role: "backoffice", title: "Back-office, cadastro" },
  { id: "larissa-coelho", name: "Larissa Coelho", role: "backoffice", title: "Back-office, mídia e conteúdo" },
];

/** People added from the Equipe screen. Filled by the team store; always empty on the server. */
let extras: readonly Persona[] = [];

export function setExtraPersonas(list: readonly Persona[]): void {
  extras = list;
}

/** The seed team plus anyone added in the panel. */
export function allPersonas(): readonly Persona[] {
  return [...personas, ...extras];
}

export function isSeedPersona(id: string): boolean {
  return personas.some((persona) => persona.id === id);
}

export function getPersona(id: string): Persona | undefined {
  return allPersonas().find((persona) => persona.id === id);
}

/** Personas that can own a listing: the ones who sell. */
export function getOwnerCandidates(): readonly Persona[] {
  return allPersonas().filter((persona) => persona.role !== "backoffice");
}
