import Link from "next/link";

export type ViewId = "cliente" | "empresa";

const VIEWS: readonly { id: ViewId; label: string; href: string }[] = [
  { id: "cliente", label: "Cliente", href: "/" },
  { id: "empresa", label: "Empresa", href: "/painel" },
];

/**
 * Switches between the public site (client view) and the demo back-office at /painel (company view).
 * Plain links with no page-transition curtain: the two views have separate shells, so the swap is instant.
 */
export function ViewSwitch({ current, className = "" }: { current: ViewId; className?: string }) {
  return (
    <nav aria-label="Alternar visão" className={`view-switch ${className}`}>
      {VIEWS.map((view) => (
        <Link
          key={view.id}
          href={view.href}
          aria-current={view.id === current ? "true" : undefined}
          className="view-switch-option"
        >
          <span className="visually-hidden">Visão </span>
          {view.label}
        </Link>
      ))}
    </nav>
  );
}
