import { TransitionLink } from "./TransitionLink";

/**
 * "Curral Residências" in Hanken 400 with 0.02em tracking and a small ridge glyph above the "ê"
 * (DESIGN.md "Navigation"). The visible text is hidden from assistive tech in favour of the link label.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <TransitionLink
      href="/"
      aria-label="Curral Residências, página inicial"
      className={`inline-flex min-h-touch items-center text-title font-normal tracking-[0.02em] ${className}`}
    >
      <span aria-hidden="true">
        Curral Resid
        <span className="relative inline-block">
          ê
          <svg
            viewBox="0 0 24 10"
            className="absolute -top-[0.12em] left-1/2 w-[0.5em] -translate-x-1/2 text-accent"
            aria-hidden="true"
          >
            <path
              d="M0 8.5 C3 8 5 6 8 6.4 C10.5 6.8 12 3 14.5 2 C17 1 18 4.5 20.5 5.6 C22 6.3 23 6.2 24 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
        ncias
      </span>
    </TransitionLink>
  );
}
