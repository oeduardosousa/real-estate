import { RidgeGlyph } from "@/components/ui/Ridge";
import { TransitionLink } from "./TransitionLink";

/** Ridge glyph in a soft disc, then the name in the display serif. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <TransitionLink href="/" aria-label="Curral Residências, página inicial" className={`wordmark ${className}`}>
      <span className="wordmark-disc" aria-hidden="true">
        <RidgeGlyph />
      </span>
      <span className="wordmark-name" aria-hidden="true">
        Curral <em>Residências</em>
      </span>
    </TransitionLink>
  );
}
