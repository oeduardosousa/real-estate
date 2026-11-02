"use client";

import { useEffect, useState, useSyncExternalStore, type DependencyList, type RefObject } from "react";
import { MEDIA, type MotionMode } from "./config";
import type { GsapModule } from "./load-gsap";
import { loadGsap } from "./load-gsap";
import { useSiteReducedMotion } from "./preference";

export interface MotionSetup {
  /** `full`: desktop, fine pointer. `light`: mobile/touch. `reduced`: OS or site switch. */
  mode: MotionMode;
  /** Wrap event handlers and async callbacks so their tweens are reverted with the context. */
  contextSafe: <T extends (...args: never[]) => unknown>(fn: T) => T;
  /** GSAP, loaded lazily: use these instead of importing the library. */
  gsap: GsapModule["gsap"];
  ScrollTrigger: GsapModule["ScrollTrigger"];
}

export interface UseMotionConfig {
  /** Element that scopes selector strings and cleanup. */
  scope?: RefObject<Element | null>;
  /** Extra values that should re-run the setup. */
  dependencies?: DependencyList;
  /** False skips loading GSAP altogether (a component that only animates in some cases). Default true. */
  enabled?: boolean;
}

/** Resolves the motion mode right now, outside React and without GSAP. */
export function resolveMotionMode(siteReduced: boolean): MotionMode {
  if (siteReduced || window.matchMedia(MEDIA.reduced).matches) return "reduced";
  return window.matchMedia(MEDIA.full).matches ? "full" : "light";
}

/** Live result of a media query; false on the server and until hydration. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * True once `ref` is within `margin` of the viewport, and stays true. Lets below-the-fold animation wait
 * for GSAP until the reader is close, so it stays out of the first load.
 */
export function useNearViewport(ref: RefObject<Element | null>, margin = "600px"): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (near || !el) return;
    if (!("IntersectionObserver" in window)) {
      queueMicrotask(() => setNear(true));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: `${margin} 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);
  return near;
}

/**
 * The one way components create GSAP animation (CLAUDE.md: cleanup, matchMedia).
 *
 * GSAP is not in the initial bundle: the first component that needs it triggers the download after
 * hydration. `setup` then runs inside gsap.matchMedia() with the three DESIGN.md contexts and gets the
 * resolved mode plus the library. Tweens and ScrollTriggers made in `setup` are reverted when the
 * breakpoint changes, when the animation switch flips, and on unmount. Return a function for extra cleanup.
 *
 * Reduced mode is where you set the final state and, at most, a short opacity fade.
 */
export function useMotion(
  setup: (motion: MotionSetup) => void | (() => void),
  { scope, dependencies = [], enabled = true }: UseMotionConfig = {},
) {
  const siteReduced = useSiteReducedMotion();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia(scope?.current ?? undefined);
      mm.add(MEDIA, (context) => {
        const { full, reduced } = (context.conditions ?? {}) as Record<string, boolean>;
        const mode: MotionMode = siteReduced || reduced ? "reduced" : full ? "full" : "light";
        return setup({
          mode,
          contextSafe: context.contextSafe as MotionSetup["contextSafe"],
          gsap,
          ScrollTrigger,
        });
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
    // `setup` is intentionally not a dependency: callers pass inline closures, like useGSAP's callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteReduced, enabled, scope, ...dependencies]);
}
