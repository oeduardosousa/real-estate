"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { can } from "../../model/permissions";
import { usePanelState, useSession } from "../hooks";
import { Editor } from "./Editor";

function Notice({ title, children }: { title: string; children: string }) {
  return (
    <div className="panel-narrow">
      <h1 className="panel-title">{title}</h1>
      <p className="panel-lead">{children}</p>
      <p>
        <Link href="/painel/imoveis" className="panel-button">
          Voltar para Imóveis
        </Link>
      </p>
    </div>
  );
}

/** Route guard for the editor: unknown ids and listings the persona may not see get a plain notice. */
export function EditorPage() {
  const persona = useSession();
  const { listings } = usePanelState();
  const idParam = useSearchParams().get("id");

  if (!persona) return null;
  const listing = idParam ? listings.find((item) => String(item.id) === idParam) : undefined;

  if (!listing) return <Notice title="Imóvel não encontrado">Esse endereço não corresponde a nenhum imóvel.</Notice>;
  if (!can(persona, "view", listing)) {
    return <Notice title="Sem acesso">Você só vê os seus imóveis e os que já estão publicados.</Notice>;
  }
  // Keyed so switching listings or personas starts from fresh form state.
  return <Editor key={`${listing.id}-${persona.id}`} listing={listing} persona={persona} />;
}
