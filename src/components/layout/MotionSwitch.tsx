"use client";

import { useMotionControls } from "@/lib/motion/preference";

/**
 * "Animações: completas / reduzidas". Sets the same state as prefers-reduced-motion and persists it.
 * When the OS already asks for reduced motion the choice is locked, because a page control must never
 * override a vestibular preference.
 */
export function MotionSwitch({ className = "" }: { className?: string }) {
  const { reduced, lockedByOs, setReduced } = useMotionControls();

  const option = (label: string, value: boolean) => (
    <button
      type="button"
      aria-pressed={reduced === value}
      disabled={lockedByOs && !value}
      onClick={() => setReduced(value)}
      className="seg-option"
    >
      {label}
    </button>
  );

  return (
    <div className={className}>
      <p className="foot-label" id="animacoes-label">
        Animações
      </p>
      <div role="group" aria-labelledby="animacoes-label" className="seg">
        {option("Completas", false)}
        {option("Reduzidas", true)}
      </div>
      {lockedByOs && <p className="t-small foot-note">Seu sistema pede menos movimento, então as animações ficam reduzidas.</p>}
    </div>
  );
}
