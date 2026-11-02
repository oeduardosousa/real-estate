import type { ReactNode } from "react";

interface PagePlaceholderProps {
  /** Chip above the title (section name). */
  label: string;
  title: string;
  children?: ReactNode;
}

/** Stand-in for pages whose sections are built in later phases. Removed page by page. */
export function PagePlaceholder({ label, title, children }: PagePlaceholderProps) {
  return (
    <section className="container page-stub">
      <p className="eyebrow">
        <span className="dot" /> {label}
      </p>
      <h1 className="t-display page-stub-title">{title}</h1>
      <p className="t-lead page-stub-text">{children ?? "Página em construção."}</p>
    </section>
  );
}
