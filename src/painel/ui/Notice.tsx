import type { ReactNode } from "react";
import Link from "next/link";

/** A plain full-page message with one way back. Used for unknown ids and missing access. */
export function Notice({
  title,
  children,
  backHref = "/painel/imoveis",
  backLabel = "Voltar para Imóveis",
}: {
  title: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="panel-narrow">
      <h1 className="panel-title">{title}</h1>
      <p className="panel-lead">{children}</p>
      <p>
        <Link href={backHref} className="panel-button">
          {backLabel}
        </Link>
      </p>
    </div>
  );
}
