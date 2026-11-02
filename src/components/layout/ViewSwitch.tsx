"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { VIEW_SWITCH_EVENT } from "./ViewCurtain";

export type ViewId = "cliente" | "empresa";

const VIEWS: readonly { id: ViewId; label: string; href: string }[] = [
  { id: "cliente", label: "Cliente", href: "/" },
  { id: "empresa", label: "Empresa", href: "/painel" },
];

/**
 * Switches between the public site (client view) and the demo back-office at /painel (company view).
 * The click hands the route change to ViewCurtain, which covers the screen while the two shells swap.
 */
export function ViewSwitch({ current, className = "" }: { current: ViewId; className?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: ViewId, href: string) => {
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified || id === current) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent(VIEW_SWITCH_EVENT, { detail: href }));
  };

  return (
    <nav aria-label="Alternar visão" className={`view-switch ${className}`}>
      {VIEWS.map((view) => (
        <Link
          key={view.id}
          href={view.href}
          aria-current={view.id === current ? "true" : undefined}
          className="view-switch-option"
          onClick={(event) => onClick(event, view.id, view.href)}
        >
          <span className="visually-hidden">Visão </span>
          {view.label}
        </Link>
      ))}
    </nav>
  );
}
