import type { NavLink, Stat } from "./types";

/** Fictional brand facts from BRIEF.md. Invent nothing beyond what the brief states. */
export const site = {
  name: "Curral Residências",
  tagline: "Onde a serra encontra o seu lar.",
  founded: 2009,
  teamSize: 14,
  disclaimer: {
    pt: "Projeto conceitual, empresa fictícia.",
    en: "Concept project, fictional company.",
  },
} as const;

export const stats: readonly Stat[] = [
  { value: "480", label: "imóveis negociados" },
  { value: "17", label: "bairros atendidos" },
  { value: "R$ 1,2 bi", label: "em transações" },
  { value: "96%", label: "de clientes que indicam" },
];

export const navLinks: readonly NavLink[] = [
  { label: "Imóveis", href: "/imoveis" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos", href: "/termos" },
];
