"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOwnerCandidates, roleLabels } from "../model/personas";
import { createListing } from "../store/store";
import { editorHref, errorText } from "./format";
import { useSession, useTeam } from "./hooks";

/** Creates an empty draft from a title, then opens the editor. Back-office picks the owner; others own it. */
export function NewListing() {
  const persona = useSession();
  useTeam();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const ownerIdField = useId();

  if (!persona) return null;
  const choosesOwner = persona.role !== "corretor";

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 3) {
      setError("Informe o título, com pelo menos 3 caracteres.");
      return;
    }
    const result = createListing(persona, { title: title.trim(), ownerId: ownerId || undefined });
    if (!result.ok) {
      setError(errorText[result.error]);
      return;
    }
    router.push(editorHref(result.value.id));
  };

  return (
    <div className="panel-narrow">
      <p className="panel-muted">
        <Link href="/painel/imoveis" className="panel-row-link">
          ← Imóveis
        </Link>
      </p>
      <header className="panel-heading">
        <h1 className="panel-title">Novo imóvel</h1>
        <p className="panel-lead">
          Comece pelo título. O restante você completa no editor, e tudo é salvo como rascunho.
        </p>
      </header>

      <form onSubmit={submit} noValidate className="panel-card panel-form">
        <div className="panel-field">
          <label htmlFor={titleId}>Título</label>
          <input
            id={titleId}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={error && !ownerId ? true : undefined}
            aria-describedby={error ? `${titleId}-error` : undefined}
            autoFocus
          />
        </div>

        {choosesOwner && (
          <div className="panel-field">
            <label htmlFor={ownerIdField}>Responsável</label>
            <select id={ownerIdField} value={ownerId} onChange={(event) => setOwnerId(event.target.value)}>
              <option value="">{persona.role === "diretoria" ? "Eu mesmo" : "Escolha uma pessoa"}</option>
              {getOwnerCandidates().map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} ({roleLabels[candidate.role]})
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p id={`${titleId}-error`} role="alert" className="panel-error">
            {error}
          </p>
        )}

        <div className="panel-actions">
          <button type="submit" className="panel-button panel-button-primary">
            Criar rascunho
          </button>
          <Link href="/painel/imoveis" className="panel-link">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
