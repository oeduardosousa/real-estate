"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP core + ScrollTrigger, registered once. Never import this file statically from a component:
 * it would put GSAP in the initial bundle. Go through `loadGsap()` (or `useMotion`) so the library
 * arrives in its own chunk after hydration (DESIGN.md performance budget).
 */
gsap.registerPlugin(ScrollTrigger);

let splitTextPromise: Promise<typeof import("gsap/SplitText")["SplitText"]> | undefined;
let flipPromise: Promise<typeof import("gsap/Flip")["Flip"]> | undefined;

/** SplitText loads on demand (DESIGN.md performance budget). Await it, then split. */
export function loadSplitText() {
  splitTextPromise ??= import("gsap/SplitText").then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  });
  return splitTextPromise;
}

/** Flip loads on demand: it is only needed for the card-to-detail transition and list reorders. */
export function loadFlip() {
  flipPromise ??= import("gsap/Flip").then(({ Flip }) => {
    gsap.registerPlugin(Flip);
    return Flip;
  });
  return flipPromise;
}

export { gsap, ScrollTrigger };
