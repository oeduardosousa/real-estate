"use client";

import { useId, useState, type FormEvent } from "react";
import { can } from "../model/permissions";
import { allPersonas, isSeedPersona, roleLabels, roleSummaries } from "../model/personas";
import { ROLES, type Persona, type Role } from "../model/types";
import { addMember, removeMember, NAME_MAX, TITLE_MAX, type TeamError } from "../store/team";
import { usePanelState, useSession, useTeam } from "./hooks";

const addLabels: Record<Role, string> = {
  diretoria: "Adicionar diretor",
  corretor: "Adicionar corretor",
  backoffice: "Adicionar back-office",
};

const titleHints: Record<Role, string> = {
  diretoria: "Ex.: Diretora financeira",
  corretor: "Ex.: Corretor, lançamentos",
  backoffice: "Ex.: Back-office, contratos",
};

const teamErrors: Record<TeamError, string> = {
  forbidden: "Só a Diretoria gerencia a equipe.",
  name_invalid: "Informe o nome, com pelo menos 3 caracteres.",
  title_invalid: "Informe o cargo.",
  name_taken: "Já existe alguém com esse nome na equipe.",
  not_found: "Essa pessoa não está mais na equipe.",
  seed_member: "A equipe original da demonstração não pode ser removida.",
  has_listings: "Antes de remover, passe os imóveis dessa pessoa para outro responsável.",
};

function AddForm({ role, onDone }: { role: Role; onDone: (name: string) => void }) {
  const persona = useSession();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<TeamError | null>(null);
  const nameId = useId();
  const titleId = useId();

  if (!persona) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = addMember(persona, { name, role, title });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onDone(result.value.name);
  };

  return (
    <form onSubmit={submit} noValidate className="panel-card panel-form panel-team-form">
      <div className="panel-form-row">
        <div className="panel-field">
          <label htmlFor={nameId}>Nome</label>
          <input
            id={nameId}
            value={name}
            maxLength={NAME_MAX}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={error === "name_invalid" || error === "name_taken" ? true : undefined}
            autoFocus
          />
        </div>
        <div className="panel-field">
          <label htmlFor={titleId}>Cargo</label>
          <input
            id={titleId}
            value={title}
            maxLength={TITLE_MAX}
            placeholder={titleHints[role]}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={error === "title_invalid" ? true : undefined}
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="panel-error">
          {teamErrors[error]}
        </p>
      )}
      <div className="panel-actions">
        <button type="submit" className="panel-button panel-button-primary">
          Adicionar à equipe
        </button>
        <button type="button" className="panel-link" onClick={() => onDone("")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Member({
  person,
  listingCount,
  canRemove,
  onRemove,
}: {
  person: Persona;
  listingCount: number;
  canRemove: boolean;
  onRemove: (person: Persona) => void;
}) {
  return (
    <li className="panel-member">
      <span className="panel-avatar" aria-hidden="true">
        {person.name.charAt(0)}
      </span>
      <span className="panel-member-text">
        <span className="panel-persona-name">{person.name}</span>
        <span className="panel-muted">{person.title}</span>
        {person.role !== "backoffice" && (
          <span className="panel-muted">
            {listingCount === 1 ? "1 imóvel" : `${listingCount} imóveis`}
          </span>
        )}
      </span>
      {canRemove && (
        <button
          type="button"
          className="panel-button"
          onClick={() => onRemove(person)}
          aria-label={`Remover ${person.name}`}
        >
          Remover
        </button>
      )}
    </li>
  );
}

/** Equipe: everyone in the company, split by role. Diretoria adds and removes people. */
export function Team() {
  const persona = useSession();
  const { listings } = usePanelState();
  useTeam();
  const [adding, setAdding] = useState<Role | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  if (!persona) return null;
  const manages = can(persona, "manage_team");
  const everyone = allPersonas();
  const countFor = (id: string) => listings.filter((listing) => listing.ownerId === id).length;

  const remove = (person: Persona) => {
    const result = removeMember(persona, person.id, countFor(person.id));
    setNotice(
      result.ok
        ? { tone: "ok", text: `${person.name} saiu da equipe.` }
        : { tone: "error", text: teamErrors[result.error] },
    );
  };

  return (
    <div className="panel-team">
      <header className="panel-heading">
        <h1 className="panel-title">Equipe</h1>
        <p className="panel-lead">
          {manages
            ? "Quem trabalha na Curral, por função. Você pode adicionar pessoas à equipe e remover as que adicionou."
            : "Quem trabalha na Curral, por função. Só a Diretoria adiciona ou remove pessoas."}
        </p>
      </header>

      <p role="status" className={notice?.tone === "error" ? "panel-error" : "panel-muted"}>
        {notice?.text}
      </p>

      {ROLES.map((role) => {
        const people = everyone.filter((person) => person.role === role);
        return (
          <section key={role} className="panel-team-section" aria-labelledby={`team-${role}`}>
            <header className="panel-team-head">
              <div>
                <h2 id={`team-${role}`} className="panel-group-title">
                  {roleLabels[role]} <span className="panel-chip-count">{people.length}</span>
                </h2>
                <p className="panel-muted">{roleSummaries[role]}</p>
              </div>
              {manages && adding !== role && (
                <button
                  type="button"
                  className="panel-button"
                  onClick={() => {
                    setAdding(role);
                    setNotice(null);
                  }}
                >
                  {addLabels[role]}
                </button>
              )}
            </header>

            {adding === role && (
              <AddForm
                role={role}
                onDone={(name) => {
                  setAdding(null);
                  if (name) setNotice({ tone: "ok", text: `${name} entrou na equipe.` });
                }}
              />
            )}

            <ul className="panel-member-list">
              {people.map((person) => (
                <Member
                  key={person.id}
                  person={person}
                  listingCount={countFor(person.id)}
                  canRemove={manages && !isSeedPersona(person.id)}
                  onRemove={remove}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
