"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export const VIEW_SWITCH_EVENT = "curral:view-switch";

/** Matches the CSS transitions on `.view-curtain`. */
const COVER_MS = 340;
const LIFT_MS = 500;
/** Lift anyway if the new view has not arrived, so nobody is left behind a blank curtain. */
const FALLBACK_MS = 2500;

type State = "idle" | "cover" | "lift";

/**
 * A night curtain that rises over the screen, hides the swap between the client and company views,
 * then lifts away. It lives in the root shell, so it survives the change of view.
 * Without full motion the route changes at once.
 */
export function ViewCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const timers = useRef<number[]>([]);

  const setState = useCallback((state: State) => {
    if (ref.current) ref.current.dataset.state = state;
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const lift = useCallback(() => {
    pending.current = false;
    clearTimers();
    setState("lift");
    later(() => setState("idle"), LIFT_MS);
  }, [clearTimers, later, setState]);

  useEffect(() => {
    const onSwitch = (event: Event) => {
      const href = (event as CustomEvent<string>).detail;
      if (document.documentElement.dataset.motion !== "full") {
        router.push(href);
        return;
      }
      clearTimers();
      pending.current = true;
      setState("cover");
      later(() => router.push(href), COVER_MS);
      later(lift, FALLBACK_MS);
    };
    window.addEventListener(VIEW_SWITCH_EVENT, onSwitch);
    return () => {
      window.removeEventListener(VIEW_SWITCH_EVENT, onSwitch);
      clearTimers();
    };
  }, [router, clearTimers, later, lift, setState]);

  // The other view is in place.
  useEffect(() => {
    if (!pending.current) return;
    window.scrollTo(0, 0);
    lift();
  }, [pathname, lift]);

  return <div ref={ref} aria-hidden="true" className="view-curtain" data-state="idle" />;
}
