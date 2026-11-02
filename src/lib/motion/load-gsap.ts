export type GsapModule = typeof import("./gsap");

let promise: Promise<GsapModule> | undefined;
let loaded: GsapModule | undefined;

/** Loads GSAP + ScrollTrigger in their own chunk, once. Safe to call from anywhere on the client. */
export function loadGsap(): Promise<GsapModule> {
  promise ??= import("./gsap").then((mod) => {
    loaded = mod;
    return mod;
  });
  return promise;
}

/** The module if it has already arrived, otherwise undefined. Lets event handlers stay synchronous. */
export function getGsap(): GsapModule | undefined {
  return loaded;
}

/**
 * Starts the GSAP download on the first sign of use (pointer, touch, key) or after a long idle,
 * so page transitions are ready by the time somebody navigates, without costing the initial load.
 */
export function prefetchGsapOnIntent() {
  if (loaded || typeof window === "undefined") return () => {};
  const events = ["pointerdown", "pointerover", "touchstart", "keydown"] as const;
  const start = () => {
    cleanup();
    void loadGsap();
  };
  const idle = window.setTimeout(start, 8000);
  const cleanup = () => {
    window.clearTimeout(idle);
    events.forEach((name) => window.removeEventListener(name, start));
  };
  events.forEach((name) => window.addEventListener(name, start, { once: true, passive: true }));
  return cleanup;
}
