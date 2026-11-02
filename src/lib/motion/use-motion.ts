"use client";

import type { DependencyList, RefObject } from "react";
import { MEDIA, type MotionMode } from "./config";
import { gsap, useGSAP } from "./gsap";
import { useSiteReducedMotion } from "./preference";

export interface MotionSetup {
  /** `full`: desktop, fine pointer. `light`: mobile/touch. `reduced`: OS or site switch. */
  mode: MotionMode;
  /** Wrap event handlers and async callbacks so their tweens are reverted with the context. */
  contextSafe: <T extends (...args: never[]) => unknown>(fn: T) => T;
}

export interface UseMotionConfig {
  /** Element that scopes selector strings and cleanup. */
  scope?: RefObject<Element | null>;
  /** Extra values that should re-run the setup, like useGSAP dependencies. */
  dependencies?: DependencyList;
}

/**
 * The one way components create GSAP animation (CLAUDE.md: useGSAP with cleanup, matchMedia).
 *
 * Runs `setup` inside gsap.matchMedia() with the three DESIGN.md contexts and hands it the
 * resolved mode. Tweens and ScrollTriggers made in `setup` are reverted when the breakpoint
 * changes, when the animation switch flips, and on unmount. Return a function to add your own cleanup.
 *
 * Reduced mode is where you set the final state and, at most, a short opacity fade.
 */
export function useMotion(
  setup: (motion: MotionSetup) => void | (() => void),
  { scope, dependencies = [] }: UseMotionConfig = {},
) {
  const siteReduced = useSiteReducedMotion();

  return useGSAP(
    () => {
      const mm = gsap.matchMedia(scope?.current ?? undefined);

      mm.add(MEDIA, (context) => {
        const { full, reduced } = (context.conditions ?? {}) as Record<string, boolean>;
        const mode: MotionMode = siteReduced || reduced ? "reduced" : full ? "full" : "light";
        return setup({
          mode,
          contextSafe: context.contextSafe as MotionSetup["contextSafe"],
        });
      });

      return () => mm.revert();
    },
    { scope, dependencies: [siteReduced, ...dependencies], revertOnUpdate: true },
  );
}
