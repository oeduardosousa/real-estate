import type { Persona } from "./types";

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

export function getPersona(id: string): Persona | undefined {
  return personas.find((persona) => persona.id === id);
}

/** Personas that can own a listing: the ones who sell. */
export const ownerCandidates: readonly Persona[] = personas.filter(
  (persona) => persona.role !== "backoffice",
);
