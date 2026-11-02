import type { ReactNode } from "react";

interface PagePlaceholderProps {
  /** Label-style line above the title (section name). */
  label: string;
  title: string;
  children?: ReactNode;
}

/** Stand-in for pages whose sections are built in later phases. Removed page by page. */
export function PagePlaceholder({ label, title, children }: PagePlaceholderProps) {
  return (
    <section className="container-page py-section">
      <p className="type-label text-fg-muted">{label}</p>
      <h1 className="mt-6 max-w-[14ch] text-display">{title}</h1>
      <p className="mt-8 max-w-measure text-body-lg text-fg-secondary">
        {children ?? "Página em construção."}
      </p>
    </section>
  );
}
