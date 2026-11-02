"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

/** Registers the always-needed plugins once, on the client. Safe to call repeatedly. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  registered = true;
}

registerGsap();

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

export { gsap, ScrollTrigger, useGSAP };
