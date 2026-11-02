"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { AmbientObserver } from "@/components/motion/AmbientObserver";
import { Spotlight } from "@/components/motion/Spotlight";
import "@/lib/motion/gsap";
import { SmoothScroll } from "./SmoothScroll";

/**
 * Client providers for the whole app: GSAP plugins are registered on import, Lenis runs once,
 * the page-transition shell wraps the routes, and Spotlight feeds the soft hover glow.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Tells the CSS failsafes that hydration happened: hidden pre-reveal states are now the app's to resolve.
  useLayoutEffect(() => {
    document.documentElement.dataset.ready = "";
  }, []);

  return (
    <SmoothScroll>
      <PageTransition>{children}</PageTransition>
      <Spotlight />
      <AmbientObserver />
    </SmoothScroll>
  );
}
