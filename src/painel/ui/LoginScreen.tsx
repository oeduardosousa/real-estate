"use client";

import { allPersonas, roleLabels, roleSummaries } from "../model/personas";
import { ROLES } from "../model/types";
import { signIn } from "../store/session";
import { useTeam } from "./hooks";

/** Demo login: pick a fictional team member. There is no password and nothing is sent anywhere. */
export function LoginScreen() {
  useTeam();
  return (
    <div className="panel-login">
      <h1 className="panel-title">Entrar no painel</h1>
      <p className="panel-lead">
        Escolha quem você quer ser nesta demonstração. Cada pessoa vê e pode fazer coisas diferentes,
        conforme o papel na equipe.
      </p>

      {ROLES.map((role) => (
        <section key={role} className="panel-persona-group" aria-labelledby={`role-${role}`}>
          <h2 id={`role-${role}`} className="panel-group-title">
            {roleLabels[role]}
          </h2>
          <p className="panel-muted">{roleSummaries[role]}</p>
          <ul className="panel-persona-list">
            {allPersonas()
              .filter((persona) => persona.role === role)
              .map((persona) => (
                <li key={persona.id}>
                  <button type="button" className="panel-persona" onClick={() => signIn(persona.id)}>
                    <span className="panel-avatar" aria-hidden="true">
                      {persona.name.charAt(0)}
                    </span>
                    <span>
                      <span className="panel-persona-name">{persona.name}</span>
                      <span className="panel-muted">{persona.title}</span>
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
