import { neighborhoods, site, stats } from "@/data";

/** Fixed numbers come from the brief (data/site.ts); nothing here is invented. */
const neighborhoodCount = stats.find((stat) => stat.label === "bairros atendidos")?.value;

export interface StoryBeat {
  id: "alvorada" | "dia" | "entardecer" | "noite";
  label: string;
  title: string;
  body: string;
  /** Text colour follows the stage (DESIGN.md "Stage Text Rule"): grafite on light skies, névoa on dark. */
  tone: "light" | "dark";
}

/** The four beats of "A serra": alvorada → dia → entardecer → noite. */
export const storyBeats: readonly StoryBeat[] = [
  {
    id: "alvorada",
    label: "A serra",
    title: "A serra fecha o horizonte.",
    body: "Belo Horizonte quer dizer belo horizonte. A Serra do Curral é a linha que o fecha.",
    tone: "light",
  },
  {
    id: "dia",
    label: "Quem somos",
    title: `Olhamos para essa linha desde ${site.founded}.`,
    body: `Somos ${site.teamSize} pessoas em Belo Horizonte e região metropolitana.`,
    tone: "light",
  },
  {
    id: "entardecer",
    label: "Bairros atendidos",
    title: `Do ${neighborhoods[7].name} a ${neighborhoods[10].city}.`,
    body: `Atendemos ${neighborhoodCount} bairros, de ${neighborhoods[0].name} a ${neighborhoods[10].name}.`,
    tone: "dark",
  },
  {
    id: "noite",
    label: "Imóveis",
    title: "Cada casa tem um horizonte.",
    body: "Ajudamos você a encontrar o seu.",
    tone: "dark",
  },
];

export const skyColor: Record<StoryBeat["id"], string> = {
  alvorada: "bg-sky-alvorada",
  dia: "bg-sky-dia",
  entardecer: "bg-sky-entardecer",
  noite: "bg-sky-noite",
};

/** Same colours as text utilities, for ridge fills that continue into the next stage. */
export const skyFill: Record<StoryBeat["id"], string> = {
  alvorada: "text-sky-alvorada",
  dia: "text-sky-dia",
  entardecer: "text-sky-entardecer",
  noite: "text-sky-noite",
};
