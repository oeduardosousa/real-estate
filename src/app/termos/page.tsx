import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Termos" };

export default function TermsPage() {
  return (
    <PagePlaceholder label="Legal" title="Termos">
      Texto de exemplo. Projeto conceitual, empresa fictícia: nenhum serviço é oferecido.
    </PagePlaceholder>
  );
}
