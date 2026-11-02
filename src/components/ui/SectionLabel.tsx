import type { ReactNode } from "react";
import { RidgeGlyph } from "./Ridge";

/** Every section opens with this: a 24px ridge glyph and a Label-style line. No numbering. */
export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`type-label flex items-center gap-3 text-fg-muted ${className}`}>
      <RidgeGlyph className="text-accent" />
      <span>{children}</span>
    </p>
  );
}
