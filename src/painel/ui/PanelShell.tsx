"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewSwitch } from "@/components/layout/ViewSwitch";
import { site } from "@/data";
import { roleLabels } from "../model/personas";
import { signOut } from "../store/session";
import { isPersistent } from "../store/store";
import { DemoReset } from "./DemoReset";
import { usePanelState, useSession } from "./hooks";
import { LoginScreen } from "./LoginScreen";

const PANEL_LINKS = [
  { label: "Visão geral", href: "/painel", exact: true, role: null },
  { label: "Imóveis", href: "/painel/imoveis", exact: false, role: null },
  { label: "Revisão", href: "/painel/revisao", exact: false, role: "diretoria" },
  { label: "Equipe", href: "/painel/equipe", exact: false, role: null },
] as const;

/**
 * Shell and route guard for everything under /painel: a demo banner, the top bar, and the persona
 * picker in place of the page until someone is signed in.
 */
export function PanelShell({ children }: { children: ReactNode }) {
  const persona = useSession();
  const pathname = usePathname();
  const { listings } = usePanelState();
  const waiting = listings.filter((listing) => listing.status === "Em revisão").length;

  return (
    <div className="panel">
      <div className="panel-banner" role="note">
        <strong>Demonstração:</strong> empresa fictícia. Os dados ficam só neste navegador e nada é enviado.
        {!isPersistent() && " O armazenamento do navegador está bloqueado; as alterações valem só até recarregar."}
      </div>

      <header className="panel-top">
        <div className="panel-top-inner">
          <Link href="/painel" className="panel-brand">
            {site.name} <span className="panel-brand-tag">Painel</span>
          </Link>

          <ViewSwitch current="empresa" className="panel-top-switch" />

          <div className="panel-top-end">
            {persona && (
              <nav aria-label="Painel" className="panel-nav">
                {PANEL_LINKS.filter((link) => link.role === null || link.role === persona.role).map((link) => {
                  const current = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                  return (
                    <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
                      {link.label}
                      {link.href === "/painel/revisao" && waiting > 0 && (
                        <span className="panel-nav-count">
                          {waiting}
                          <span className="visually-hidden"> aguardando</span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
            {persona && (
              <div className="panel-user">
                <span className="panel-avatar" aria-hidden="true">
                  {persona.name.charAt(0)}
                </span>
                <span className="panel-user-text">
                  <span className="panel-user-name">{persona.name}</span>
                  <span className="panel-muted">{roleLabels[persona.role]}</span>
                </span>
                <button type="button" className="panel-button" onClick={signOut}>
                  Trocar persona
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="panel-main">
        {persona === undefined ? (
          <p role="status" className="panel-muted">
            Carregando…
          </p>
        ) : persona === null ? (
          <LoginScreen />
        ) : (
          children
        )}
      </main>

      <footer className="panel-foot">
        <p>{site.disclaimer.pt}</p>
        <DemoReset />
      </footer>
    </div>
  );
}
