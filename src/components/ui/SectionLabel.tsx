import type { ReactNode } from "react";
import { RidgeGlyph } from "./Ridge";

/** Every section opens with this: a 24px ridge glyph and a Label-style line. No numbering. */
export function SectionLabel({
  children,
  className = "",
  tone = "text-fg-muted",
  glyph = "text-accent",
}: {
  children: ReactNode;
  className?: string;
  /** Text colour class; sky stages pass grafite or névoa so the label keeps its contrast. */
  tone?: string;
  glyph?: string;
}) {
  return (
    <p className={`type-label flex items-center gap-3 ${tone} ${className}`}>
      <RidgeGlyph className={glyph} />
      <span>{children}</span>
    </p>
  );
}
