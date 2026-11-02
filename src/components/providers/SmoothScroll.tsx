"use client";

import type { ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { setLenis } from "@/lib/motion/scroll";
import { useMotion } from "@/lib/motion/use-motion";

/**
 * One Lenis instance, driven by the GSAP ticker and synced with ScrollTrigger.
 * The native document scroller is kept (no scroller proxy). Lenis only runs in `full` mode;
 * touch and reduced motion keep native scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useMotion(({ mode }) => {
    if (mode !== "full") return;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });
    setLenis(lenis);

    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      setLenis(null);
      lenis.destroy();
    };
  });

  return children;
}
