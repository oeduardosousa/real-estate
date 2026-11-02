"use client";

import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { can } from "../model/permissions";
import { allPersonas, roleLabels, roleSummaries } from "../model/personas";
import { ROLES, type Persona, type Role } from "../model/types";
import { addMember, removeMember, NAME_MAX, TITLE_MAX, type TeamError } from "../store/team";
import { usePanelState, useSession, useTeam } from "./hooks";
import { InviteMail } from "./InviteMail";

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
  email_invalid: "Informe um e-mail válido, como nome@empresa.com.br.",
  email_taken: "Já existe alguém na equipe com esse e-mail.",
  name_taken: "Já existe alguém com esse nome na equipe.",
  not_found: "Essa pessoa não está mais na equipe.",
  self: "Você não pode remover a si mesmo. Troque de persona e peça a outra pessoa da Diretoria.",
  last_director: "A empresa precisa de pelo menos uma pessoa na Diretoria.",
  has_listings: "Antes de remover, passe os imóveis dessa pessoa para outro responsável, no editor do imóvel.",
};

function AddForm({ role, onDone }: { role: Role; onDone: (added: Persona | null) => void }) {
  const persona = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<TeamError | null>(null);
  const nameId = useId();
  const emailId = useId();
  const titleId = useId();

  if (!persona) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = addMember(persona, { name, email, role, title });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onDone(result.value);
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
          <label htmlFor={emailId}>E-mail</label>
          <input
            id={emailId}
            type="email"
            value={email}
            autoComplete="off"
            placeholder="nome@empresa.com.br"
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={error === "email_invalid" || error === "email_taken" ? true : undefined}
          />
        </div>
      </div>
      <div className="panel-form-row">
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
          Cadastrar e enviar convite
        </button>
        <button type="button" className="panel-link" onClick={() => onDone(null)}>
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
        {person.email && <span className="panel-muted">{person.email}</span>}
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

/** Shown right under the person who cannot be removed yet. Loud on purpose: it blocks the action. */
function RemovalBlocked({ person }: { person: Persona }) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest" });
  }, []);
  return (
    <li ref={ref} role="alert" className="panel-callout">
      <span className="panel-callout-mark" aria-hidden="true">
        !
      </span>
      <div>
        <p className="panel-callout-title">Remoção bloqueada: {person.name} ainda tem imóveis</p>
        <p className="panel-callout-text">{teamErrors.has_listings}</p>
      </div>
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
  const [invite, setInvite] = useState<Persona | null>(null);
  /** Person whose removal was refused because they still own listings. */
  const [blockedId, setBlockedId] = useState<string | null>(null);

  if (!persona) return null;
  const manages = can(persona, "manage_team");
  const everyone = allPersonas();
  const countFor = (id: string) => listings.filter((listing) => listing.ownerId === id).length;

  const remove = (person: Persona) => {
    const result = removeMember(persona, person.id, countFor(person.id));
    setBlockedId(!result.ok && result.error === "has_listings" ? person.id : null);
    if (!result.ok && result.error === "has_listings") {
      setNotice(null);
      return;
    }
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
            ? "Quem trabalha na Curral, por função. Você pode cadastrar pessoas novas e remover quem saiu da equipe."
            : "Quem trabalha na Curral, por função. Só a Diretoria adiciona ou remove pessoas."}
        </p>
      </header>

      <p role="status" className={notice?.tone === "error" ? "panel-error" : "panel-muted"}>
        {notice?.text}
      </p>

      {invite && <InviteMail key={invite.id} person={invite} inviter={persona} onClose={() => setInvite(null)} />}

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
                  className="panel-button panel-button-primary"
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
                onDone={(added) => {
                  setAdding(null);
                  if (!added) return;
                  setNotice({ tone: "ok", text: `${added.name} entrou na equipe.` });
                  setInvite(added);
                }}
              />
            )}

            <ul className="panel-member-list">
              {people.map((person) => (
                <Fragment key={person.id}>
                  <Member
                    person={person}
                    listingCount={countFor(person.id)}
                    canRemove={manages && person.id !== persona.id}
                    onRemove={remove}
                  />
                  {blockedId === person.id && <RemovalBlocked person={person} />}
                </Fragment>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
