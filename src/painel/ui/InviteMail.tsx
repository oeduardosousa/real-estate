"use client";

import { useEffect, useState } from "react";
import { buildInvite } from "../model/invite";
import type { Persona } from "../model/types";

/** How long the simulated "sending" state lasts. */
const SENDING_MS = 1100;

type Stage = "sending" | "sent" | "accepted";

/**
 * Simulated invitation e-mail for a person just added to the team. Nothing leaves the browser: it shows the
 * "sending" state, then the mail as the person would read it, and lets the demo play out accepting it.
 */
export function InviteMail({ person, inviter, onClose }: { person: Persona; inviter: Persona; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("sending");
  const mail = buildInvite(person, inviter);

  useEffect(() => {
    const timer = window.setTimeout(() => setStage("sent"), SENDING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (stage === "sending") {
    return (
      <section className="panel-card panel-invite" role="status" aria-label="Enviando convite">
        <p className="panel-invite-sending">
          <span className="panel-invite-spinner" aria-hidden="true" />
          Enviando convite para <strong>{person.email}</strong>
        </p>
      </section>
    );
  }

  return (
    <section className="panel-card panel-invite" aria-labelledby="invite-title">
      <header className="panel-invite-head">
        <div>
          <p className="panel-eyebrow">Simulação de e-mail</p>
          <h2 id="invite-title" className="panel-group-title">
            Convite enviado para {person.name}
          </h2>
          <p className="panel-muted">
            Nada foi enviado de verdade. É assim que a mensagem chegaria na caixa de entrada.
          </p>
        </div>
        <button type="button" className="panel-link" onClick={onClose}>
          Fechar
        </button>
      </header>

      <article className="panel-mail" aria-label="E-mail de convite">
        <dl className="panel-mail-meta">
          <div>
            <dt>De</dt>
            <dd>{mail.from}</dd>
          </div>
          <div>
            <dt>Para</dt>
            <dd>{mail.to}</dd>
          </div>
          <div>
            <dt>Assunto</dt>
            <dd>{mail.subject}</dd>
          </div>
        </dl>
        <div className="panel-mail-body">
          {mail.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {stage === "accepted" ? (
            <p role="status" className="panel-mail-accepted">
              Convite aceito. Em um site real, {person.name.split(" ")[0]} escolheria a senha agora e entraria no painel.
            </p>
          ) : (
            <button type="button" className="panel-button panel-button-primary" onClick={() => setStage("accepted")}>
              {mail.action}
            </button>
          )}
          <p className="panel-muted">{mail.footer}</p>
        </div>
      </article>
    </section>
  );
}
