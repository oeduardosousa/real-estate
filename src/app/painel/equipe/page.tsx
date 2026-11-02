import type { Metadata } from "next";
import { Team } from "@/painel/ui/Team";

export const metadata: Metadata = { title: "Equipe" };

export default function PanelTeam() {
  return <Team />;
}
