"use client";

import { useMotionControls } from "@/lib/motion/preference";

/**
 * "Animações: completas / reduzidas" (DESIGN.md "Animation switch"). Sets the same state as
 * prefers-reduced-motion and persists it. When the OS already asks for reduced motion the
 * choice is locked, because a page control must never override a vestibular preference.
 */
export function MotionSwitch({ className = "" }: { className?: string }) {
  const { reduced, lockedByOs, setReduced } = useMotionControls();

  const option = (label: string, value: boolean) => {
    const selected = reduced === value;
    return (
      <button
        type="button"
        aria-pressed={selected}
        disabled={lockedByOs && !value}
        onClick={() => setReduced(value)}
        className={`type-label inline-flex min-h-touch items-center border border-line px-4 transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50 ${
          selected ? "bg-fg text-bg" : "text-fg-secondary hover:text-fg"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={className}>
      <p className="type-label mb-3 text-fg-muted" id="animacoes-label">
        Animações
      </p>
      <div role="group" aria-labelledby="animacoes-label" className="inline-flex">
        {option("Completas", false)}
        {option("Reduzidas", true)}
      </div>
      {lockedByOs && (
        <p className="mt-3 max-w-measure text-label text-fg-muted">
          Seu sistema pede menos movimento, então as animações ficam reduzidas.
        </p>
      )}
    </div>
  );
}
