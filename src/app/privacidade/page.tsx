import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Privacidade" };

export default function PrivacyPage() {
  return (
    <PagePlaceholder label="Legal" title="Privacidade">
      Texto de exemplo. Projeto conceitual, empresa fictícia: nenhum dado é coletado ou enviado.
    </PagePlaceholder>
  );
}
