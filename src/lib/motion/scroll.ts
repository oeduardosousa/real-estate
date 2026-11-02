import type Lenis from "lenis";

/**
 * The single Lenis instance, set by SmoothScroll in full mode only.
 * On touch, reduced motion and before mount this is null and native scroll is used.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

interface ScrollOptions {
  offset?: number;
  immediate?: boolean;
}

/** Scrolls to an element, selector or pixel position, through Lenis when it is running. */
export function scrollTo(target: string | Element | number, { offset = 0, immediate }: ScrollOptions = {}) {
  if (instance) {
    instance.scrollTo(target, { offset, immediate });
    return;
  }

  const behavior: ScrollBehavior =
    immediate || document.documentElement.dataset.motion === "reduced" ? "auto" : "smooth";

  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }

  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
