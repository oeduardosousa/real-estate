"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import "@/lib/motion/gsap";
import { SmoothScroll } from "./SmoothScroll";

/**
 * Client providers for the whole app, in dependency order:
 * GSAP plugins are registered on import, Lenis runs once, and the page-transition shell wraps the routes.
 * Header, footer, cursor and loader mount inside this tree in later phases.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Tells the CSS failsafes that GSAP is in charge: pre-reveal states are now ours to resolve.
  useLayoutEffect(() => {
    document.documentElement.dataset.ready = "";
  }, []);

  return (
    <SmoothScroll>
      <PageTransition>{children}</PageTransition>
    </SmoothScroll>
  );
}
