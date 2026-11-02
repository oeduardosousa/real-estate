import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorPage } from "@/painel/ui/editor/EditorPage";

export const metadata: Metadata = { title: "Editar imóvel" };

/** The listing id is a query parameter (?id=), because a static export cannot know panel-created ids. */
export default function PanelEditListing() {
  return (
    <Suspense fallback={<p className="panel-muted">Carregando…</p>}>
      <EditorPage />
    </Suspense>
  );
}
