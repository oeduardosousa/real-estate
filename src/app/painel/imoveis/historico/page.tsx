import { Suspense } from "react";
import type { Metadata } from "next";
import { History } from "@/painel/ui/History";

export const metadata: Metadata = { title: "Histórico do imóvel" };

export default function PanelHistory() {
  return (
    <Suspense fallback={null}>
      <History />
    </Suspense>
  );
}
