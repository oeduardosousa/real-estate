import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Sobre" };

export default function AboutPage() {
  return <PagePlaceholder label="Sobre" title="Sobre e equipe" />;
}
